import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Palette, Download, ArrowRight, FileText, Wand2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeUploader from "@/components/ResumeUploader";

const HERO_BG = "https://mgx-backend-cdn.metadl.com/generate/images/1128593/2026-04-17/mzpf6gqaae7q/hero-bg-abstract-gradient.png";

const STEPS = [
  {
    icon: FileText,
    title: "Upload Resume",
    description: "Drag and drop your PDF or DOCX resume",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Wand2,
    title: "AI Analyzes",
    description: "Our AI extracts and enhances your content",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Eye,
    title: "Preview & Customize",
    description: "Choose templates, adjust colors and fonts",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Download,
    title: "Export",
    description: "Download your portfolio as a standalone HTML file",
    color: "from-amber-500 to-amber-600",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Parsing",
    description: "Advanced AI reads your resume and extracts structured data including skills, experience, and projects.",
  },
  {
    icon: Zap,
    title: "Smart Content Enhancement",
    description: "AI generates compelling bios, improved descriptions, and categorizes your skills automatically.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description: "Choose from 4 professionally designed templates — Minimal, Creative, Developer, and Corporate.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description: "Export your portfolio as a self-contained HTML file. No hosting required — just share the file.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showUploader, setShowUploader] = useState(false);

  const handleParsed = (parsedData: any, enhancedData: any, fileName: string) => {
    setTimeout(() => {
      navigate("/templates", { state: { parsedData, enhancedData, fileName } });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A]/60 via-[#0F0F1A]/40 to-[#0F0F1A]" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-1000" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">AI-Powered Portfolio Generator</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Turn Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Resume
            </span>{" "}
            Into a{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume and let AI create a stunning, professional portfolio website in seconds.
            No coding required. Choose templates, customize, and export.
          </p>

          {!showUploader ? (
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] hover:shadow-violet-500/30"
              onClick={() => setShowUploader(true)}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResumeUploader onParsed={handleParsed} />
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              From resume to portfolio in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">STEP {i + 1}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-violet-500/[0.03] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Everything you need to create an impressive portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-violet-500/30 group-hover:to-cyan-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            No sign-up required. Upload your resume and get started in seconds.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02]"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setShowUploader(true);
            }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create My Portfolio
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center text-sm text-slate-500">
          <p>AI Resume-to-Portfolio Converter · No login required · Free to use</p>
        </div>
      </footer>
    </div>
  );
}