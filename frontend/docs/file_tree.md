# File Tree — AI Resume-to-Portfolio Converter

```
src/
├── store/
│   ├── editor-store.ts              # Zustand editor state (portfolio data, customization, UI state, undo/redo)
│   └── undo-middleware.ts           # Undo/redo middleware for Zustand with 50-state LIFO stack
│
├── lib/
│   ├── portfolio-templates.ts       # Updated interfaces (backward compatible with existing 4 templates)
│   ├── template-registry.ts         # TemplateRegistry singleton — lookup, search, categorize 22 templates
│   ├── template-renderer.ts         # TemplateRenderer — generates standalone HTML from data + config + customization
│   ├── animation-controller.ts      # Intersection Observer + hover listeners + stagger logic for preview iframe
│   ├── visual-styles.ts             # CSS generators: gradients, glassmorphism, shadows, aurora, mesh, spotlight, patterns
│   ├── responsive-css.ts            # Mobile-first responsive CSS generator with breakpoint system
│   ├── image-service.ts             # Image upload (Atoms Cloud), validate (type/size), resize (canvas API)
│   ├── color-utils.ts               # Color manipulation via colord — hex/rgb/hsl, contrast checking, alpha
│   └── font-loader.ts               # Google Fonts dynamic loader — injects <link> tags, previews font pairs
│
├── templates/
│   ├── index.ts                     # Barrel export + seeds TemplateRegistry with all 22 templates
│   │
│   │   # ── Student Templates (4) ──
│   ├── student-clean.ts             # Campus — Single Column, blue/amber, clean cards, subtle shadows
│   ├── student-vibrant.ts           # Spark — Split Hero, purple/pink, gradient headers, dot patterns
│   ├── student-minimal.ts           # Slate — Minimal Center, slate/cyan, ultra-clean, thin borders
│   ├── student-creative.ts          # Prism — Bento Grid, violet/pink/dark, mesh gradient, glassmorphism
│   │
│   │   # ── Fresher Templates (4) ──
│   ├── fresher-launch.ts            # Launch — Sidebar Left, sky/orange, layered shadows, accent borders
│   ├── fresher-aurora.ts            # Aurora — Fullscreen Sections, indigo/violet/dark, aurora bg, glow
│   ├── fresher-grad.ts              # Graduate — Timeline Center, emerald/green, timeline connector, soft cards
│   ├── fresher-bold.ts              # Bolt — Asymmetric, red/yellow/dark, bold typography, high contrast
│   │
│   │   # ── Professional Templates (5) ──
│   ├── pro-executive.ts             # Executive — Sidebar Right, navy/blue, corporate, structured
│   ├── pro-elite.ts                 # Elite — Single Column, dark/gold, luxury feel, Cormorant Garamond
│   ├── pro-modern.ts                # Horizon — Split Hero, zinc/emerald, green accent, clean lines
│   ├── pro-slate.ts                 # Slate Pro — Card Stack, slate/blue, card-based, blue accents
│   ├── pro-aurora.ts                # Nexus — Fullscreen Sections, indigo/indigo/dark, aurora + glass
│   │
│   │   # ── Freelancer Templates (5) ──
│   ├── free-studio.ts               # Studio — Bento Grid, pink/rose, bento grid, pink gradients
│   ├── free-freelance.ts            # Gig — Magazine, orange/amber, magazine layout, warm tones
│   ├── free-creative.ts             # Canvas — Asymmetric, purple/teal, asymmetric, purple + teal
│   ├── free-spotlight.ts            # Spotlight — Single Column, dark/yellow/dark, spotlight cursor, dark
│   ├── free-neon.ts                 # Neon — Card Stack, black/cyan/dark, neon glow borders, dark
│   │
│   │   # ── Developer Templates (4) ──
│   ├── dev-terminal.ts              # Terminal — Single Column, github-dark/blue, terminal aesthetic, monospace
│   ├── dev-code.ts                  # Codebase — Sidebar Left, tokyo-night/blue, Tokyo Night theme, code blocks
│   ├── dev-hacker.ts                # Matrix — Fullscreen Sections, black/green, green-on-black, scanlines
│   └── dev-oss.ts                   # Open Source — Bento Grid, github-dark/orange, GitHub-inspired, orange accent
│
├── components/
│   ├── editor/
│   │   ├── ComponentsPanel.tsx       # Left sidebar tab: draggable section list with visibility toggles
│   │   ├── StylingPanel.tsx          # Right sidebar: 5-tab panel (Colors, Fonts, Effects, Animations, Image)
│   │   ├── TemplateGallery.tsx       # Left sidebar tab: 22-template grid with category filters + search
│   │   ├── LayoutPanel.tsx           # Left sidebar tab: layout type selector + viewport switcher
│   │   ├── InlineEditor.tsx          # ContentEditable overlay for text editing inside preview iframe
│   │   ├── ImageUploader.tsx         # Drag-and-drop image upload with preview, shape/size controls
│   │   ├── ColorPicker.tsx           # Color input with WCAG contrast ratio indicator
│   │   ├── FontSelector.tsx          # Google Font dropdown with live preview text
│   │   ├── AnimationSettings.tsx     # Scroll/hover/transition/stagger animation configuration
│   │   └── EffectsPanel.tsx          # Visual effects toggles: glassmorphism, aurora, mesh, spotlight, patterns
│   │
│   ├── CustomizationPanel.tsx        # [DEPRECATED] — replaced by StylingPanel
│   ├── TemplateSelector.tsx          # [DEPRECATED] — replaced by TemplateGallery
│   └── PortfolioPreview.tsx          # [ENHANCED] — iframe preview + inline editing + viewport simulation
│
├── pages/
│   └── Builder.tsx                   # [REFACTORED] — 3-panel layout (sidebar, canvas, styling panel)
│
└── docs/
    ├── architecture.md               # Complete system design document
    ├── architect.plantuml            # System architecture diagram
    ├── class_diagram.plantuml        # Data structures & interfaces class diagram
    ├── sequence_diagram.plantuml     # Program call flow sequence diagram
    ├── er_diagram.plantuml           # Database ER diagram
    ├── ui_navigation.plantuml        # UI navigation flow (finite-state machine)
    └── file_tree.md                  # This file
```

## File Count Summary

| Category | Count | Files |
|---|---|---|
| Store | 2 | `editor-store.ts`, `undo-middleware.ts` |
| Lib | 9 | `portfolio-templates.ts`, `template-registry.ts`, `template-renderer.ts`, `animation-controller.ts`, `visual-styles.ts`, `responsive-css.ts`, `image-service.ts`, `color-utils.ts`, `font-loader.ts` |
| Templates | 23 | `index.ts` + 22 template definition files |
| Editor Components | 10 | `ComponentsPanel`, `StylingPanel`, `TemplateGallery`, `LayoutPanel`, `InlineEditor`, `ImageUploader`, `ColorPicker`, `FontSelector`, `AnimationSettings`, `EffectsPanel` |
| Enhanced Components | 1 | `PortfolioPreview.tsx` |
| Deprecated Components | 2 | `CustomizationPanel.tsx`, `TemplateSelector.tsx` |
| Pages | 1 | `Builder.tsx` |
| Docs | 7 | `architecture.md`, 5 PlantUML diagrams, `file_tree.md` |
| **Total New Files** | **45** | |
| **Total Modified Files** | **3** | `Builder.tsx`, `PortfolioPreview.tsx`, `portfolio-templates.ts` |
| **Total Deprecated Files** | **2** | `CustomizationPanel.tsx`, `TemplateSelector.tsx` |