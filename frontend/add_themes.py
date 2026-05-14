import re

with open('src/lib/portfolio-templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_themes = """
  {
    id: "executive-obsidian",
    name: "Executive Obsidian",
    description: "Deep black with subtle gold accents and elegant serif typography.",
    preview: "executive-obsidian.png",
    tags: ["professional", "luxury", "dark"],
    recommendedFor: ["executive", "professional"],
    defaultColors: {
      primary: "#1A1A1A",
      secondary: "#2A2A2A",
      accent: "#D4AF37",
      background: "#0A0A0A",
      surface: "#111111",
      text: "#F5F5F5",
      textSecondary: "#A0A0A0"
    },
    defaultFonts: {
      heading: "'Playfair Display', serif",
      headingWeight: "700",
      body: "'Inter', sans-serif",
      bodyWeight: "400",
      mono: "'JetBrains Mono', monospace"
    },
    animationProfile: {
      scrollType: "fade-up",
      scrollThreshold: 0.1,
      hoverEffects: ["lift"],
      staggerReveal: true,
      staggerDelay: 100,
      staggerIncrement: 50,
      reducedMotion: false
    },
    visualStyle: {
      glassmorphism: true,
      glassBlur: 12,
      glassOpacity: 0.05,
      shadowLevel: "lg",
      auroraBackground: false,
      auroraColors: [],
      meshGradient: false,
      meshColors: [],
      spotlightEffect: true,
      spotlightColor: "rgba(212, 175, 55, 0.1)",
      patternOverlay: "none",
      gradientAngle: 145
    },
    supportsImage: true,
    sections: DEFAULT_SECTIONS
  },
  {
    id: "midnight-cobalt",
    name: "Midnight Cobalt",
    description: "Deep blue gradient with bright cyan accents for modern tech executives.",
    preview: "midnight-cobalt.png",
    tags: ["tech", "modern", "blue"],
    recommendedFor: ["executive", "developer"],
    defaultColors: {
      primary: "#0B3D91",
      secondary: "#1E5FBC",
      accent: "#00E5FF",
      background: "#020B1A",
      surface: "#051329",
      text: "#FFFFFF",
      textSecondary: "#8AB4F8"
    },
    defaultFonts: {
      heading: "'Outfit', sans-serif",
      headingWeight: "800",
      body: "'Inter', sans-serif",
      bodyWeight: "400",
      mono: "'Fira Code', monospace"
    },
    animationProfile: {
      scrollType: "scale-up",
      scrollThreshold: 0.15,
      hoverEffects: ["glow", "lift"],
      staggerReveal: true,
      staggerDelay: 100,
      staggerIncrement: 50,
      reducedMotion: false
    },
    visualStyle: {
      glassmorphism: true,
      glassBlur: 16,
      glassOpacity: 0.1,
      shadowLevel: "glow",
      auroraBackground: true,
      auroraColors: ["#00E5FF10", "#0B3D9110"],
      meshGradient: true,
      meshColors: ["#020B1A", "#0B3D91"],
      spotlightEffect: true,
      spotlightColor: "rgba(0, 229, 255, 0.15)",
      patternOverlay: "grid",
      gradientAngle: 180
    },
    supportsImage: true,
    sections: DEFAULT_SECTIONS
  },
  {
    id: "ivory-minimalist",
    name: "Ivory Minimalist",
    description: "Warm off-white background with stark black text and clean architectural lines.",
    preview: "ivory-minimalist.png",
    tags: ["clean", "minimal", "light"],
    recommendedFor: ["designer", "professional"],
    defaultColors: {
      primary: "#F8F9FA",
      secondary: "#E9ECEF",
      accent: "#000000",
      background: "#FFFFFF",
      surface: "#F8F9FA",
      text: "#111827",
      textSecondary: "#6B7280"
    },
    defaultFonts: {
      heading: "'Inter', sans-serif",
      headingWeight: "600",
      body: "'Inter', sans-serif",
      bodyWeight: "400",
      mono: "'Roboto Mono', monospace"
    },
    animationProfile: {
      scrollType: "fade-in",
      scrollThreshold: 0.1,
      hoverEffects: ["lift"],
      staggerReveal: false,
      staggerDelay: 0,
      staggerIncrement: 0,
      reducedMotion: true
    },
    visualStyle: {
      glassmorphism: false,
      glassBlur: 0,
      glassOpacity: 1,
      shadowLevel: "sm",
      auroraBackground: false,
      auroraColors: [],
      meshGradient: false,
      meshColors: [],
      spotlightEffect: false,
      spotlightColor: "",
      patternOverlay: "none",
      gradientAngle: 180
    },
    supportsImage: true,
    sections: DEFAULT_SECTIONS
  },
  {
    id: "slate-rust",
    name: "Slate & Rust",
    description: "Slate grey background with muted rust accents and modern geometric typography.",
    preview: "slate-rust.png",
    tags: ["modern", "corporate", "warm"],
    recommendedFor: ["professional", "freelancer"],
    defaultColors: {
      primary: "#2F3E46",
      secondary: "#354F52",
      accent: "#E07A5F",
      background: "#1E2426",
      surface: "#283337",
      text: "#F4F1DE",
      textSecondary: "#9CA3AF"
    },
    defaultFonts: {
      heading: "'Space Grotesk', sans-serif",
      headingWeight: "700",
      body: "'Roboto', sans-serif",
      bodyWeight: "400",
      mono: "'Space Mono', monospace"
    },
    animationProfile: {
      scrollType: "slide-left",
      scrollThreshold: 0.15,
      hoverEffects: ["scale"],
      staggerReveal: true,
      staggerDelay: 150,
      staggerIncrement: 75,
      reducedMotion: false
    },
    visualStyle: {
      glassmorphism: true,
      glassBlur: 8,
      glassOpacity: 0.2,
      shadowLevel: "md",
      auroraBackground: false,
      auroraColors: [],
      meshGradient: false,
      meshColors: [],
      spotlightEffect: false,
      spotlightColor: "",
      patternOverlay: "dots",
      gradientAngle: 135
    },
    supportsImage: true,
    sections: DEFAULT_SECTIONS
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    description: "Extremely dark purple with neon pink and cyan gradients for creative edge.",
    preview: "neon-cyber.png",
    tags: ["creative", "neon", "dark"],
    recommendedFor: ["developer", "designer"],
    defaultColors: {
      primary: "#120428",
      secondary: "#2A0845",
      accent: "#FF007F",
      background: "#080112",
      surface: "#180633",
      text: "#FFFFFF",
      textSecondary: "#00E5FF"
    },
    defaultFonts: {
      heading: "'Outfit', sans-serif",
      headingWeight: "900",
      body: "'Inter', sans-serif",
      bodyWeight: "400",
      mono: "'Fira Code', monospace"
    },
    animationProfile: {
      scrollType: "flip",
      scrollThreshold: 0.2,
      hoverEffects: ["glow", "border-glow"],
      staggerReveal: true,
      staggerDelay: 200,
      staggerIncrement: 100,
      reducedMotion: false
    },
    visualStyle: {
      glassmorphism: true,
      glassBlur: 24,
      glassOpacity: 0.15,
      shadowLevel: "glow",
      auroraBackground: true,
      auroraColors: ["#FF007F20", "#00E5FF20"],
      meshGradient: true,
      meshColors: ["#080112", "#2A0845"],
      spotlightEffect: true,
      spotlightColor: "rgba(255, 0, 127, 0.2)",
      patternOverlay: "waves",
      gradientAngle: 215
    },
    supportsImage: true,
    sections: DEFAULT_SECTIONS
  },
"""

# Insert right after `export const THEME_PRESETS: ThemePreset[] = [`
content = content.replace(
    'export const THEME_PRESETS: ThemePreset[] = [',
    'export const THEME_PRESETS: ThemePreset[] = [\n' + new_themes
)

with open('src/lib/portfolio-templates.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Added professional themes')
