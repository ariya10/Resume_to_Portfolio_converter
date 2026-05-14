import re

with open('src/lib/portfolio-templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update LayoutType
content = re.sub(
    r'export type LayoutType = .*?;',
    'export type LayoutType = "minimal-editorial" | "bento-grid" | "corporate-executive" | "creative-motion" | "futuristic-glassmorphism";',
    content
)

# Update CustomizationOptions
content = re.sub(
    r'export interface CustomizationOptions \{',
    'export interface CustomizationOptions {\n  themeId: string;',
    content
)

# Update TemplateConfig to ThemePreset
content = re.sub(r'export interface TemplateConfig \{', 'export interface ThemePreset {', content)
content = re.sub(r'export const TEMPLATES: TemplateConfig\[\] = \[', 'export const THEME_PRESETS: ThemePreset[] = [', content)

# Remove 'layout: LayoutType;' from ThemePreset interface
content = re.sub(r'\s+layout: LayoutType;\n', '\n', content)

# Remove 'layout: "something",' from ThemePreset entries
content = re.sub(r'\s+layout: \"[^\"]+\",\n', '\n', content)

# Update TemplateRegistry
content = re.sub(
    r'export const TemplateRegistry = \{.*?\};',
    '''export const ThemeRegistry = {
  getAll: () => THEME_PRESETS,
  getById: (id: string) => THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0],
  getByCategory: (cat: string) =>
    cat === "all" ? THEME_PRESETS : THEME_PRESETS.filter((t) => t.recommendedFor.includes(cat as any)),
};

export interface LayoutConfig {
  id: LayoutType;
  name: string;
  description: string;
  icon?: string;
}

export const PREMIUM_LAYOUTS: LayoutConfig[] = [
  { id: "minimal-editorial", name: "Minimal Editorial", description: "Apple/Notion inspired clean typography" },
  { id: "bento-grid", name: "Bento Grid", description: "Framer/Linear inspired asymmetric cards" },
  { id: "corporate-executive", name: "Corporate Executive", description: "Timeline-driven professional enterprise" },
  { id: "creative-motion", name: "Creative Motion", description: "Awwwards inspired animated transitions" },
  { id: "futuristic-glassmorphism", name: "Glassmorphism", description: "Neon glowing frosted glass cards" },
];''',
    content,
    flags=re.DOTALL
)

# Update getDefaultCustomization
content = re.sub(
    r'export const getDefaultCustomization = \(templateId: string\): CustomizationOptions => \{.*?layout: t\.layout,.*?elementStyles: \{\},.*?  \};\n\};',
    '''export const getDefaultCustomization = (layoutId: LayoutType, themeId: string): CustomizationOptions => {
  const t = ThemeRegistry.getById(themeId);
  return {
    themeId,
    colors: { ...t.defaultColors },
    fonts: { ...t.defaultFonts },
    animation: { ...t.animationProfile },
    visualStyle: { ...t.visualStyle },
    layout: layoutId,
    imageShape: "circle",
    imageSize: "medium",
    showSectionNumbers: false,
    sectionInstances: t.sections.map((s) => ({ ...s })),
    sectionVariants: {},
    elementStyles: {},
  };
};''',
    content,
    flags=re.DOTALL
)

with open('src/lib/portfolio-templates.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Rewrite successful.")
