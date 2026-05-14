# AI Resume-to-Portfolio Converter - Development Plan

## Design Guidelines

### Design References
- **Canva.com**: Clean upload flow, template selection
- **Read.cv**: Minimalist portfolio aesthetic
- **Style**: Modern Dark + Gradient Accents + Glass Morphism

### Color Palette
- Primary Background: #0F0F1A (Deep Navy)
- Secondary Background: #1A1A2E (Dark Purple)
- Card Background: #16213E (Dark Blue)
- Accent Primary: #7C3AED (Violet)
- Accent Secondary: #06B6D4 (Cyan)
- Accent Gradient: linear-gradient(135deg, #7C3AED, #06B6D4)
- Text Primary: #FFFFFF
- Text Secondary: #94A3B8
- Success: #10B981
- Border: #2D2D44

### Typography
- Headings: Inter font-weight 700
- Body: Inter font-weight 400
- Accent: Inter font-weight 600

### Key Component Styles
- Buttons: Gradient background (violet to cyan), white text, 12px rounded, hover: scale 1.02
- Cards: Glass morphism with backdrop-blur, border 1px rgba(255,255,255,0.1), 16px rounded
- Upload Zone: Dashed border, gradient on hover, large drop area
- Progress Steps: Connected dots with gradient line

### Images to Generate
1. **hero-bg-abstract-gradient.jpg** - Abstract gradient mesh background with violet and cyan tones, dark theme (Style: minimalist, 1024x576)
2. **template-minimal-preview.jpg** - Preview of a minimal portfolio template, clean white design with profile photo placeholder (Style: minimalist, 1024x768)
3. **template-creative-preview.jpg** - Preview of a creative portfolio template, bold colors and dynamic layout (Style: minimalist, 1024x768)
4. **template-developer-preview.jpg** - Preview of a developer portfolio template, dark theme with code elements (Style: minimalist, 1024x768)
5. **template-corporate-preview.jpg** - Preview of a corporate portfolio template, professional blue tones (Style: minimalist, 1024x768)

---

## Architecture Overview

### Flow
1. User uploads resume (PDF/DOCX) → stored in Object Storage
2. AI parses resume via PDF analysis → extracts structured data
3. AI generates enhanced content (bio, summaries) via text generation
4. User selects template → preview generated portfolio
5. User can customize text/colors → real-time preview
6. One-click export as HTML

### Backend
- Object Storage bucket: "resumes" for uploaded files
- Custom API endpoint: `/api/v1/portfolio/parse` - orchestrates AI parsing + content generation
- Custom API endpoint: `/api/v1/portfolio/generate` - generates portfolio HTML for export
- AI Models: PDF analysis (analyzepdf), text generation (deepseek-v3.2)

### Frontend Pages
- `/` - Landing page with upload zone
- `/builder` - Portfolio builder with template selection, preview, customization

---

## Development Tasks

### Files to Create/Modify (8 file limit)

1. **frontend/src/pages/Index.tsx** - Landing page with hero section + drag-and-drop upload
2. **frontend/src/pages/Builder.tsx** - Main builder page: template selection, live preview, customization panel, export
3. **frontend/src/components/ResumeUploader.tsx** - Drag-and-drop upload component with progress
4. **frontend/src/components/PortfolioPreview.tsx** - Live portfolio preview renderer
5. **frontend/src/components/TemplateSelector.tsx** - Template cards for selection
6. **frontend/src/components/CustomizationPanel.tsx** - Color/font/section customization
7. **frontend/src/lib/portfolio-templates.ts** - Template definitions (4 templates: minimal, creative, developer, corporate)
8. **backend/routers/portfolio.py** - API endpoint for resume parsing + content generation + HTML export

### Modified Files
- **frontend/src/App.tsx** - Add /builder route