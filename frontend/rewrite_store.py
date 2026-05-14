import re

with open('src/store/editor-store.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace EditorState fields
content = content.replace('selectedTemplateId: string;', 'selectedLayoutId: LayoutType;\n  selectedThemeId: string;')
content = content.replace('templateSearch: string;', 'themeSearch: string;')
content = content.replace('templateCategory: UserType | "all";', 'themeCategory: UserType | "all";')

# Replace EditorActions
content = content.replace('setTemplate: (id: string) => void;', 'setTheme: (id: string) => void;\n  setLayout: (id: LayoutType) => void;')
content = content.replace('setTemplateSearch: (q: string) => void;', 'setThemeSearch: (q: string) => void;')
content = content.replace('setTemplateCategory: (cat: UserType | "all") => void;', 'setThemeCategory: (cat: UserType | "all") => void;')
content = content.replace('navigateTemplate: (direction: "prev" | "next") => void;', 'navigateTheme: (direction: "prev" | "next") => void;')

# Remove duplicate setLayout from EditorActions
content = re.sub(r'\s+setLayout: \(layout: LayoutType\) => void;\n', '\n', content)

# Replace Initial State
content = content.replace('selectedTemplateId: "student-scholar",', 'selectedLayoutId: "minimal-editorial",\n  selectedThemeId: "student-scholar",')
content = content.replace('templateSearch: "",', 'themeSearch: "",')
content = content.replace('templateCategory: "all",', 'themeCategory: "all",')

# Replace getDefaultCustomization usage in initial state
content = content.replace('customization: getDefaultCustomization("student-scholar"),', 'customization: getDefaultCustomization("minimal-editorial", "student-scholar"),')
content = content.replace('history: [getDefaultCustomization("student-scholar")],', 'history: [getDefaultCustomization("minimal-editorial", "student-scholar")],')

# Replace actions implementation
content = content.replace(
    '''  setTemplate: (id) => {
    const c = getDefaultCustomization(id);
    set({ selectedTemplateId: id, customization: c });
    get().pushHistory(c);
  },''',
    '''  setTheme: (id) => {
    const layout = get().selectedLayoutId;
    const c = getDefaultCustomization(layout, id);
    // Keep user's custom layout choice but apply theme
    set({ selectedThemeId: id, customization: { ...c, layout } });
    get().pushHistory(c);
  },
  setLayout: (id) => {
    const c = { ...get().customization, layout: id };
    set({ selectedLayoutId: id, customization: c });
    get().pushHistory(c);
  },'''
)

# Remove the duplicate setLayout implementation
content = re.sub(r'  setLayout: \(layout\) => \{\n    const c = \{ \.\.\.get\(\)\.customization, layout \};\n    set\(\{ customization: c \}\);\n    get\(\)\.pushHistory\(c\);\n  \},\n', '', content)


content = content.replace('setTemplateSearch: (templateSearch)', 'setThemeSearch: (themeSearch)')
content = content.replace('set({ templateSearch })', 'set({ themeSearch })')
content = content.replace('setTemplateCategory: (templateCategory)', 'setThemeCategory: (themeCategory)')
content = content.replace('set({ templateCategory })', 'set({ themeCategory })')

content = content.replace('navigateTemplate:', 'navigateTheme:')
content = content.replace('TemplateRegistry', 'ThemeRegistry')
content = content.replace('allTemplates', 'allThemes')
content = content.replace('selectedTemplateId', 'selectedThemeId')
content = content.replace('get().setTemplate', 'get().setTheme')

content = content.replace('useFilteredTemplates', 'useFilteredThemes')
content = content.replace('templateSearch', 'themeSearch')
content = content.replace('templateCategory', 'themeCategory')
content = content.replace('const templates = ThemeRegistry.getAll();', 'const themes = ThemeRegistry.getAll();')
content = content.replace('return templates.filter', 'return themes.filter')

with open('src/store/editor-store.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Rewrite successful.")
