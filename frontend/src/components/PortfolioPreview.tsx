import { Component, type ErrorInfo, type ReactNode, useMemo, forwardRef, useEffect, useState } from "react";
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import MinimalSwissTemplate from "@/templates/minimal-swiss/MinimalSwissTemplate";
import CyberpunkTemplate from "@/templates/cyberpunk/CyberpunkTemplate";
import AppleProTemplate from "@/templates/apple-pro/AppleProTemplate";
import BentoGridTemplate from "@/templates/bento-grid/BentoGridTemplate";
import EditorialMagazineTemplate from "@/templates/editorial-magazine/EditorialMagazineTemplate";
import StartupFounderTemplate from "@/templates/startup-founder/StartupFounderTemplate";
import RetroTerminalTemplate from "@/templates/retro-terminal/RetroTerminalTemplate";
import LuxuryDarkTemplate from "@/templates/luxury-dark/LuxuryDarkTemplate";
import GenZMotionTemplate from "@/templates/gen-z-motion/GenZMotionTemplate";
import NeoBrutalistTemplate from "@/templates/neo-brutalist/NeoBrutalistTemplate";
import ArchitecturalGridTemplate from "@/templates/architectural-grid/ArchitecturalGridTemplate";

import ModernDeveloperTemplate from "@/templates/modern-developer/ModernDeveloperTemplate";
import CreativeDesignerTemplate from "@/templates/creative-designer/CreativeDesignerTemplate";
import FreelancerTemplate from "@/templates/freelancer/FreelancerTemplate";
import PhotographerTemplate from "@/templates/photographer/PhotographerTemplate";
import DigitalMarketerTemplate from "@/templates/digital-marketer/DigitalMarketerTemplate";
import AiEngineerTemplate from "@/templates/ai-engineer/AiEngineerTemplate";
import PersonalBrandTemplate from "@/templates/personal-brand/PersonalBrandTemplate";
import MinimalProfessionalTemplate from "@/templates/minimal-professional/MinimalProfessionalTemplate";
import PremiumGlassmorphismTemplate from "@/templates/premium-glassmorphism/PremiumGlassmorphismTemplate";
import BespokeAgencyTemplate from "@/templates/bespoke-agency/BespokeAgencyTemplate";


// ─── Error Boundary ────────────────────────────────────────────────
interface ErrorBoundaryState { hasError: boolean; error: string }
class TemplateBoundary extends Component<{ children: ReactNode; themeId: string }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: "" };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(_error: Error, info: ErrorInfo) {
    console.error("Template crashed:", _error, info);
  }
  componentDidUpdate(prev: { themeId: string }) {
    if (prev.themeId !== this.props.themeId && this.state.hasError) {
      this.setState({ hasError: false, error: "" });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[600px] flex flex-col items-center justify-center bg-slate-900 text-white gap-4 p-8">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold">Template Error</h2>
          <p className="text-slate-400 text-sm text-center max-w-md">
            This template encountered an error and could not render. This may be due to missing WebGL support for 3D templates.
          </p>
          <code className="text-xs text-red-400 bg-black/40 px-3 py-2 rounded max-w-md text-center">
            {this.state.error}
          </code>
          <p className="text-slate-500 text-xs">Try switching to another template from the left panel.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Lazy 3D Template (to avoid crashing on non-WebGL devices) ─────
function ThreeDTemplateLazy({ data, customization }: { data: PortfolioData; customization: CustomizationOptions }) {
  const [ThreeDInteractiveTemplate, setThreeDInteractiveTemplate] = useState<
    ((props: { data: PortfolioData; customization: CustomizationOptions }) => JSX.Element) | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    import("@/templates/3d-interactive/ThreeDInteractiveTemplate")
      .then((mod) => {
        if (cancelled) return;
        setThreeDInteractiveTemplate(() => mod.default);
      })
      .catch(() => {
        if (cancelled) return;
        setThreeDInteractiveTemplate(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ThreeDInteractiveTemplate) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-black text-white">
        <p>3D Template could not be loaded.</p>
      </div>
    );
  }

  return <ThreeDInteractiveTemplate data={data} customization={customization} />;
}

// ─── Generic Lazy Loading Component for 3D Templates ───────────────
function LazyTemplate({ importFunc, data, customization }: { importFunc: () => Promise<any>; data: PortfolioData; customization: CustomizationOptions }) {
  const [Template, setTemplate] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    importFunc()
      .then((mod) => {
        if (cancelled) return;
        setTemplate(() => mod.default);
      })
      .catch((err) => {
        console.error("Lazy template load failed:", err);
        if (cancelled) return;
        setTemplate(null);
      });
    return () => {
      cancelled = true;
    };
  }, [importFunc]);

  if (!Template) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center bg-black/90 text-white/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-4" />
        <p className="text-xs tracking-widest uppercase">Loading 3D Engine...</p>
      </div>
    );
  }

  return <Template data={data} customization={customization} />;
}

function RenderAppendedSections({ data, customization }: { data: PortfolioData; customization: CustomizationOptions }) {
  const visibleSections = (customization as any).sectionInstances || [];
  const optionalTypes = ["certifications", "languages", "interests", "custom"];
  const visibleOptional = visibleSections.filter((s: any) => s.visible && optionalTypes.includes(s.type));
  
  if (visibleOptional.length === 0) return null;
  
  return (
    <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16 mt-16">
      {visibleOptional.map((sec: any) => {
        if (sec.type === "certifications") {
          if (!data.certifications?.length) return null;
          return (
            <section key={sec.id} className="py-8 border-t border-[var(--color-text)]/10 space-y-6">
              <h2 className="text-2xl font-bold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>
                {sec.label}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certifications.map((cert, i) => (
                  <li key={i} className="p-4 rounded-xl border border-[var(--color-text)]/10 bg-[var(--color-surface)] flex items-center gap-3">
                    <span className="text-violet-500 font-bold">🎖️</span>
                    <span className="text-sm font-medium">{cert}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }
        
        if (sec.type === "languages") {
          if (!data.languages?.length) return null;
          return (
            <section key={sec.id} className="py-8 border-t border-[var(--color-text)]/10 space-y-6">
              <h2 className="text-2xl font-bold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>
                {sec.label}
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.languages.map((lang, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl border border-[var(--color-text)]/10 bg-[var(--color-surface)] text-sm font-semibold">
                    🌐 {lang}
                  </span>
                ))}
              </div>
            </section>
          );
        }
        
        if (sec.type === "interests") {
          if (!data.interests?.length) return null;
          return (
            <section key={sec.id} className="py-8 border-t border-[var(--color-text)]/10 space-y-6">
              <h2 className="text-2xl font-bold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>
                {sec.label}
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.interests.map((interest, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl border border-[var(--color-text)]/10 bg-[var(--color-surface)] text-sm font-medium">
                    ✨ {interest}
                  </span>
                ))}
              </div>
            </section>
          );
        }
        
        if (sec.type === "custom") {
          return (
            <section key={sec.id} className="py-8 border-t border-[var(--color-text)]/10 space-y-4">
              <h2 className="text-2xl font-bold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>
                {sec.label}
              </h2>
              <p className="opacity-70 text-sm leading-relaxed max-w-3xl">
                This is a custom section. Double-click here or edit your text to describe your achievements, projects, or additional details.
              </p>
            </section>
          );
        }
        
        return null;
      })}
    </div>
  );
}

// ─── Template Router ───────────────────────────────────────────────
export function TemplateRouter({ data, customization }: { data: PortfolioData; customization: CustomizationOptions }) {
  const { themeId } = customization;

  // Merge profileImage from data into customization so all templates can access it
  const mergedData: PortfolioData = useMemo(() => ({
    ...data,
    profileImage: data.profileImage ?? customization.profileImage ?? null,
  }), [data, customization.profileImage]);

  // Build CSS variables from customization.fonts and customization.colors
  const cssVars = useMemo(() => {
    const c = (customization as any).colors ?? {};
    const f = (customization as any).fonts ?? {};
    return {
      "--color-primary": c.primary,
      "--color-secondary": c.secondary,
      "--color-accent": c.accent,
      "--color-bg": c.background,
      "--color-surface": c.surface,
      "--color-text": c.text,
      "--color-text-secondary": c.textSecondary,
      "--font-heading": f.heading,
      "--font-body": f.body,
      "--font-mono": f.mono,
    } as React.CSSProperties;
  }, [customization]);

  const props = { data: mergedData, customization };

  return (
    <div style={cssVars} className="w-full">
      <TemplateBoundary themeId={themeId}>
        <div className="w-full">
          {themeId === "minimal-swiss" ? <MinimalSwissTemplate {...props} /> :
           themeId === "cyberpunk-developer" ? <CyberpunkTemplate {...props} /> :
           themeId === "apple-pro" ? <AppleProTemplate {...props} /> :
           themeId === "bento-grid" ? <BentoGridTemplate {...props} /> :
           themeId === "editorial-magazine" ? <EditorialMagazineTemplate {...props} /> :
           themeId === "3d-interactive" ? <TemplateBoundary themeId={themeId}><ThreeDTemplateLazy {...props} /></TemplateBoundary> :
           themeId === "startup-founder" ? <StartupFounderTemplate {...props} /> :
           themeId === "retro-terminal" ? <RetroTerminalTemplate {...props} /> :
           themeId === "luxury-dark" ? <LuxuryDarkTemplate {...props} /> :
           themeId === "gen-z-motion" ? <GenZMotionTemplate {...props} /> :
           themeId === "neo-brutalist" ? <NeoBrutalistTemplate {...props} /> :
           themeId === "architectural-grid" ? <ArchitecturalGridTemplate {...props} /> :
           
           /* Standard Templates */
           themeId === "modern-developer" ? <ModernDeveloperTemplate {...props} /> :
           themeId === "creative-designer" ? <CreativeDesignerTemplate {...props} /> :
           themeId === "freelancer-portfolio" ? <FreelancerTemplate {...props} /> :
           themeId === "photographer-portfolio" ? <PhotographerTemplate {...props} /> :
           themeId === "digital-marketer" ? <DigitalMarketerTemplate {...props} /> :
           themeId === "ai-engineer" ? <AiEngineerTemplate {...props} /> :
           themeId === "personal-brand" ? <PersonalBrandTemplate {...props} /> :
           themeId === "minimal-professional" ? <MinimalProfessionalTemplate {...props} /> :
           themeId === "premium-glassmorphism" ? <PremiumGlassmorphismTemplate {...props} /> :
           themeId === "bespoke-agency" ? <BespokeAgencyTemplate {...props} /> :

           /* 3D Templates */
           themeId === "interactive-3d-dev" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/interactive-3d-dev/Interactive3dDevTemplate")} {...props} /></TemplateBoundary> :
           themeId === "floating-3d-card" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/floating-3d-card/Floating3dCardTemplate")} {...props} /></TemplateBoundary> :
           themeId === "futuristic-3d-theme" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/futuristic-3d-theme/Futuristic3dGridTemplate")} {...props} /></TemplateBoundary> :
           themeId === "cyberpunk-3d-rain" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/cyberpunk-3d-rain/Cyberpunk3dRainTemplate")} {...props} /></TemplateBoundary> :
           themeId === "holographic-3d-theme" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/holographic-3d-theme/HolographicCrystalTemplate")} {...props} /></TemplateBoundary> :
           themeId === "cube-navigation-3d" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/cube-navigation-3d/CubeNavigation3dTemplate")} {...props} /></TemplateBoundary> :
           themeId === "animated-particle-3d" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/animated-particle-3d/AnimatedParticleSphereTemplate")} {...props} /></TemplateBoundary> :
           themeId === "immersive-hero-3d" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/immersive-hero-3d/ImmersiveHero3dTemplate")} {...props} /></TemplateBoundary> :
           themeId === "glassmorphism-3d-theme" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/glassmorphism-3d-theme/Glassmorphism3dTemplate")} {...props} /></TemplateBoundary> :
           themeId === "premium-motion-3d" ? <TemplateBoundary themeId={themeId}><LazyTemplate importFunc={() => import("@/templates/premium-motion-3d/PremiumMotion3dTemplate")} {...props} /></TemplateBoundary> :
           
           /* Default: Professional Minimal */
           <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
             <header className="text-center py-20 px-8 border-b border-[var(--color-text)]/10">
               {mergedData.profileImage && (
                 <img
                   src={mergedData.profileImage}
                   alt="Profile"
                   className="w-24 h-24 rounded-full mx-auto mb-6 object-cover ring-4"
                   style={{ boxShadow: "0 0 0 4px var(--color-primary)", opacity: 0.2, borderRadius: "9999px" }}
                 />
               )}
               <h1 className="text-5xl font-bold mb-3" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{mergedData.name}</h1>
               <p className="text-xl font-medium mb-4" style={{ color: 'var(--color-primary)' }}>{mergedData.title}</p>
               <p className="max-w-2xl mx-auto leading-relaxed opacity-70">{mergedData.summary}</p>
               <div className="flex justify-center gap-4 mt-6 text-sm opacity-50">
                 {mergedData.email && <a href={`mailto:${mergedData.email}`} className="hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>Email</a>}
                 {mergedData.linkedin && <a href={mergedData.linkedin} className="hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>LinkedIn</a>}
                 {mergedData.github && <a href={mergedData.github} className="hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>GitHub</a>}
               </div>
             </header>
             {mergedData.skills?.length > 0 && (
               <section className="py-16 px-8 max-w-4xl mx-auto">
                 <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Skills</h2>
                 <div className="flex flex-wrap gap-2">
                   {mergedData.skills.map((s, i) => <span key={i} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-text)]/10" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>{s}</span>)}
                 </div>
               </section>
             )}
             {mergedData.experience?.length > 0 && (
               <section className="py-16 px-8 max-w-4xl mx-auto border-t border-[var(--color-text)]/10">
                 <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Experience</h2>
                 <div className="space-y-8">
                   {mergedData.experience.map((exp, i) => (
                     <div key={i} className="flex gap-6">
                       <div className="w-2 h-2 mt-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                       <div>
                         <h3 className="font-bold">{exp.role} — {exp.company}</h3>
                         <p className="text-sm mb-2 opacity-50">{exp.duration}</p>
                         <p className="leading-relaxed opacity-70">{exp.description}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </section>
             )}
             {mergedData.projects?.length > 0 && (
               <section className="py-16 px-8 max-w-4xl mx-auto border-t border-[var(--color-text)]/10">
                 <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Projects</h2>
                 <div className="grid md:grid-cols-2 gap-6">
                   {mergedData.projects.map((proj, i) => (
                     <div key={i} className="p-6 border border-[var(--color-text)]/10 rounded-xl hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--color-surface)' }}>
                       <h3 className="font-bold mb-2">{proj.name}</h3>
                       <p className="text-sm mb-4 leading-relaxed opacity-70">{proj.description}</p>
                       <div className="flex flex-wrap gap-1">
                         {proj.technologies.map((t, j) => <span key={j} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>{t}</span>)}
                       </div>
                     </div>
                   ))}
                 </div>
               </section>
             )}
             {mergedData.email && (
               <section className="py-16 px-8 text-center border-t border-[var(--color-text)]/10">
                 <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Contact</h2>
                 <a href={`mailto:${mergedData.email}`} className="hover:underline text-lg" style={{ color: 'var(--color-primary)' }}>{mergedData.email}</a>
               </section>
             )}
           </div>
          }
          <RenderAppendedSections data={mergedData} customization={customization} />
        </div>
      </TemplateBoundary>
    </div>
  );
}

// ─── Main Preview (Scrollable canvas) ─────────────────────────────
interface PortfolioPreviewProps {
  data: PortfolioData;
  customization: CustomizationOptions;
  editMode?: boolean;
  onFieldUpdate?: (field: string, value: string) => void;
  onChangeImage?: (field: string) => void;
}

const PortfolioPreview = forwardRef<HTMLIFrameElement, PortfolioPreviewProps>((
  { data, customization, editMode = false },
  _ref
) => {
  return (
    <div className="w-full overflow-y-auto">
      {editMode && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border-b border-violet-500/20 sticky top-0 z-50">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[11px] font-medium text-violet-400">Edit Mode</span>
        </div>
      )}
      <TemplateRouter data={data} customization={customization} />
    </div>
  );
});

PortfolioPreview.displayName = "PortfolioPreview";

// ─── Fullscreen Preview (renders actual React template, not iframe) ──
export function FullscreenPreview({ data, customization, onClose }: {
  data: PortfolioData;
  customization: CustomizationOptions;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    // Ensure scrolling is not globally locked when fullscreen opens
    document.body.style.overflow = "auto";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      <header className="flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 shrink-0">
        <h2 className="text-sm font-bold text-white tracking-tight">Full Preview</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </header>
      <div className="flex-1 overflow-y-auto bg-white" data-lenis-prevent>
        <TemplateRouter data={data} customization={customization} />
      </div>
    </div>
  );
}

export default PortfolioPreview;
