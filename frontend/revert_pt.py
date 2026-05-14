import re

with open('src/lib/portfolio-templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update LayoutType
old_layout_type = 'export type LayoutType = "cinematic-parallax" | "bento-grid-interactive" | "immersive-glass" | "editorial-asymmetry" | "brutalist-neo";'
new_layout_type = 'export type LayoutType = "minimal-editorial" | "bento-grid" | "corporate-executive" | "creative-motion" | "futuristic-glassmorphism";'
content = content.replace(old_layout_type, new_layout_type)

# 2. Update PREMIUM_LAYOUTS and CURATED_TEMPLATES
new_layouts = '''export const PREMIUM_LAYOUTS: LayoutConfig[] = [
  { id: "minimal-editorial", name: "Minimal Editorial", description: "Clean, text-focused design" },
  { id: "bento-grid", name: "Bento Grid", description: "Modern modular card layout" },
  { id: "corporate-executive", name: "Corporate Executive", description: "Traditional professional structure" },
  { id: "creative-motion", name: "Creative Motion", description: "Dynamic layout with subtle animations" },
  { id: "futuristic-glassmorphism", name: "Futuristic Glass", description: "Modern frosted glass effects" },
];

export const CURATED_TEMPLATES = [
  { id: "tpl-minimal", name: "Clean & Simple", layout: "minimal-editorial", theme: "ivory-minimalist", preview: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80", description: "Classic left-aligned structure." },
  { id: "tpl-bento", name: "Modern Cards", layout: "bento-grid", theme: "midnight-cobalt", preview: "https://images.unsplash.com/photo-1618477247222-acaff912bb64?w=400&q=80", description: "Clean structured grid layout." },
  { id: "tpl-corp", name: "The Professional", layout: "corporate-executive", theme: "executive-obsidian", preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80", description: "Traditional centered layout." },
  { id: "tpl-creative", name: "Dynamic Flow", layout: "creative-motion", theme: "slate-rust", preview: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", description: "Animated and lively." },
  { id: "tpl-glass", name: "Glass Cards", layout: "futuristic-glassmorphism", theme: "neon-cyber", preview: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80", description: "Frosted glass aesthetic." },
];
'''
content = re.sub(r'export const PREMIUM_LAYOUTS: LayoutConfig\[\] = \[.*?\];\s*export const CURATED_TEMPLATES = \[.*?\];', new_layouts, content, flags=re.DOTALL)

with open('src/lib/portfolio-templates.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated portfolio-templates.ts')
