import re

with open('src/components/editor/ComponentsPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Imports
content = content.replace('type TemplateConfig', 'type ThemePreset, type LayoutConfig, PREMIUM_LAYOUTS')
content = content.replace('useFilteredTemplates', 'useFilteredThemes')
content = content.replace('import { Palette,', 'import { Palette,')

# Add Palette to imports if missing
if 'Palette,' not in content:
    content = content.replace('import {', 'import {\n  Palette,', 1)

# Component: TemplateCard -> ThemeCard
content = content.replace('function TemplateCard({ template, isSelected, onSelect }: { template: TemplateConfig; isSelected: boolean; onSelect: () => void }) {', 'function ThemeCard({ theme, isSelected, onSelect }: { theme: ThemePreset; isSelected: boolean; onSelect: () => void }) {')
content = content.replace('template.', 'theme.')
content = content.replace('<TemplateCard', '<ThemeCard')
content = content.replace('template={template}', 'theme={theme}')

# Main Component state pulls
content = content.replace('selectedTemplateId,', 'selectedThemeId,\n    selectedLayoutId,')
content = content.replace('templateSearch,', 'themeSearch,')
content = content.replace('templateCategory,', 'themeCategory,')
content = content.replace('setTemplate,', 'setTheme,')
content = content.replace('setTemplateSearch,', 'setThemeSearch,')
content = content.replace('setTemplateCategory,', 'setThemeCategory,')
content = content.replace('filteredTemplates', 'filteredThemes')

# Tabs renaming
content = content.replace('id: "templates" as const, icon: <Grid3X3 className="w-3.5 h-3.5" />, label: "Design"', 'id: "templates" as const, icon: <Palette className="w-3.5 h-3.5" />, label: "Themes"')
content = content.replace('id: "layout" as const, icon: <Layout className="w-3.5 h-3.5" />, label: "Canvas"', 'id: "layout" as const, icon: <Layout className="w-3.5 h-3.5" />, label: "Layouts"')

# Search input placeholders
content = content.replace('Search templates...', 'Search themes...')
content = content.replace('setTemplateSearch(e.target.value)', 'setThemeSearch(e.target.value)')
content = content.replace('setTemplateCategory(cat.id)', 'setThemeCategory(cat.id)')

# Grid mapping
content = content.replace('filteredTemplates.map((template)', 'filteredThemes.map((theme)')
content = content.replace('key={template.id}', 'key={theme.id}')
content = content.replace('isSelected={selectedTemplateId === template.id}', 'isSelected={selectedThemeId === theme.id}')
content = content.replace('onSelect={() => setTemplate(template.id)}', 'onSelect={() => setTheme(theme.id)}')
content = content.replace('filteredTemplates.length === 0', 'filteredThemes.length === 0')
content = content.replace('No templates found', 'No themes found')

# Update layout rendering section entirely to avoid regex issues
parts = content.split('{/* Layout Type */}')
if len(parts) == 2:
    part2 = parts[1].split('{/* Section Style Controls */}')[1]
    layout_content = '''
              {/* Premium Layouts */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Structural Layout</p>
                <div className="grid gap-2">
                  {PREMIUM_LAYOUTS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLayout(opt.id)}
                      className={cn(
                        "flex flex-col items-start gap-1 py-3 px-3 rounded-lg border transition-all text-left",
                        selectedLayoutId === opt.id
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/5"
                      )}
                    >
                      <span className="text-[11px] font-bold text-white">{opt.name}</span>
                      <span className="text-[9px] text-slate-500">{opt.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Style Controls */}''' + part2
    content = parts[0] + layout_content

with open('src/components/editor/ComponentsPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Rewrite successful.")
