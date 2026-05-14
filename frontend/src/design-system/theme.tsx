import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ─── Design Tokens ───
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
} as const;

export const RADIUS = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

export const SHADOWS = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
  glow: (color: string) => `0 0 20px ${color}30, 0 0 60px ${color}10`,
} as const;

// ─── Theme Definitions ───
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderHover: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  accent: string;
  accentHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  gradientFrom: string;
  gradientTo: string;
  success: string;
  error: string;
  warning: string;
  overlay: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  emoji: string;
  colors: ThemeColors;
  fontHeading: string;
  fontBody: string;
  fontMono: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  dark: {
    id: "dark",
    name: "Dark",
    description: "Deep dark with violet & cyan accents",
    emoji: "🌙",
    colors: {
      background: "#09090B",
      surface: "#18181B",
      surfaceHover: "#1F1F23",
      border: "#27272A",
      borderHover: "#3F3F46",
      primary: "#8B5CF6",
      primaryHover: "#7C3AED",
      primaryForeground: "#FFFFFF",
      accent: "#06B6D4",
      accentHover: "#0891B2",
      text: "#FAFAFA",
      textSecondary: "#A1A1AA",
      textMuted: "#71717A",
      gradientFrom: "#8B5CF6",
      gradientTo: "#06B6D4",
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      overlay: "rgba(0,0,0,0.6)",
    },
    fontHeading: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  light: {
    id: "light",
    name: "Light",
    description: "Clean white with indigo accents",
    emoji: "☀️",
    colors: {
      background: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceHover: "#F4F4F5",
      border: "#E4E4E7",
      borderHover: "#D4D4D8",
      primary: "#4F46E5",
      primaryHover: "#4338CA",
      primaryForeground: "#FFFFFF",
      accent: "#0EA5E9",
      accentHover: "#0284C7",
      text: "#18181B",
      textSecondary: "#52525B",
      textMuted: "#A1A1AA",
      gradientFrom: "#4F46E5",
      gradientTo: "#0EA5E9",
      success: "#059669",
      error: "#DC2626",
      warning: "#D97706",
      overlay: "rgba(0,0,0,0.3)",
    },
    fontHeading: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Warm rose & amber gradients",
    emoji: "🎨",
    colors: {
      background: "#1C1017",
      surface: "#261520",
      surfaceHover: "#2E1A28",
      border: "#3D2232",
      borderHover: "#4D2D42",
      primary: "#F43F5E",
      primaryHover: "#E11D48",
      primaryForeground: "#FFFFFF",
      accent: "#F59E0B",
      accentHover: "#D97706",
      text: "#FFF1F2",
      textSecondary: "#FDA4AF",
      textMuted: "#9F5060",
      gradientFrom: "#F43F5E",
      gradientTo: "#F59E0B",
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      overlay: "rgba(28,16,23,0.7)",
    },
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'Fira Code', monospace",
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Navy blue with teal accents",
    emoji: "💼",
    colors: {
      background: "#0B1120",
      surface: "#111827",
      surfaceHover: "#1A2332",
      border: "#1E3A5F",
      borderHover: "#2563EB40",
      primary: "#2563EB",
      primaryHover: "#1D4ED8",
      primaryForeground: "#FFFFFF",
      accent: "#14B8A6",
      accentHover: "#0D9488",
      text: "#F0F9FF",
      textSecondary: "#94A3B8",
      textMuted: "#64748B",
      gradientFrom: "#2563EB",
      gradientTo: "#14B8A6",
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      overlay: "rgba(11,17,32,0.7)",
    },
    fontHeading: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  developer: {
    id: "developer",
    name: "Developer",
    description: "Terminal green on black",
    emoji: "💻",
    colors: {
      background: "#0A0A0A",
      surface: "#141414",
      surfaceHover: "#1A1A1A",
      border: "#262626",
      borderHover: "#333333",
      primary: "#22C55E",
      primaryHover: "#16A34A",
      primaryForeground: "#000000",
      accent: "#A78BFA",
      accentHover: "#8B5CF6",
      text: "#E2E8F0",
      textSecondary: "#94A3B8",
      textMuted: "#64748B",
      gradientFrom: "#22C55E",
      gradientTo: "#A78BFA",
      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
      overlay: "rgba(10,10,10,0.7)",
    },
    fontHeading: "'JetBrains Mono', monospace",
    fontBody: "'JetBrains Mono', monospace",
    fontMono: "'JetBrains Mono', monospace",
  },
};

export const THEME_IDS = Object.keys(THEMES) as (keyof typeof THEMES)[];

// ─── Font Pairings ───
export interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
  mono: string;
  preview: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  { id: "modern", name: "Modern", heading: "'Plus Jakarta Sans', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace", preview: "Aa Bb Cc" },
  { id: "elegant", name: "Elegant", heading: "'Playfair Display', serif", body: "'Inter', sans-serif", mono: "'Fira Code', monospace", preview: "Aa Bb Cc" },
  { id: "technical", name: "Technical", heading: "'JetBrains Mono', monospace", body: "'JetBrains Mono', monospace", mono: "'JetBrains Mono', monospace", preview: "Aa Bb Cc" },
  { id: "classic", name: "Classic", heading: "'Georgia', serif", body: "'Georgia', serif", mono: "'Fira Code', monospace", preview: "Aa Bb Cc" },
  { id: "clean", name: "Clean", heading: "'Roboto', sans-serif", body: "'Roboto', sans-serif", mono: "'Fira Code', monospace", preview: "Aa Bb Cc" },
];

// ─── Context ───
interface ThemeContextValue {
  theme: ThemeConfig;
  themeId: string;
  setTheme: (id: string) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeToDOM(theme: ThemeConfig) {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--color-bg", c.background);
  root.style.setProperty("--color-surface", c.surface);
  root.style.setProperty("--color-surface-hover", c.surfaceHover);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--color-border-hover", c.borderHover);
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-primary-hover", c.primaryHover);
  root.style.setProperty("--color-primary-fg", c.primaryForeground);
  root.style.setProperty("--color-accent", c.accent);
  root.style.setProperty("--color-accent-hover", c.accentHover);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-text-secondary", c.textSecondary);
  root.style.setProperty("--color-text-muted", c.textMuted);
  root.style.setProperty("--color-gradient-from", c.gradientFrom);
  root.style.setProperty("--color-gradient-to", c.gradientTo);
  root.style.setProperty("--color-success", c.success);
  root.style.setProperty("--color-error", c.error);
  root.style.setProperty("--color-warning", c.warning);
  root.style.setProperty("--color-overlay", c.overlay);
  root.style.setProperty("--font-heading", theme.fontHeading);
  root.style.setProperty("--font-body", theme.fontBody);
  root.style.setProperty("--font-mono", theme.fontMono);
  root.style.transition = "background-color 0.4s ease, color 0.4s ease";
  root.style.backgroundColor = c.background;
  root.style.color = c.text;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("portfolio-theme") || "dark";
    }
    return "dark";
  });

  const theme = THEMES[themeId] || THEMES.dark;

  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem("portfolio-theme", themeId);
  }, [theme, themeId]);

  const setTheme = useCallback((id: string) => {
    if (THEMES[id]) setThemeId(id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, colors: theme.colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}