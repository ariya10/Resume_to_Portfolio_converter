// ─── Core Interfaces ───────────────────────────────────────────────

export interface PortfolioData {
  name: string; title: string; email: string; phone: string; location: string;
  linkedin: string; github: string; website: string; summary: string; bio: string;
  skills: string[];
  experience: { company: string; role: string; duration: string; description: string; highlights: string[] }[];
  education: { institution: string; degree: string; duration: string; gpa: string; highlights: string[] }[];
  projects: { name: string; description: string; technologies: string[]; link: string }[];
  certifications: string[]; languages: string[]; interests: string[];
  profileImage: string | null;
}

export interface SectionInstance { id: string; type: string; label: string; visible: boolean; }

export interface CustomizationOptions {
  themeId: string;
  profileImage?: string | null;
  sectionInstances: SectionInstance[];
  sectionVariants?: Record<string, string>;
  colors: ColorPalette;
  fonts: {
    heading: string;
    body: string;
    mono: string;
    headingWeight?: string;
    bodyWeight?: string;
  };
  animation: {
    scrollType: string;
    hoverEffects: string[];
    scrollThreshold: number;
    staggerReveal: boolean;
    staggerIncrement: number;
    reducedMotion: boolean;
  };
  visualStyle: {
    glassmorphism: boolean;
    glassBlur: number;
    glassOpacity: number;
    shadowLevel: string;
    auroraBackground: boolean;
    auroraColors: string[];
    meshGradient: boolean;
    meshColors: string[];
    spotlightEffect: boolean;
    spotlightColor: string;
    patternOverlay: string;
    gradientAngle: number;
  };
  imageShape?: "circle" | "rounded" | "square";
  imageSize?: "small" | "medium" | "large";
}

export const DEFAULT_SECTIONS: SectionInstance[] = [
  { id: "hero", type: "hero", label: "About Me", visible: true },
  { id: "skills", type: "skills", label: "Skills", visible: true },
  { id: "experience", type: "experience", label: "Experience", visible: true },
  { id: "projects", type: "projects", label: "Projects", visible: true },
  { id: "contact", type: "contact", label: "Contact", visible: true },
];

export type ColorPalette = { primary: string; secondary: string; accent: string; background: string; surface: string; text: string; textSecondary: string };
export interface ColorVariant { id: string; name: string; colors: ColorPalette; }

export interface ThemePreset {
  id: string; name: string; description: string;
  sections: SectionInstance[];
  defaultColors: ColorPalette;
  colorVariants: ColorVariant[];
}

// ─── Theme Presets ────────────────────────────────────────────────

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "professional-minimal", name: "Professional Minimal",
    description: "A clean, minimal design highlighting essential career sections.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#2563EB", secondary: "#1E40AF", accent: "#3B82F6", background: "#FFFFFF", surface: "#F8FAFC", text: "#0F172A", textSecondary: "#64748B" },
    colorVariants: [
      { id: "classic-blue", name: "Classic Blue", colors: { primary: "#2563EB", secondary: "#1E40AF", accent: "#3B82F6", background: "#FFFFFF", surface: "#F8FAFC", text: "#0F172A", textSecondary: "#64748B" } },
      { id: "emerald", name: "Emerald", colors: { primary: "#059669", secondary: "#064E3B", accent: "#34D399", background: "#FFFFFF", surface: "#F0FDF4", text: "#052E16", textSecondary: "#6B7280" } },
      { id: "violet", name: "Violet", colors: { primary: "#7C3AED", secondary: "#4C1D95", accent: "#A78BFA", background: "#FFFFFF", surface: "#F5F3FF", text: "#1E1B4B", textSecondary: "#6B7280" } },
      { id: "slate-dark", name: "Slate Dark", colors: { primary: "#F8FAFC", secondary: "#CBD5E1", accent: "#94A3B8", background: "#0F172A", surface: "#1E293B", text: "#F8FAFC", textSecondary: "#94A3B8" } },
      { id: "rose", name: "Rose", colors: { primary: "#E11D48", secondary: "#9F1239", accent: "#FB7185", background: "#FFFFFF", surface: "#FFF1F2", text: "#1E0010", textSecondary: "#6B7280" } },
      { id: "amber", name: "Warm Amber", colors: { primary: "#D97706", secondary: "#92400E", accent: "#FCD34D", background: "#FFFBEB", surface: "#FEF3C7", text: "#1C1917", textSecondary: "#78716C" } },
    ]
  },
  {
    id: "minimal-swiss", name: "Minimal Swiss Designer",
    description: "Asymmetrical grids, oversized typography, brutal whitespace.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#000000", secondary: "#1A1A1A", accent: "#E63946", background: "#FFFFFF", surface: "#F5F5F5", text: "#000000", textSecondary: "#555555" },
    colorVariants: [
      { id: "swiss-red", name: "Swiss Red", colors: { primary: "#000000", secondary: "#1A1A1A", accent: "#E63946", background: "#FFFFFF", surface: "#F5F5F5", text: "#000000", textSecondary: "#555555" } },
      { id: "swiss-blue", name: "Swiss Blue", colors: { primary: "#000000", secondary: "#1A1A1A", accent: "#0077B6", background: "#FFFFFF", surface: "#F0F4FF", text: "#000000", textSecondary: "#444444" } },
      { id: "swiss-yellow", name: "Swiss Yellow", colors: { primary: "#000000", secondary: "#111111", accent: "#F5C400", background: "#FFFFFF", surface: "#FFFDE7", text: "#000000", textSecondary: "#333333" } },
      { id: "swiss-green", name: "Swiss Green", colors: { primary: "#000000", secondary: "#111111", accent: "#2DC653", background: "#FFFFFF", surface: "#F0FFF4", text: "#000000", textSecondary: "#444444" } },
      { id: "swiss-dark", name: "Swiss Dark", colors: { primary: "#FFFFFF", secondary: "#E0E0E0", accent: "#FF4444", background: "#111111", surface: "#1E1E1E", text: "#FFFFFF", textSecondary: "#AAAAAA" } },
    ]
  },
  {
    id: "cyberpunk-developer", name: "Cyberpunk Developer",
    description: "Neon glow systems, futuristic UI, holographic cards.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#00FFFF", secondary: "#0D0D0D", accent: "#FF00FF", background: "#050505", surface: "#0A0A1A", text: "#E0E0FF", textSecondary: "#8888AA" },
    colorVariants: [
      { id: "cyber-cyan", name: "Cyan Neon", colors: { primary: "#00FFFF", secondary: "#0D0D0D", accent: "#FF00FF", background: "#050505", surface: "#0A0A1A", text: "#E0E0FF", textSecondary: "#8888AA" } },
      { id: "cyber-green", name: "Matrix Green", colors: { primary: "#00FF41", secondary: "#001100", accent: "#39FF14", background: "#020902", surface: "#051005", text: "#AAFFAA", textSecondary: "#44AA44" } },
      { id: "cyber-orange", name: "Blade Orange", colors: { primary: "#FF6B00", secondary: "#0D0500", accent: "#FFD600", background: "#060301", surface: "#130A00", text: "#FFD0A0", textSecondary: "#AA7744" } },
      { id: "cyber-purple", name: "Purple Wave", colors: { primary: "#BF5FFF", secondary: "#0D0014", accent: "#FF5FD0", background: "#060009", surface: "#110018", text: "#E0C0FF", textSecondary: "#9966BB" } },
      { id: "cyber-red", name: "Blood Red", colors: { primary: "#FF003C", secondary: "#0D0005", accent: "#FF6600", background: "#060001", surface: "#130005", text: "#FFBBCC", textSecondary: "#AA3355" } },
    ]
  },
  {
    id: "apple-pro", name: "Apple-Level Professional",
    description: "Ultra-premium spacing, cinematic scroll, subtle motion.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#0071E3", secondary: "#1D1D1F", accent: "#0066CC", background: "#FFFFFF", surface: "#F5F5F7", text: "#1D1D1F", textSecondary: "#6E6E73" },
    colorVariants: [
      { id: "apple-blue", name: "Apple Blue", colors: { primary: "#0071E3", secondary: "#1D1D1F", accent: "#0066CC", background: "#FFFFFF", surface: "#F5F5F7", text: "#1D1D1F", textSecondary: "#6E6E73" } },
      { id: "apple-midnight", name: "Midnight", colors: { primary: "#E8E8ED", secondary: "#1C1C1E", accent: "#636366", background: "#000000", surface: "#1C1C1E", text: "#FFFFFF", textSecondary: "#8E8E93" } },
      { id: "apple-gold", name: "Starlight Gold", colors: { primary: "#B8A47A", secondary: "#2A2420", accent: "#D4B896", background: "#FAF8F5", surface: "#F0EBE3", text: "#1D1D1F", textSecondary: "#6E6E73" } },
      { id: "apple-purple", name: "Deep Purple", colors: { primary: "#BF5AF2", secondary: "#1D1D1F", accent: "#9D4EDD", background: "#FFFFFF", surface: "#F8F0FF", text: "#1D1D1F", textSecondary: "#6E6E73" } },
      { id: "apple-green", name: "Alpine Green", colors: { primary: "#2A9D5C", secondary: "#1D1D1F", accent: "#25B35A", background: "#FFFFFF", surface: "#F0FFF5", text: "#1D1D1F", textSecondary: "#6E6E73" } },
    ]
  },
  {
    id: "bento-grid", name: "Bento Grid Portfolio",
    description: "Modular card system, dashboard-inspired layouts.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#7C3AED", secondary: "#1E1B4B", accent: "#A78BFA", background: "#0F0F1A", surface: "#1A1A2E", text: "#F1F5F9", textSecondary: "#94A3B8" },
    colorVariants: [
      { id: "bento-violet", name: "Violet Grid", colors: { primary: "#7C3AED", secondary: "#1E1B4B", accent: "#A78BFA", background: "#0F0F1A", surface: "#1A1A2E", text: "#F1F5F9", textSecondary: "#94A3B8" } },
      { id: "bento-cyan", name: "Ocean Grid", colors: { primary: "#0EA5E9", secondary: "#0C1A2E", accent: "#38BDF8", background: "#060F1A", surface: "#0D1F35", text: "#E0F2FE", textSecondary: "#7DD3FC" } },
      { id: "bento-emerald", name: "Emerald Grid", colors: { primary: "#10B981", secondary: "#022C22", accent: "#34D399", background: "#020F0A", surface: "#061A10", text: "#D1FAE5", textSecondary: "#6EE7B7" } },
      { id: "bento-rose", name: "Rose Grid", colors: { primary: "#F43F5E", secondary: "#2D0A14", accent: "#FB7185", background: "#0F0306", surface: "#1E0810", text: "#FFE4E6", textSecondary: "#FDA4AF" } },
      { id: "bento-light", name: "Light Grid", colors: { primary: "#6D28D9", secondary: "#EDE9FE", accent: "#7C3AED", background: "#FAFAFA", surface: "#F3F0FF", text: "#1E1B4B", textSecondary: "#6B7280" } },
    ]
  },
  {
    id: "editorial-magazine", name: "Editorial Magazine",
    description: "Typography-first storytelling, magazine-inspired layouts.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#1A1A1A", secondary: "#2D2D2D", accent: "#C9A96E", background: "#FAFAF8", surface: "#F0EDE8", text: "#1A1A1A", textSecondary: "#6B6B6B" },
    colorVariants: [
      { id: "editorial-gold", name: "Gold Edition", colors: { primary: "#1A1A1A", secondary: "#2D2D2D", accent: "#C9A96E", background: "#FAFAF8", surface: "#F0EDE8", text: "#1A1A1A", textSecondary: "#6B6B6B" } },
      { id: "editorial-red", name: "Red Editorial", colors: { primary: "#1A1A1A", secondary: "#2D2D2D", accent: "#C0392B", background: "#FAF8F8", surface: "#F5EDED", text: "#1A1A1A", textSecondary: "#6B6B6B" } },
      { id: "editorial-cobalt", name: "Cobalt Issue", colors: { primary: "#1A1A1A", secondary: "#2D2D2D", accent: "#1E40AF", background: "#F8F9FA", surface: "#EEF2FF", text: "#1A1A1A", textSecondary: "#6B6B6B" } },
      { id: "editorial-dark", name: "Dark Edition", colors: { primary: "#F5F5F0", secondary: "#D0CFC8", accent: "#C9A96E", background: "#0F0F0E", surface: "#1A1A18", text: "#F5F5F0", textSecondary: "#888882" } },
      { id: "editorial-pink", name: "Pink Magazine", colors: { primary: "#1A1A1A", secondary: "#2D2D2D", accent: "#DB2777", background: "#FDF8F9", surface: "#FDE8F0", text: "#1A1A1A", textSecondary: "#6B6B6B" } },
    ]
  },
  {
    id: "3d-interactive", name: "3D Interactive Experience",
    description: "React Three Fiber scenes, floating geometry.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#6366F1", secondary: "#1E1B4B", accent: "#EC4899", background: "#06060F", surface: "#0E0E1F", text: "#F8FAFC", textSecondary: "#94A3B8" },
    colorVariants: [
      { id: "3d-indigo", name: "Indigo Space", colors: { primary: "#6366F1", secondary: "#1E1B4B", accent: "#EC4899", background: "#06060F", surface: "#0E0E1F", text: "#F8FAFC", textSecondary: "#94A3B8" } },
      { id: "3d-cosmic", name: "Cosmic Teal", colors: { primary: "#06B6D4", secondary: "#083344", accent: "#8B5CF6", background: "#020C14", surface: "#081824", text: "#E0F7FF", textSecondary: "#67C7E2" } },
      { id: "3d-lava", name: "Lava Flow", colors: { primary: "#EF4444", secondary: "#1A0000", accent: "#F97316", background: "#080000", surface: "#140000", text: "#FFE4E1", textSecondary: "#F87171" } },
      { id: "3d-forest", name: "Forest Dark", colors: { primary: "#22C55E", secondary: "#052E16", accent: "#84CC16", background: "#020A04", surface: "#061208", text: "#DCFCE7", textSecondary: "#86EFAC" } },
      { id: "3d-gold", name: "Golden Hour", colors: { primary: "#EAB308", secondary: "#1A1200", accent: "#F97316", background: "#080600", surface: "#140F00", text: "#FFF8DC", textSecondary: "#D4A017" } },
    ]
  },
  {
    id: "startup-founder", name: "Startup Founder",
    description: "SaaS landing-page storytelling, metrics and growth.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#10B981", secondary: "#064E3B", accent: "#34D399", background: "#030712", surface: "#111827", text: "#F9FAFB", textSecondary: "#9CA3AF" },
    colorVariants: [
      { id: "startup-green", name: "Growth Green", colors: { primary: "#10B981", secondary: "#064E3B", accent: "#34D399", background: "#030712", surface: "#111827", text: "#F9FAFB", textSecondary: "#9CA3AF" } },
      { id: "startup-blue", name: "Tech Blue", colors: { primary: "#3B82F6", secondary: "#1E3A5F", accent: "#60A5FA", background: "#030712", surface: "#111827", text: "#F9FAFB", textSecondary: "#9CA3AF" } },
      { id: "startup-orange", name: "Orange Disruption", colors: { primary: "#F97316", secondary: "#431407", accent: "#FB923C", background: "#030712", surface: "#111827", text: "#F9FAFB", textSecondary: "#9CA3AF" } },
      { id: "startup-purple", name: "Unicorn Purple", colors: { primary: "#8B5CF6", secondary: "#2E1065", accent: "#A78BFA", background: "#030712", surface: "#111827", text: "#F9FAFB", textSecondary: "#9CA3AF" } },
      { id: "startup-light", name: "Light SaaS", colors: { primary: "#10B981", secondary: "#D1FAE5", accent: "#059669", background: "#FFFFFF", surface: "#F0FDF4", text: "#1F2937", textSecondary: "#6B7280" } },
    ]
  },
  {
    id: "retro-terminal", name: "Retro Terminal",
    description: "CRT effects, command-line visual style, hacker aesthetics.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#00FF41", secondary: "#003B00", accent: "#39FF14", background: "#0D0D0D", surface: "#111111", text: "#00FF41", textSecondary: "#007A1F" },
    colorVariants: [
      { id: "terminal-green", name: "Phosphor Green", colors: { primary: "#00FF41", secondary: "#003B00", accent: "#39FF14", background: "#0D0D0D", surface: "#111111", text: "#00FF41", textSecondary: "#007A1F" } },
      { id: "terminal-amber", name: "Amber CRT", colors: { primary: "#FFB300", secondary: "#3D2B00", accent: "#FFC107", background: "#0D0800", surface: "#1A1000", text: "#FFD54F", textSecondary: "#F9A825" } },
      { id: "terminal-cyan", name: "Cyan Terminal", colors: { primary: "#00E5FF", secondary: "#003040", accent: "#18FFFF", background: "#000D0F", surface: "#001A20", text: "#00E5FF", textSecondary: "#0097A7" } },
      { id: "terminal-white", name: "Paper Terminal", colors: { primary: "#1A1A1A", secondary: "#333333", accent: "#00AA00", background: "#F0EFE0", surface: "#E8E7D8", text: "#1A1A1A", textSecondary: "#444444" } },
      { id: "terminal-red", name: "Red Alert", colors: { primary: "#FF1744", secondary: "#3B0010", accent: "#FF5252", background: "#0D0000", surface: "#1A0008", text: "#FF6B6B", textSecondary: "#B71C1C" } },
    ]
  },
  {
    id: "luxury-dark", name: "Luxury Dark",
    description: "Cinematic gradients, elegant serif typography.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#C9A96E", secondary: "#1A1009", accent: "#E8C99A", background: "#0A0806", surface: "#120F09", text: "#F5EDD6", textSecondary: "#9C8F78" },
    colorVariants: [
      { id: "luxury-gold", name: "Champagne Gold", colors: { primary: "#C9A96E", secondary: "#1A1009", accent: "#E8C99A", background: "#0A0806", surface: "#120F09", text: "#F5EDD6", textSecondary: "#9C8F78" } },
      { id: "luxury-silver", name: "Platinum Silver", colors: { primary: "#B0BEC5", secondary: "#0D1117", accent: "#CFD8DC", background: "#070B0E", surface: "#0D1117", text: "#ECEFF1", textSecondary: "#90A4AE" } },
      { id: "luxury-rose", name: "Rose Gold", colors: { primary: "#D4A0A0", secondary: "#1A0A0A", accent: "#EBBCBC", background: "#0A0606", surface: "#120909", text: "#F5E6E6", textSecondary: "#9C7878" } },
      { id: "luxury-jade", name: "Imperial Jade", colors: { primary: "#4CAF82", secondary: "#0A1A12", accent: "#80CBC4", background: "#050E09", surface: "#0A1810", text: "#E8F5E9", textSecondary: "#80A890" } },
      { id: "luxury-cobalt", name: "Royal Cobalt", colors: { primary: "#7986CB", secondary: "#0D0F2A", accent: "#9FA8DA", background: "#060712", surface: "#0D1024", text: "#E8EAF6", textSecondary: "#7986CB" } },
    ]
  },
  {
    id: "gen-z-motion", name: "Gen-Z Motion",
    description: "Playful interaction, vibrant gradients, marquee text.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#FF006E", secondary: "#3A0CA3", accent: "#FFBE0B", background: "#0A0010", surface: "#14002B", text: "#FFFFFF", textSecondary: "#B8B8B8" },
    colorVariants: [
      { id: "genz-pink", name: "Y2K Pink", colors: { primary: "#FF006E", secondary: "#3A0CA3", accent: "#FFBE0B", background: "#0A0010", surface: "#14002B", text: "#FFFFFF", textSecondary: "#B8B8B8" } },
      { id: "genz-pastel", name: "Pastel Soft", colors: { primary: "#FF85C0", secondary: "#FFF0F9", accent: "#A8D8EA", background: "#FFF5FB", surface: "#FFE8F5", text: "#2D2D2D", textSecondary: "#888888" } },
      { id: "genz-cyber", name: "Cyber Pop", colors: { primary: "#00F5FF", secondary: "#0A0030", accent: "#FF00AA", background: "#050015", surface: "#0A0025", text: "#FFFFFF", textSecondary: "#AAAACC" } },
      { id: "genz-earth", name: "Earth Vibes", colors: { primary: "#8BC34A", secondary: "#1B2A10", accent: "#FF7043", background: "#101A08", surface: "#1A2E10", text: "#FFFFFF", textSecondary: "#AABB99" } },
      { id: "genz-sunset", name: "Sunset Gradient", colors: { primary: "#FF6B6B", secondary: "#1A0820", accent: "#FFA500", background: "#08040F", surface: "#150A28", text: "#FFFFFF", textSecondary: "#DDAACC" } },
    ]
  },
  {
    id: "neo-brutalist", name: "Neo Brutalist",
    description: "Aggressive typography, bold geometry, primary colors.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#FF3E00", secondary: "#000000", accent: "#FFDD00", background: "#FFFFFF", surface: "#EEEEEE", text: "#000000", textSecondary: "#333333" },
    colorVariants: [
      { id: "brutal-red", name: "Red & Yellow", colors: { primary: "#FF3E00", secondary: "#000000", accent: "#FFDD00", background: "#FFFFFF", surface: "#EEEEEE", text: "#000000", textSecondary: "#333333" } },
      { id: "brutal-blue", name: "Blue & Orange", colors: { primary: "#0000FF", secondary: "#000000", accent: "#FF6600", background: "#FFFFFF", surface: "#EEEEEE", text: "#000000", textSecondary: "#333333" } },
      { id: "brutal-green", name: "Green & Pink", colors: { primary: "#00CC00", secondary: "#000000", accent: "#FF00AA", background: "#FFFFFF", surface: "#EEEEEE", text: "#000000", textSecondary: "#333333" } },
      { id: "brutal-black", name: "Black & White", colors: { primary: "#000000", secondary: "#111111", accent: "#FFFFFF", background: "#000000", surface: "#111111", text: "#FFFFFF", textSecondary: "#AAAAAA" } },
      { id: "brutal-pastel", name: "Pastel Brutal", colors: { primary: "#FF6B6B", secondary: "#2D2D2D", accent: "#4ECDC4", background: "#FFF3E0", surface: "#FFE0B2", text: "#1A1A1A", textSecondary: "#444444" } },
    ]
  },
  {
    id: "architectural-grid", name: "Architectural Grid",
    description: "Structured precision, thin blueprint borders, monospace.",
    sections: DEFAULT_SECTIONS,
    defaultColors: { primary: "#00A8CC", secondary: "#001F3F", accent: "#7FDBFF", background: "#001A2C", surface: "#012030", text: "#E8F4F8", textSecondary: "#5B8FA8" },
    colorVariants: [
      { id: "arch-blueprint", name: "Blueprint", colors: { primary: "#00A8CC", secondary: "#001F3F", accent: "#7FDBFF", background: "#001A2C", surface: "#012030", text: "#E8F4F8", textSecondary: "#5B8FA8" } },
      { id: "arch-concrete", name: "Concrete", colors: { primary: "#888888", secondary: "#2A2A2A", accent: "#CCCCCC", background: "#1A1A1A", surface: "#222222", text: "#EEEEEE", textSecondary: "#888888" } },
      { id: "arch-sepia", name: "Sepia Plan", colors: { primary: "#8B6914", secondary: "#1A1208", accent: "#C9A84C", background: "#F5F0E8", surface: "#EDE5D0", text: "#1A1208", textSecondary: "#5C4A1E" } },
      { id: "arch-white", name: "Clean White", colors: { primary: "#1A1A1A", secondary: "#DDDDDD", accent: "#0066CC", background: "#FFFFFF", surface: "#F8F8F8", text: "#111111", textSecondary: "#555555" } },
      { id: "arch-forest", name: "Forest Grid", colors: { primary: "#2E7D32", secondary: "#0A1F0B", accent: "#81C784", background: "#020B03", surface: "#071209", text: "#E8F5E9", textSecondary: "#66BB6A" } },
    ]
  },
];

// ─── Helper Functions ─────────────────────────────────────────────

export const getGoogleFontsUrl = (): string => {
  return `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap`;
};

export const ThemeRegistry = {
  getAll: () => THEME_PRESETS,
  getById: (id: string) => THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0],
};

export const getDefaultCustomization = (): CustomizationOptions => {
  const defaultTheme = THEME_PRESETS[0];
  return {
    themeId: defaultTheme.id,
    sectionInstances: DEFAULT_SECTIONS.map((s) => ({ ...s })),
    profileImage: null,
    sectionVariants: {},
    colors: { ...defaultTheme.defaultColors },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
      mono: "'Fira Code', monospace",
      headingWeight: "700",
      bodyWeight: "400",
    },
    animation: {
      scrollType: "fade-up",
      hoverEffects: ["lift"],
      scrollThreshold: 0.1,
      staggerReveal: true,
      staggerIncrement: 100,
      reducedMotion: false,
    },
    visualStyle: {
      glassmorphism: false,
      glassBlur: 10,
      glassOpacity: 0.1,
      shadowLevel: "md",
      auroraBackground: false,
      auroraColors: ["#6366F1", "#EC4899"],
      meshGradient: false,
      meshColors: ["#6366F1", "#EC4899"],
      spotlightEffect: false,
      spotlightColor: "rgba(255,255,255,0.1)",
      patternOverlay: "none",
      gradientAngle: 135,
    },
    imageShape: "circle",
    imageSize: "medium",
  };
};