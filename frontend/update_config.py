import re

with open('src/lib/portfolio-templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update LayoutType
old_layout_type = 'export type LayoutType = "minimal-editorial" | "bento-grid" | "corporate-executive" | "creative-motion" | "futuristic-glassmorphism";'
new_layout_type = 'export type LayoutType = "cinematic-parallax" | "bento-grid-interactive" | "immersive-glass" | "editorial-asymmetry" | "brutalist-neo";'
content = content.replace(old_layout_type, new_layout_type)

# 2. Update PREMIUM_LAYOUTS
new_layouts = '''export const PREMIUM_LAYOUTS: LayoutConfig[] = [
  { id: "cinematic-parallax", name: "Cinematic Parallax", description: "Agency-level 3D scrolling and masking" },
  { id: "bento-grid-interactive", name: "Interactive Bento", description: "Vercel-inspired dense grid dashboard" },
  { id: "immersive-glass", name: "Immersive Glass", description: "Apple-style spatial depth and blur" },
  { id: "editorial-asymmetry", name: "Editorial Asymmetry", description: "High-fashion Vogue magazine spread" },
  { id: "brutalist-neo", name: "Neo Brutalism", description: "Trendy studio loud and bold aesthetics" },
];

export const CURATED_TEMPLATES = [
  { id: "tpl-cinematic", name: "The Agency", layout: "cinematic-parallax", theme: "executive-obsidian", preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80", description: "Deep dark cinematic masking." },
  { id: "tpl-bento", name: "Software Pro", layout: "bento-grid-interactive", theme: "midnight-cobalt", preview: "https://images.unsplash.com/photo-1618477247222-acaff912bb64?w=400&q=80", description: "Tech dashboard aesthetic." },
  { id: "tpl-glass", name: "Vision Spatial", layout: "immersive-glass", theme: "ivory-minimalist", preview: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80", description: "Spatial computing glass floating UI." },
  { id: "tpl-editorial", name: "High Fashion", layout: "editorial-asymmetry", theme: "slate-rust", preview: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", description: "Vogue-style broken grid." },
  { id: "tpl-brutalist", name: "Trendy Studio", layout: "brutalist-neo", theme: "neon-cyber", preview: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80", description: "Loud, bold, marquee brutalism." },
];
'''
content = re.sub(r'export const PREMIUM_LAYOUTS: LayoutConfig\[\] = \[.*?\];', new_layouts, content, flags=re.DOTALL)

with open('src/lib/portfolio-templates.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated portfolio-templates.ts')
