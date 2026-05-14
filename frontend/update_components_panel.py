import re

with open('src/components/editor/ComponentsPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace('PREMIUM_LAYOUTS,', 'PREMIUM_LAYOUTS, CURATED_TEMPLATES,')

# 2. Add 'Templates' to the tab switcher (first item)
tab_switcher = '''      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 px-1 pt-1">
        {([
          { id: "templates" as const, icon: <Grid3X3 className="w-3.5 h-3.5" />, label: "Templates" },'''
content = re.sub(r'\{\/\*\s*Tab Switcher\s*\*\/\}.*?\{\(\[', tab_switcher, content, flags=re.DOTALL)

# 3. Add the Templates Tab rendering block
templates_tab = '''          {/* Templates Tab */}
          {leftPanelTab === "templates" && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-3">Curated Designs</p>
                <div className="grid gap-3">
                  {CURATED_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setLayout(tpl.layout as any);
                        setTheme(tpl.theme);
                      }}
                      className={cn(
                        "relative group flex flex-col items-start gap-2 p-3 rounded-xl border transition-all text-left overflow-hidden",
                        selectedLayoutId === tpl.layout && selectedThemeId === tpl.theme
                          ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                      <div className="w-full h-24 bg-black/40 rounded-lg overflow-hidden relative">
                        <img src={tpl.preview} alt={tpl.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F15] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-violet-500 text-white shadow-lg shadow-violet-500/20">Pro</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[12px] font-black text-white tracking-tight">{tpl.name}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{tpl.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}'''
content = re.sub(r'\{\/\*\s*Layout Tab\s*\*\/\}', templates_tab, content)

# 4. Also need to ensure selectedThemeId is imported from the store
if 'selectedThemeId,' not in content:
    content = content.replace('selectedLayoutId,', 'selectedThemeId,\n    selectedLayoutId,')

with open('src/components/editor/ComponentsPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated ComponentsPanel.tsx')
