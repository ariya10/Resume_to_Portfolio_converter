import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type { PortfolioData, CustomizationOptions } from "@/lib/portfolio-templates";
import useEditorStore from "@/store/editor-store";
import CanvasRulers from "@/components/editor/CanvasRulers";
import TransformOverlay from "@/components/editor/TransformOverlay";
import { getDefaultCustomization, ThemeRegistry, DEFAULT_SECTIONS } from "@/lib/portfolio-templates";
import PortfolioPreview from "@/components/PortfolioPreview";

type RouteState = {
  parsedData?: any;
  enhancedData?: any;
  fileName?: string;
  selectedTemplateId?: string;
} | null;

function coercePortfolioData(parsedData: any, enhancedData: any): PortfolioData {
  const fallback: PortfolioData = {
    name: "Your Name",
    title: "Software Engineer",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
    profileImage: null,
  };

  if (!parsedData) return fallback;

  return {
    name: parsedData.name || fallback.name,
    title: parsedData.title || fallback.title,
    email: parsedData.email || fallback.email,
    phone: parsedData.phone || fallback.phone,
    location: parsedData.location || fallback.location,
    linkedin: parsedData.linkedin || fallback.linkedin,
    github: parsedData.github || fallback.github,
    website: parsedData.website || fallback.website,
    summary: enhancedData?.enhanced_summary ?? parsedData.summary ?? parsedData.bio ?? fallback.summary,
    bio: enhancedData?.enhanced_bio ?? parsedData.bio ?? parsedData.summary ?? fallback.bio,
    skills: parsedData.skills || fallback.skills,
    experience: (parsedData.experience || []).map((exp: any) => ({
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
    certifications: parsedData.certifications || fallback.certifications,
    languages: parsedData.languages || fallback.languages,
    interests: parsedData.interests || fallback.interests,
    profileImage: parsedData.profileImage || fallback.profileImage,
  };
}

function findFieldPath(data: any, text: string, path = ""): string | null {
  if (typeof data === "string") {
    const trimmedVal = data.trim();
    if (trimmedVal && trimmedVal === text) return path;
    return null;
  }
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const itemPath = path ? `${path}.${i}` : `${i}`;
      const res = findFieldPath(data[i], text, itemPath);
      if (res) return res;
    }
  } else if (data && typeof data === "object") {
    for (const key in data) {
      if (key === "profileImage") continue;
      const itemPath = path ? `${path}.${key}` : key;
      const res = findFieldPath(data[key], text, itemPath);
      if (res) return res;
    }
  }
  return null;
}

function setByField(data: PortfolioData, field: string, value: string): PortfolioData {
  if (field === "name") return { ...data, name: value };
  if (field === "title") return { ...data, title: value };
  if (field === "summary") return { ...data, summary: value };
  if (field === "bio") return { ...data, bio: value };
  if (field === "email") return { ...data, email: value };
  if (field === "phone") return { ...data, phone: value };
  if (field === "location") return { ...data, location: value };
  if (field === "linkedin") return { ...data, linkedin: value };
  if (field === "github") return { ...data, github: value };
  if (field === "website") return { ...data, website: value };

  // skills.<idx>
  const skillsMatch = field.match(/^skills\.(\d+)$/);
  if (skillsMatch) {
    const idx = Number(skillsMatch[1]);
    if (!Number.isFinite(idx)) return data;
    const next = [...data.skills];
    next[idx] = value;
    return { ...data, skills: next };
  }

  // certifications.<idx>
  const certMatch = field.match(/^certifications\.(\d+)$/);
  if (certMatch) {
    const idx = Number(certMatch[1]);
    if (!Number.isFinite(idx)) return data;
    const next = [...data.certifications];
    next[idx] = value;
    return { ...data, certifications: next };
  }

  // languages.<idx>
  const langMatch = field.match(/^languages\.(\d+)$/);
  if (langMatch) {
    const idx = Number(langMatch[1]);
    if (!Number.isFinite(idx)) return data;
    const next = [...data.languages];
    next[idx] = value;
    return { ...data, languages: next };
  }

  // interests.<idx>
  const intMatch = field.match(/^interests\.(\d+)$/);
  if (intMatch) {
    const idx = Number(intMatch[1]);
    if (!Number.isFinite(idx)) return data;
    const next = [...data.interests];
    next[idx] = value;
    return { ...data, interests: next };
  }

  // experience.<idx>.<key>
  const expMatch = field.match(/^experience\.(\d+)\.(.+)$/);
  if (expMatch) {
    const idx = Number(expMatch[1]);
    const key = expMatch[2] as keyof PortfolioData["experience"][number];
    if (!Number.isFinite(idx)) return data;

    const next = [...data.experience];
    if (!next[idx]) return data;
    const nextItem: any = { ...next[idx] };

    if (key === "description") nextItem.description = value;
    else if (key === "role") nextItem.role = value;
    else if (key === "company") nextItem.company = value;
    else if (key === "duration") nextItem.duration = value;

    next[idx] = nextItem;
    return { ...data, experience: next };
  }

  // projects.<idx>.<key>
  const projMatch = field.match(/^projects\.(\d+)\.(.+)$/);
  if (projMatch) {
    const idx = Number(projMatch[1]);
    const key = projMatch[2] as keyof PortfolioData["projects"][number];
    if (!Number.isFinite(idx)) return data;

    const next = [...data.projects];
    if (!next[idx]) return data;
    const nextItem: any = { ...next[idx] };

    if (key === "name") nextItem.name = value;
    else if (key === "description") nextItem.description = value;
    else if (key === "link") nextItem.link = value;
    else if (key === "technologies") {
      nextItem.technologies = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    next[idx] = nextItem;
    return { ...data, projects: next };
  }

  // education.<idx>.<key>
  const eduMatch = field.match(/^education\.(\d+)\.(.+)$/);
  if (eduMatch) {
    const idx = Number(eduMatch[1]);
    const key = eduMatch[2] as keyof PortfolioData["education"][number];
    if (!Number.isFinite(idx)) return data;

    const next = [...data.education];
    if (!next[idx]) return data;
    const nextItem: any = { ...next[idx] };

    if (key === "institution") nextItem.institution = value;
    else if (key === "degree") nextItem.degree = value;
    else if (key === "duration") nextItem.duration = value;
    else if (key === "gpa") nextItem.gpa = value;
    else return data;

    next[idx] = nextItem;
    return { ...data, education: next };
  }

  return data;
}

export function TemplateEditorCanvas() {
  const location = useLocation();
  const routeState = (location.state ?? null) as RouteState;

  const { customization, setTheme, setPortfolioData, portfolioData, viewport, editMode } = useEditorStore();

  const initialData = useMemo(
    () => coercePortfolioData(routeState?.parsedData, routeState?.enhancedData),
    [routeState?.parsedData, routeState?.enhancedData]
  );

  const [localData, setLocalData] = useState<PortfolioData>(initialData);

  useEffect(() => {
    setLocalData(initialData);
    setPortfolioData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const resolvedTemplateId = routeState?.selectedTemplateId ?? customization.themeId;

  useEffect(() => {
    if (!resolvedTemplateId) return;
    if (customization.themeId !== resolvedTemplateId) setTheme(resolvedTemplateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTemplateId]);

  const resolvedCustomization: CustomizationOptions = useMemo(() => {
    const fallback = getDefaultCustomization();
    const theme = ThemeRegistry.getById(resolvedTemplateId);

    return {
      ...fallback,
      ...customization,
      themeId: resolvedTemplateId,
      colors: (customization as any).colors ?? theme.defaultColors,
      sectionInstances:
        (customization as any).sectionInstances?.length > 0
          ? (customization as any).sectionInstances
          : fallback.sectionInstances ?? DEFAULT_SECTIONS,
    };
  }, [customization, resolvedTemplateId]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoom = useEditorStore((s) => s.zoom);

  const effectiveData = portfolioData ?? localData;

  // Dynamic Inline Editing DOM Injector / Cleaner
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    if (editMode) {
      const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const nodesToMark: { element: HTMLElement; field: string }[] = [];
      let n;
      
      while (n = walk.nextNode()) {
        const text = (n.textContent ?? "").trim();
        if (text.length <= 1) continue;
        const parent = n.parentElement;
        if (!parent) continue;
        
        const tag = parent.tagName.toUpperCase();
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "CANVAS" || tag === "SVG" || tag === "PATH") continue;
        if (parent.hasAttribute("data-field")) continue;

        const path = findFieldPath(effectiveData, text);
        if (path) {
          nodesToMark.push({ element: parent, field: path });
        }
      }

      nodesToMark.forEach(({ element, field }) => {
        element.setAttribute("contenteditable", "true");
        element.setAttribute("data-field", field);
        element.classList.add("cursor-text", "hover:ring-1", "hover:ring-violet-400/50", "focus:ring-2", "focus:ring-violet-500/80", "focus:outline-none", "rounded", "transition-all", "px-1", "-mx-1");
      });
    } else {
      // Clean up editable fields in preview mode
      const editableElements = root.querySelectorAll("[data-field]");
      editableElements.forEach((el) => {
        el.removeAttribute("contenteditable");
        el.classList.remove("cursor-text", "hover:ring-1", "hover:ring-violet-400/50", "focus:ring-2", "focus:ring-violet-500/80", "focus:outline-none", "rounded", "editor-selected");
      });
    }
  }, [editMode, effectiveData]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onBlurCapture = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const field = target.getAttribute("data-field");
      if (!field) return;

      const nextValue = (target.textContent ?? "").trim();

      const nextData = setByField(effectiveData, field, nextValue);
      setLocalData(nextData);
      setPortfolioData(nextData);
    };

    el.addEventListener("blur", onBlurCapture, true);
    return () => el.removeEventListener("blur", onBlurCapture, true);
  }, [effectiveData, setPortfolioData]);

  // Selection handling: click elements with `data-field` to select
  const setSelectedElementId = useEditorStore((s) => s.setSelectedElementId);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let prev: HTMLElement | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (!editMode) return;
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // Ignore selection logic if clicking inside the transform overlay (e.g. resize handles)
      if (t.closest("[data-transform-overlay]")) {
        return;
      }

      const fieldEl = t.closest("[data-field]") as HTMLElement | null;

      if (prev && prev !== fieldEl) {
        prev.classList.remove("editor-selected");
        prev = null;
      }

      if (fieldEl) {
        fieldEl.classList.add("editor-selected");
        prev = fieldEl;
        const field = fieldEl.getAttribute("data-field");
        setSelectedElementId(field);
        e.stopPropagation();
      } else {
        setSelectedElementId(null);
      }
    };

    root.addEventListener("pointerdown", onPointerDown);
    return () => root.removeEventListener("pointerdown", onPointerDown);
  }, [setSelectedElementId, editMode]);

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`.editor-selected{outline:2px solid rgba(124,58,237,0.95);outline-offset:2px;}`}</style>
      
      {/* Sleek browser mockup frame */}
      <div 
        className="w-full border border-slate-200/80 rounded-xl bg-white shadow-xl overflow-hidden flex flex-col transition-all"
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: "top center",
        }}
      >
        {/* Browser Header Bar */}
        <div className="shrink-0 px-4 py-2 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between select-none">
          {/* Window control dots */}
          <div className="flex items-center gap-1.5 w-16">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90 block border border-rose-500/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 block border border-amber-500/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 block border border-emerald-500/10" />
          </div>

          {/* Browser Address Bar */}
          <div className="bg-white border border-slate-200/85 rounded-lg px-6 py-0.5 text-[10px] text-slate-400 font-medium font-mono text-center flex items-center justify-center gap-1.5 shadow-sm max-w-xs w-full select-none truncate">
            <span className="text-emerald-500">🔒</span>
            <span>localhost:3000/{portfolioData?.name?.toLowerCase().replace(/\s+/g, '-') || "portfolio"}</span>
          </div>

          {/* Active Viewport Badge */}
          <div className="w-16 flex justify-end">
            <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-600">
              {viewport}
            </span>
          </div>
        </div>

        {/* Preview Screen Area */}
        <div className="relative bg-white">
          <div
            id="editor-canvas-root"
            ref={containerRef}
            className="w-full origin-top relative"
          >
            <PortfolioPreview 
              data={effectiveData} 
              customization={resolvedCustomization} 
              editMode={editMode} 
            />
            {editMode && <TransformOverlay />}
          </div>
        </div>
      </div>
    </div>
  );
}
