import json
import logging
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.aihub import AIHubService, OLLAMA_MODEL
from schemas.aihub import GenTxtRequest, ChatMessage, AnalyzePdfRequest

router = APIRouter(prefix="/api/v1/portfolio", tags=["portfolio"])
logger = logging.getLogger(__name__)


class ParseResumeRequest(BaseModel):
    pdf_data_uri: str
    file_type: str = "pdf"


class GenerateContentRequest(BaseModel):
    parsed_data: dict
    user_type: str = "professional"


class ExportPortfolioRequest(BaseModel):
    portfolio_data: dict
    template_id: str = "minimal"
    customization: Optional[dict] = None


PARSE_RESUME_PROMPT = """You are an expert resume parser. Analyze the provided resume and extract ALL information into a structured JSON format.

CRITICAL PARSING RULES:
1. Separate Experience from Certifications: Certifications often contain keywords like "Certified", "AWS", "CPA", "Coursera", "Certificate". DO NOT include certifications under "experience" or vice-versa.
2. Clean duplicate text: If there are malformed, duplicated lines or garbage characters from PDF extraction, clean them up and merge logical sentences.
3. No raw text dumping: Do not just dump the raw text into the JSON fields. Synthesize and format it neatly.
4. Return ONLY valid JSON matching the exact structure below. Do NOT wrap it in markdown blockquotes like ```json.

REQUIRED JSON STRUCTURE:
{
  "name": "Full Name",
  "title": "Professional Title or Current Role",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, Country",
  "linkedin": "linkedin url if found",
  "github": "github url if found",
  "website": "personal website if found",
  "summary": "Brief professional summary from resume",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Start - End",
      "description": "Brief description of role",
      "highlights": ["achievement1", "achievement2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type and Field",
      "duration": "Start - End",
      "gpa": "GPA if mentioned",
      "highlights": ["achievement1"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"],
      "link": "project url if found"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "languages": ["language1", "language2"],
  "interests": ["interest1", "interest2"]
}

If a field is not found, use an empty string or empty array. Prefer accuracy and keep the JSON valid regardless of resume formatting."""


CLASSIFY_USER_PROMPT = """Based on the following parsed resume data, generate an enhanced professional bio and summary. Keep it simple and flat.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "enhanced_bio": "A compelling 2-3 sentence professional bio written in first person",
  "enhanced_summary": "An engaging professional summary paragraph (3-4 sentences)"
}

Resume data:
"""


@router.post("/parse")
async def parse_resume(data: ParseResumeRequest):
    """Parse a resume using AI PDF analysis and generate enhanced content."""
    try:
        service = AIHubService()

        # Step 1: Parse the resume using PDF analysis
        # Don't set page_end to avoid exceeding actual page count for short resumes
        pdf_request = AnalyzePdfRequest(
            pdf=data.pdf_data_uri,
            instruction=PARSE_RESUME_PROMPT,
            mode="extract",
            page_start=1,
        )
        pdf_response = await service.analyze_pdf(pdf_request)
        raw_parsed = pdf_response.result

        # Try to extract JSON from the response
        parsed_data = _extract_json(raw_parsed)

        # Step 2: Classify user and generate enhanced content
        enhanced_data = {}
        try:
            classify_request = GenTxtRequest(
                messages=[
                    ChatMessage(role="system", content="You are an expert career coach and content writer. Return ONLY valid JSON."),
                    ChatMessage(role="user", content=CLASSIFY_USER_PROMPT + json.dumps(parsed_data, indent=2))
                ],
                model=OLLAMA_MODEL
            )
            classify_response = await service.gentxt(classify_request)
            enhanced_data = _extract_json(classify_response.content)
        except Exception as e:
            logger.warning(f"Failed to generate enhanced content, continuing without it. Error: {e}")

        return {
            "success": True,
            "parsed_data": parsed_data,
            "enhanced_data": enhanced_data,
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        raise HTTPException(status_code=422, detail=f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Resume parsing error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")


def _extract_json(text: str) -> dict:
    """Extract JSON from text that might contain markdown code blocks or extra surrounding text."""
    if not text:
        raise json.JSONDecodeError("Empty response from AI.", "", 0)
        
    cleaned = text.strip()
    
    # Remove common LLM conversational prefix/suffix
    # Look for the first { or [ and the last } or ]
    first_brace = cleaned.find('{')
    first_bracket = cleaned.find('[')
    
    start_idx = -1
    if first_brace != -1 and (first_bracket == -1 or first_brace < first_bracket):
        start_idx = first_brace
    elif first_bracket != -1:
        start_idx = first_bracket
        
    if start_idx == -1:
        logger.error(f"No JSON start found in text: {text[:200]}...")
        raise json.JSONDecodeError("Unable to find JSON object or array.", text, 0)
        
    # Try to find the matching closing character
    # We use a simple stack-based approach from the end
    last_brace = cleaned.rfind('}')
    last_bracket = cleaned.rfind(']')
    
    end_idx = -1
    if last_brace != -1 and (last_bracket == -1 or last_brace > last_bracket):
        end_idx = last_brace
    elif last_bracket != -1:
        end_idx = last_bracket
        
    if end_idx == -1 or end_idx < start_idx:
        # If no end found, it might be truncated. Let's try to append '}' or ']'
        end_idx = len(cleaned) - 1
        if cleaned[start_idx] == '{':
            cleaned += '}'
        else:
            cleaned += ']'
        end_idx += 1
        
    candidate = cleaned[start_idx:end_idx + 1]
    
    # Pre-process candidate to fix common LLM JSON errors
    # 1. Remove trailing commas in arrays/objects
    candidate = re.sub(r',\s*([\]}])', r'\1', candidate)
    
    try:
        return json.loads(candidate)
    except json.JSONDecodeError as e:
        # If it fails, try a more aggressive approach: 
        # find the largest valid JSON substring
        for i in range(len(candidate), start_idx, -1):
            try:
                return json.loads(candidate[:i])
            except:
                continue
        
        logger.error(f"Final JSON parse failed. Content: {candidate[:500]}...")
        raise e