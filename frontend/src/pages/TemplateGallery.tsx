import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeRegistry, THEME_PRESETS, type CustomizationOptions } from "@/lib/portfolio-templates";
import { cn } from "@/lib/utils";
import PortfolioPreview from "@/components/PortfolioPreview";

interface PortfolioData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  bio: string;
  skills: string[];
  experience: any[];
  education: any[];
  projects: any[];
  certifications: string[];
  languages: string[];
  interests: string[];
  profileImage: string | null;
}

const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "students", name: "For Students" },
  { id: "freshers", name: "For Freshers" },
  { id: "professionals", name: "For Professionals" },
  { id: "freelancers", name: "For Freelancers" },
  { id: "creatives", name: "For Creatives" },
];

const TEMPLATE_STYLES = [
  { id: "minimal", name: "Minimal", icon: "🎯" },
  { id: "bold", name: "Bold", icon: "💪" },
  { id: "elegant", name: "Elegant", icon: "✨" },
  { id: "modern", name: "Modern", icon: "🚀" },
];

const PERSONALITY_TYPES = [
  { id: "professional", name: "Professional" },
  { id: "creative", name: "Creative" },
  { id: "friendly", name: "Friendly" },
  { id: "academic", name: "Academic" },
];

interface TemplateCardProps {
  template: any;
  portfolioData: PortfolioData;
  onPreview: () => void;
  onSelect: () => void;
}

function TemplateCard({ template, portfolioData, onPreview, onSelect }: TemplateCardProps) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/10">
      {/* Gradient Preview */}
      <div className="h-48 bg-gradient-to-br from-violet-500 via-emerald-500 to-cyan-500 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${template.defaultColors.primary}, ${template.defaultColors.accent})`,
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-white text-lg">{template.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{template.description}</p>
        </div>

        {/* Color Variants Preview */}
        <div className="flex gap-1.5">
          {template.colorVariants?.slice(0, 4).map((variant: any) => (
            <div
              key={variant.id}
              className="w-6 h-6 rounded-lg border border-white/20"
              style={{ background: variant.colors.primary }}
              title={variant.name}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onPreview}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs border-white/20 hover:border-white/40"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          <Button onClick={onSelect} size="sm" className="flex-1 h-8 text-xs bg-violet-600 hover:bg-violet-500">
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PreviewModalProps {
  template: any;
  portfolioData: PortfolioData;
  onClose: () => void;
  onSelect: () => void;
}

function PreviewModal({ template, portfolioData, onClose, onSelect }: PreviewModalProps) {
  const customization: CustomizationOptions = {
    themeId: template.id,
    colors: template.defaultColors,
    fonts: {
      heading: "Inter",
      body: "Inter",
      mono: "Fira Code",
    },
    animation: {
      scrollType: "fade-up",
      hoverEffects: ["scale", "glow"],
      scrollThreshold: 0.5,
      staggerReveal: true,
      staggerIncrement: 50,
      reducedMotion: false,
    },
    visualStyle: {
      glassmorphism: false,
      glassBlur: 10,
      glassOpacity: 0.1,
      shadowLevel: "medium",
      auroraBackground: false,
      auroraColors: ["#6366F1", "#EC4899"],
      meshGradient: false,
      meshColors: ["#3B82F6", "#8B5CF6"],
      spotlightEffect: false,
      spotlightColor: "#FFFFFF",
      patternOverlay: "none",
      gradientAngle: 135,
    },
    sectionInstances: [
      { id: "hero", type: "hero", label: "About Me", visible: true },
      { id: "skills", type: "skills", label: "Skills", visible: true },
      { id: "experience", type: "experience", label: "Experience", visible: true },
      { id: "projects", type: "projects", label: "Projects", visible: true },
      { id: "contact", type: "contact", label: "Contact", visible: true },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0A10] rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">{template.name}</h2>
            <p className="text-sm text-slate-400 mt-1">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div
          className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-black"
          onWheel={(e) => {
            try {
              const t = e.currentTarget as HTMLElement;
              // Manually scroll the container to ensure wheel events move content
              t.scrollTop += e.deltaY;
              e.stopPropagation();
            } catch (err) {
              /* ignore */
            }
          }}
        >
          <div className="p-4">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white">
              <PortfolioPreview data={portfolioData} customization={customization} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#05050A]">
          <p className="text-xs text-slate-400">Preview with your parsed resume data</p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="border-white/20">
              Close
            </Button>
            <Button onClick={onSelect} className="bg-violet-600 hover:bg-violet-500">
              Use This Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateGallery() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    parsedData: any;
    enhancedData: any;
    fileName: string;
  } | null;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  // Prepare portfolio data from parsed resume
  const portfolioData: PortfolioData = useMemo(() => {
    if (!state) {
      return {
        name: "John Doe",
        title: "Software Engineer",
        email: "john@example.com",
        phone: "",
        location: "San Francisco, CA",
        linkedin: "",
        github: "",
        website: "",
        summary: "Passionate software engineer with experience in building web applications.",
        bio: "I'm a passionate software engineer who loves building products that make a difference.",
        skills: ["JavaScript", "React", "Node.js", "Python"],
        experience: [
          {
            company: "Tech Corp",
            role: "Software Engineer",
            duration: "2022 - Present",
            description: "Building scalable web applications",
            highlights: ["Led team of 5 engineers", "Improved performance by 40%"],
          },
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "B.S. Computer Science",
            duration: "2018 - 2022",
            gpa: "3.8",
            highlights: ["Dean's List"],
          },
        ],
        projects: [
          {
            name: "Portfolio Builder",
            description: "AI-powered portfolio generator",
            technologies: ["React", "AI"],
            link: "",
          },
        ],
        certifications: [],
        languages: ["English"],
        interests: ["Open Source"],
        profileImage: null,
      };
    }

    const { parsedData, enhancedData } = state;
    return {
      name: parsedData.name || "Your Name",
      title: parsedData.title || "Professional",
      email: parsedData.email || "",
      phone: parsedData.phone || "",
      location: parsedData.location || "",
      linkedin: parsedData.linkedin || "",
      github: parsedData.github || "",
      website: parsedData.website || "",
      summary: enhancedData?.enhanced_summary || parsedData.summary || "",
      bio: enhancedData?.enhanced_bio || parsedData.summary || "",
      skills: parsedData.skills || [],
      experience: (parsedData.experience || []).map((exp: any, i: number) => ({
        company: exp.company || "",
        role: exp.role || "",
        duration: exp.duration || "",
        description: exp.description || "",
        highlights: exp.highlights || [],
      })),
      education: (parsedData.education || []).map((edu: any) => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        duration: edu.duration || "",
        gpa: edu.gpa || "",
        highlights: edu.highlights || [],
      })),
      projects: (parsedData.projects || []).map((proj: any) => ({
        name: proj.name || "",
        description: proj.description || "",
        technologies: proj.technologies || [],
        link: proj.link || "",
      })),
      certifications: parsedData.certifications || [],
      languages: parsedData.languages || [],
      interests: parsedData.interests || [],
      profileImage: null,
    };
  }, [state]);

  // Filter templates based on search, category, style, and personality
  const filteredTemplates = useMemo(() => {
    return THEME_PRESETS.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || selectedCategory === template.id.split("-")[0];

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectTemplate = (templateId: string) => {
    const template = THEME_PRESETS.find((t) => t.id === templateId);
    navigate("/builder", {
      state: {
        parsedData: state?.parsedData,
        enhancedData: state?.enhancedData,
        fileName: state?.fileName,
        selectedTemplateId: templateId,
        projectTemplate: template,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05050A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-xl font-bold">Choose Your Portfolio Template</h1>
          </div>
          <div className="text-sm text-slate-400">
            {portfolioData.name} • {filteredTemplates.length} Templates
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08]"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === category.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Style</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStyle(null)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedStyle === null
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                )}
              >
                All Styles
              </button>
              {TEMPLATE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    selectedStyle === style.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                  )}
                >
                  <span>{style.icon}</span>
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                portfolioData={portfolioData}
                onPreview={() => setPreviewTemplate(template)}
                onSelect={() => handleSelectTemplate(template.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-slate-400 mb-2">No templates found</p>
            <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-violet-400">{THEME_PRESETS.length}+</p>
            <p className="text-sm text-slate-400 mt-2">Premium Templates</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">100%</p>
            <p className="text-sm text-slate-400 mt-2">Customizable</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400">3+</p>
            <p className="text-sm text-slate-400 mt-2">Export Formats</p>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          portfolioData={portfolioData}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            handleSelectTemplate(previewTemplate.id);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
}
