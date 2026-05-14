import re

with open('src/components/editor/ComponentsPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the Themes tab button
content = content.replace('{ id: "templates" as const, icon: <Palette className="w-3.5 h-3.5" />, label: "Themes" },', '')

# 2. Remove the ThemeCard component definition
content = re.sub(r'// ─── Template Card ───.*?// ─── Main Component ───', '// ─── Main Component ───', content, flags=re.DOTALL)

# 3. Remove the entire Templates Tab rendering block
content = re.sub(r'\{\/\*\s*Templates\s*Tab\s*\*\/\}.*?(?=\{\/\*\s*Sections\s*Tab\s*\*\/})', '', content, flags=re.DOTALL)

with open('src/components/editor/ComponentsPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated ComponentsPanel.tsx')
