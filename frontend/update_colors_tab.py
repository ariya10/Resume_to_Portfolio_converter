import re

with open('src/components/editor/StylingPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_colors_tab = '''function ColorsTab() {
  const { customization, setColors, selectedThemeId, setTheme } = useEditorStore();
  const { colors } = customization;

  const updateColor = useCallback(
    (key: keyof ColorPalette, value: string) => {
      setColors({ ...colors, [key]: value });
    },
    [colors, setColors]
  );

  const resetColors = useCallback(() => {
    const template = useEditorStore.getState().selectedThemeId;
    const t = ThemeRegistry.getById(template);
    if (t) setColors({ ...t.defaultColors });
  }, [setColors]);

  const colorFields: { key: keyof ColorPalette; label: string }[] = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "accent", label: "Accent" },
    { key: "background", label: "Background" },
    { key: "surface", label: "Surface" },
    { key: "text", label: "Text" },
    { key: "textSecondary", label: "Text Secondary" },
  ];

  const themes = ThemeRegistry.getAll();

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <div className="space-y-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Theme Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border transition-all text-left",
                selectedThemeId === theme.id
                  ? "border-violet-500/50 bg-violet-500/10"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/5"
              )}
            >
              <div 
                className="w-6 h-6 rounded-full shrink-0 border border-white/10" 
                style={{ background: `linear-gradient(135deg, ${theme.defaultColors.primary}, ${theme.defaultColors.accent})` }} 
              />
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-white truncate">{theme.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10 w-full" />

      {/* Granular Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Color Palette</p>
          <button onClick={resetColors} className="text-[10px] text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        {colorFields.map(({ key, label }) => (
          <ColorInput key={key} label={label} value={colors[key]} onChange={(v) => updateColor(key, v)} />
        ))}
      </div>
    </div>
  );
}'''

content = re.sub(r'function ColorsTab\(\) \{.*?\}\s*\n\s*// ─── Fonts Tab', new_colors_tab + '\n\n// ─── Fonts Tab', content, flags=re.DOTALL)

with open('src/components/editor/StylingPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated StylingPanel.tsx')
