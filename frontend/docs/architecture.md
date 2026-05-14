# AI Resume-to-Portfolio Converter — System Architecture

## 1. Implementation Approach

### Overview
We are upgrading the portfolio builder from a basic 4-template system with simple customization to a production-grade, visually stunning portfolio builder featuring 22 unique templates, a Wix-like drag-and-drop editor, a rich animation system, advanced visual effects, and mobile-first responsive design.

### Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Modern, accessible, performant DnD for React; supports sortable lists and drag overlays |
| State Management | Zustand | Lightweight, minimal boilerplate, excellent for complex editor state with undo/redo |
| Animation Runtime | CSS Animations + Intersection Observer API | No heavy JS animation library; CSS-first for performance, Intersection Observer for scroll triggers |
| Template Rendering | String-based HTML generation (existing pattern) | Keeps the iframe preview approach; generates self-contained HTML with embedded CSS/JS |
| Font Loading | Google Fonts API | Free, extensive library, reliable CDN, supports dynamic loading |
| Image Upload | Atoms Cloud File Storage | Already integrated; handles persistence and CDN delivery |
| AI Enhancement | deepseek-v3.2 [gentxt] | Cost-effective text generation for content enhancement |
| PDF Analysis | Atoms Cloud AI | Built-in PDF parsing capability |
| Color Manipulation | `colord` library | Tiny (~3KB), handles hex/rgb/hsl conversion, contrast checking, alpha manipulation |
| Responsive Framework | CSS Custom Properties + Container Queries | Modern CSS approach; container queries for component-level responsiveness |

### Critical Requirements
1. **22 unique templates** — each with distinct layout, colors, fonts, animations, and visual style
2. **Wix-like editor** — components panel, live preview canvas with inline editing, styling panel
3. **Animation system** — scroll-triggered, hover micro-interactions, page transitions, staggered reveals
4. **Visual enhancements** — gradients, glassmorphism, layered shadows, bento grids, aurora backgrounds, mesh gradients, spotlight effects
5. **Mobile-first responsive** — breakpoint-specific layouts, touch-friendly, lazy loading, reduced motion support
6. **User image upload** — optional profile image in all templates, with upload/resize/validate pipeline

---

## 2. User & UI Interaction Behaviors

### 2.1 Builder Page — Three-Panel Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Top Bar: [← Back] [Name's Portfolio] [Viewport] [Export]    │
├────────────┬─────────────────────────────────┬───────────────┤
│            │                                 │               │
│  Left      │     Live Preview Canvas         │  Right        │
│  Sidebar   │     (iframe with inline edit)   │  Styling      │
│            │                                 │  Panel        │
│  Templates │                                 │               │
│  Components│                                 │  Colors       │
│  Panel     │                                 │  Fonts        │
│            │                                 │  Effects      │
│            │                                 │  Animations   │
│            │                                 │  Image        │
│            │                                 │               │
├────────────┴─────────────────────────────────┴───────────────┤
│  Status Bar: [Section: Hero] [Template: Aurora] [Saved ✓]    │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Primary Interaction Scenarios

| # | Scenario | User Action | System Response |
|---|---|---|---|
| 1 | **Select Template** | Browse gallery, click template card | Preview updates instantly; customization resets to template defaults; recommended sections auto-configure |
| 2 | **Reorder Sections** | Drag section handle in Components Panel | Drop indicator appears; section moves in preview; smooth transition animation |
| 3 | **Inline Edit** | Click text in preview iframe | Editable overlay appears with cursor; typing updates in real-time; click outside to save |
| 4 | **Change Colors** | Pick color in Styling Panel | All color-dependent elements update live; contrast ratio indicator shows WCAG compliance |
| 5 | **Toggle Glassmorphism** | Enable in Effects panel | Cards gain blur backdrop; border opacity adjusts; shadow depth increases |
| 6 | **Upload Image** | Click "Upload Photo" → select file | File validates (type, size); resizes client-side; uploads to Atoms Cloud; preview shows image in hero section |
| 7 | **Switch Animation** | Select "Fade Up" scroll animation | Preview reloads with new animation; scroll to see effect; reduced-motion fallback auto-applied |
| 8 | **Viewport Preview** | Click mobile/tablet/desktop icon | Preview iframe resizes; layout reflows; touch targets enlarge on mobile |
| 9 | **Export** | Click "Export HTML" | Generates self-contained HTML with all CSS/JS/fonts embedded; downloads as file |
| 10 | **Undo/Redo** | Ctrl+Z / Ctrl+Shift+Z | Reverts to previous customization state; preview updates accordingly |

### 2.3 Touch & Mobile Interactions
- **Long press** on section in Components Panel to start drag
- **Pinch to zoom** on preview canvas
- **Swipe** between template categories
- **Tap** to select section for inline editing
- **Pull down** to refresh preview

---

## 3. Template System — 22 Unique Templates

### 3.1 Template Categories & Definitions

#### Students (4 templates)

| # | ID | Name | Layout | Color Palette | Font Pairing | Animation | Visual Style |
|---|---|---|---|---|---|---|---|
| 1 | `student-clean` | Campus | Single Column | Primary: `#2563EB`, Accent: `#F59E0B`, BG: `#F8FAFC`, Text: `#1E293B` | Heading: `Inter 700`, Body: `Inter 400` | Fade Up scroll | Clean cards, subtle shadows |
| 2 | `student-vibrant` | Spark | Split Hero | Primary: `#7C3AED`, Accent: `#EC4899`, BG: `#FAFAFA`, Text: `#18181B` | Heading: `Poppins 700`, Body: `Inter 400` | Scale Up scroll | Gradient headers, dot patterns |
| 3 | `student-minimal` | Slate | Minimal Center | Primary: `#334155`, Accent: `#06B6D4`, BG: `#FFFFFF`, Text: `#0F172A` | Heading: `Space Grotesk 600`, Body: `Inter 300` | Fade In scroll | Ultra-clean, thin borders |
| 4 | `student-creative` | Prism | Bento Grid | Primary: `#8B5CF6`, Accent: `#F472B6`, BG: `#0F0F23`, Text: `#E2E8F0` | Heading: `Outfit 700`, Body: `Inter 400` | Stagger reveal | Mesh gradient, glassmorphism |

#### Freshers (4 templates)

| # | ID | Name | Layout | Color Palette | Font Pairing | Animation | Visual Style |
|---|---|---|---|---|---|---|---|
| 5 | `fresher-launch` | Launch | Sidebar Left | Primary: `#0EA5E9`, Accent: `#F97316`, BG: `#FFFFFF`, Text: `#0C4A6E` | Heading: `DM Sans 700`, Body: `DM Sans 400` | Slide Right scroll | Layered shadows, accent borders |
| 6 | `fresher-aurora` | Aurora | Fullscreen Sections | Primary: `#6366F1`, Accent: `#A78BFA`, BG: `#030014`, Text: `#E0E7FF` | Heading: `Sora 700`, Body: `Inter 400` | Parallax scroll | Aurora background, glow effects |
| 7 | `fresher-grad` | Graduate | Timeline Center | Primary: `#059669`, Accent: `#34D399`, BG: `#F0FDF4`, Text: `#064E3B` | Heading: `Merriweather 700`, Body: `Open Sans 400` | Fade Up scroll | Timeline connector, soft cards |
| 8 | `fresher-bold` | Bolt | Asymmetric | Primary: `#DC2626`, Accent: `#FBBF24`, BG: `#111111`, Text: `#F9FAFB` | Heading: `Bebas Neue 400`, Body: `Inter 400` | Flip scroll | Bold typography, high contrast |

#### Professionals (5 templates)

| # | ID | Name | Layout | Color Palette | Font Pairing | Animation | Visual Style |
|---|---|---|---|---|---|---|---|
| 9 | `pro-executive` | Executive | Sidebar Right | Primary: `#1E3A5F`, Accent: `#2563EB`, BG: `#FFFFFF`, Text: `#1E293B` | Heading: `Playfair Display 700`, Body: `Lato 400` | Fade In scroll | Corporate, structured, navy tones |
| 10 | `pro-elite` | Elite | Single Column | Primary: `#0F172A`, Accent: `#C9A962`, BG: `#FAFAF9`, Text: `#1C1917` | Heading: `Cormorant Garamond 600`, Body: `Source Sans 3 400` | Slide Left scroll | Gold accents, luxury feel |
| 11 | `pro-modern` | Horizon | Split Hero | Primary: `#18181B`, Accent: `#10B981`, BG: `#F4F4F5`, Text: `#27272A` | Heading: `Manrope 700`, Body: `Inter 400` | Scale Up scroll | Green accent, clean lines |
| 12 | `pro-slate` | Slate Pro | Card Stack | Primary: `#475569`, Accent: `#3B82F6`, BG: `#F1F5F9`, Text: `#1E293B` | Heading: `IBM Plex Sans 600`, Body: `IBM Plex Sans 400` | Stagger reveal | Card-based, blue accents |
| 13 | `pro-aurora` | Nexus | Fullscreen Sections | Primary: `#1E1B4B`, Accent: `#818CF8`, BG: `#020617`, Text: `#C7D2FE` | Heading: `Outfit 700`, Body: `Inter 400` | Parallax scroll | Aurora + glassmorphism |

#### Freelancers (5 templates)

| # | ID | Name | Layout | Color Palette | Font Pairing | Animation | Visual Style |
|---|---|---|---|---|---|---|---|
| 14 | `free-studio` | Studio | Bento Grid | Primary: `#BE185D`, Accent: `#F472B6`, BG: `#FDF2F8`, Text: `#831843` | Heading: `Syne 700`, Body: `Inter 400` | Stagger reveal | Bento grid, pink gradients |
| 15 | `free-freelance` | Gig | Magazine | Primary: `#EA580C`, Accent: `#FB923C`, BG: `#FFFBEB`, Text: `#7C2D12` | Heading: `Archivo 700`, Body: `Inter 400` | Slide Right scroll | Magazine layout, warm tones |
| 16 | `free-creative` | Canvas | Asymmetric | Primary: `#7C3AED`, Accent: `#2DD4BF`, BG: `#F5F3FF`, Text: `#3B0764` | Heading: `Space Grotesk 700`, Body: `DM Sans 400` | Scale Up scroll | Asymmetric, purple + teal |
| 17 | `free-spotlight` | Spotlight | Single Column | Primary: `#111827`, Accent: `#FBBF24`, BG: `#111827`, Text: `#F9FAFB` | Heading: `Sora 700`, Body: `Inter 400` | Fade Up scroll | Spotlight cursor effect, dark |
| 18 | `free-neon` | Neon | Card Stack | Primary: `#000000`, Accent: `#22D3EE`, BG: `#000000`, Text: `#E5E7EB` | Heading: `Orbitron 700`, Body: `Inter 400` | Blur In scroll | Neon glow borders, dark |

#### Developers (4 templates)

| # | ID | Name | Layout | Color Palette | Font Pairing | Animation | Visual Style |
|---|---|---|---|---|---|---|---|
| 19 | `dev-terminal` | Terminal | Single Column | Primary: `#0D1117`, Accent: `#58A6FF`, BG: `#0D1117`, Text: `#E6EDF3` | Heading: `Fira Code 600`, Body: `Fira Code 400` | Typewriter | Terminal aesthetic, monospace |
| 20 | `dev-code` | Codebase | Sidebar Left | Primary: `#1A1B26`, Accent: `#7AA2F7`, BG: `#1A1B26`, Text: `#C0CAF5` | Heading: `JetBrains Mono 700`, Body: `Inter 400` | Fade Up scroll | Tokyo Night theme, code blocks |
| 21 | `dev-hacker` | Matrix | Fullscreen Sections | Primary: `#000000`, Accent: `#00FF41`, BG: `#000000`, Text: `#00FF41` | Heading: `Share Tech Mono 400`, Body: `Share Tech Mono 400` | Slide Left scroll | Green-on-black, scanlines |
| 22 | `dev-oss` | Open Source | Bento Grid | Primary: `#171B26`, Accent: `#F78166`, BG: `#0D1117`, Text: `#E6EDF3` | Heading: `Inter 700`, Body: `Inter 400` | Stagger reveal | GitHub-inspired, orange accent |

### 3.2 Template Config Schema

Each template is defined as a `TemplateConfig` object:

```typescript
interface TemplateConfig {
  id: string;                          // Unique identifier
  name: string;                        // Display name
  description: string;                 // Short description
  preview: string;                     // Preview image URL
  tags: string[];                      // Searchable tags
  recommendedFor: UserType[];          // Target user types
  layout: LayoutType;                  // Layout structure
  defaultColors: ColorPalette;         // Default color scheme
  defaultFonts: FontPairing;           // Default font pairing
  animationProfile: AnimationProfile;  // Default animation config
  visualStyle: VisualStyleConfig;      // Visual effects config
  supportsImage: boolean;              // Whether template supports profile image
  sections: SectionDefinition[];       // Section definitions with defaults
}
```

---

## 4. Wix-Like Drag-and-Drop Editor

### 4.1 Three-Panel Architecture

#### Left Sidebar — Components Panel
- **Tab navigation**: Templates | Components | Layout
- **Templates tab**: Grid of template cards with category filters (All / Student / Fresher / Professional / Freelancer / Developer)
- **Components tab**: Draggable section list with visibility toggles
  - Each section shows: drag handle `⋮⋮`, icon, label, visibility toggle switch
  - Sections: Hero, About, Skills, Experience, Education, Projects, Certifications, Contact
  - Drag to reorder; toggle to show/hide
- **Layout tab**: Layout type selector (grid of layout thumbnails), viewport switcher (desktop/tablet/mobile icons)

#### Center — Live Preview Canvas
- **iframe-based** rendering (existing pattern preserved)
- **Inline editing**: Click on text elements to edit directly
  - ContentEditable overlay on click
  - Floating mini-toolbar (bold, italic, link)
  - Click outside or press Esc to save
- **Section highlighting**: Hover over sections to show blue outline + section label
- **Click to select**: Click a section to select it; Styling Panel focuses on that section
- **Viewport controls**: Desktop (1280px), Tablet (768px), Mobile (375px) width simulation

#### Right Sidebar — Styling Panel
- **Tab navigation**: Colors | Fonts | Effects | Animations | Image
- **Colors tab**:
  - Primary, Secondary, Accent, Background, Surface, Text, Text Secondary color pickers
  - Gradient builder (2-4 color stops, angle slider)
  - Contrast ratio indicator (WCAG AA/AAA)
  - Preset color themes per template
- **Fonts tab**:
  - Heading font selector (20+ Google Fonts)
  - Body font selector (20+ Google Fonts)
  - Mono font selector (10+ fonts)
  - Weight sliders (heading/body)
  - Live preview text
- **Effects tab**:
  - Glassmorphism toggle + blur/opacity/border controls
  - Shadow level selector (none/sm/md/lg/xl/glow)
  - Aurora background toggle + color/speed controls
  - Mesh gradient toggle + color controls
  - Spotlight effect toggle + size/color controls
  - Pattern overlay selector (dots/grid/diagonal/circles/waves/none)
- **Animations tab**:
  - Scroll animation type selector (Fade Up/Fade In/Slide Left/Slide Right/Scale Up/Flip/Parallax/Blur In)
  - Scroll threshold slider
  - Hover effects toggle + scale/shadow/glow/lift/tilt controls
  - Page transition type selector
  - Stagger reveal toggle + delay/increment controls
  - Reduced motion toggle (global)
- **Image tab**:
  - Upload profile image (drag & drop or click)
  - Image preview with remove button
  - Image shape selector (circle/rounded/square)
  - Image size slider (small/medium/large)
  - Image position selector (varies by template layout)

### 4.2 Drag & Drop Implementation

```
@dnd-kit Architecture:

DndContext
├── SortableContext (Components Panel - vertical list)
│   ├── SortableItem (Hero)
│   ├── SortableItem (About)
│   ├── SortableItem (Skills)
│   ├── SortableItem (Experience)
│   ├── SortableItem (Education)
│   ├── SortableItem (Projects)
│   ├── SortableItem (Certifications)
│   └── SortableItem (Contact)
├── DragOverlay (ghost preview while dragging)
└── Sensors
    ├── PointerSensor (mouse)
    ├── TouchSensor (mobile)
    └── KeyboardSensor (accessibility)
```

### 4.3 Editor State (Zustand Store)

```typescript
interface EditorStore {
  // Portfolio data
  portfolioData: PortfolioData;
  updatePortfolioData: (partial: Partial<PortfolioData>) => void;

  // Template
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;

  // Customization
  customization: CustomizationOptions;
  updateCustomization: (partial: Partial<CustomizationOptions>) => void;
  updateColors: (colors: Partial<ColorPalette>) => void;
  updateFonts: (fonts: Partial<FontPairing>) => void;
  updateVisualStyle: (style: Partial<VisualStyleConfig>) => void;
  updateAnimation: (anim: Partial<AnimationProfile>) => void;

  // Sections
  sections: SectionInstance[];
  reorderSections: (activeId: string, overId: string) => void;
  toggleSectionVisibility: (id: string) => void;

  // Editor UI state
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  viewport: ViewportSize;
  setViewport: (size: ViewportSize) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Image
  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
  imageShape: 'circle' | 'rounded' | 'square';
  setImageShape: (shape: string) => void;
  imageSize: 'small' | 'medium' | 'large';
  setImageSize: (size: string) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

---

## 5. Animation System

### 5.1 Architecture

The animation system is **CSS-first** with JavaScript only for Intersection Observer triggers. All animations are defined as CSS classes and injected into the generated HTML.

```
AnimationController (JS - runs in preview iframe)
├── IntersectionObserver → adds .animate-in class when element enters viewport
├── Hover listeners → adds .hover-active class on mouseenter
├── Stagger logic → adds animation-delay based on element index
└── Reduced motion → respects prefers-reduced-motion media query

CSS Animation Classes (injected into HTML)
├── .scroll-fade-up { opacity: 0; transform: translateY(30px); transition: ... }
├── .scroll-fade-up.animate-in { opacity: 1; transform: translateY(0); }
├── .scroll-scale-up { opacity: 0; transform: scale(0.95); transition: ... }
├── .scroll-scale-up.animate-in { opacity: 1; transform: scale(1); }
├── .hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
├── .hover-lift.hover-active { transform: translateY(-4px); box-shadow: ...; }
└── .stagger-item:nth-child(1) { animation-delay: 0ms; }
    .stagger-item:nth-child(2) { animation-delay: 100ms; }
    ...
```

### 5.2 Animation Types

| Category | Type | CSS Implementation | Use Case |
|---|---|---|---|
| **Scroll** | Fade Up | `translateY(30px) → translateY(0)` + `opacity: 0 → 1` | Section titles, cards |
| **Scroll** | Fade In | `opacity: 0 → 1` | Subtle content reveals |
| **Scroll** | Slide Left | `translateX(-40px) → translateX(0)` | Timeline items |
| **Scroll** | Slide Right | `translateX(40px) → translateX(0)` | Alternate timeline |
| **Scroll** | Scale Up | `scale(0.95) → scale(1)` | Project cards |
| **Scroll** | Flip | `rotateX(10deg) → rotateX(0)` | Certification items |
| **Scroll** | Parallax | `translateY(calc(var(--scroll) * 0.3))` | Hero backgrounds |
| **Scroll** | Blur In | `filter: blur(8px) → blur(0)` | Dramatic reveals |
| **Hover** | Lift | `translateY(-4px)` + shadow increase | Cards, buttons |
| **Hover** | Scale | `scale(1.03)` | Skill tags, project thumbnails |
| **Hover** | Glow | `box-shadow: 0 0 20px {accent}40` | Interactive elements |
| **Hover** | Border Glow | `border-color: {accent}` + glow | Card outlines |
| **Hover** | Tilt | `perspective(1000px) rotateX/Y` | 3D card effect |
| **Transition** | Fade | `opacity` transition | Page/section switches |
| **Transition** | Slide | `transform: translateX` | Section navigation |
| **Stagger** | Sequential | `animation-delay: n * increment` | Lists, grids, tags |

### 5.3 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .scroll-fade-up,
  .scroll-scale-up,
  .scroll-slide-left,
  .scroll-slide-right,
  .scroll-flip,
  .scroll-parallax,
  .scroll-blur-in {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
  .stagger-item {
    animation-delay: 0ms !important;
  }
}
```

---

## 6. Visual Enhancement System

### 6.1 Gradient Engine

```css
/* Linear gradient */
background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%);

/* Radial gradient (spotlight) */
background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), #6366F140 0%, transparent 50%);

/* Conic gradient (aurora) */
background: conic-gradient(from 180deg at 50% 50%, #6366F120, #EC489920, #06B6D420, #6366F120);
```

### 6.2 Glassmorphism

```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
```

### 6.3 Shadow System

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
--shadow-xl: 0 16px 48px rgba(0,0,0,0.16);
--shadow-glow: 0 0 24px rgba(99,102,241,0.3);
```

### 6.4 Bento Grid

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 16px;
}
.bento-hero   { grid-column: span 2; grid-row: span 2; }
.bento-about  { grid-column: span 2; }
.bento-skills { grid-column: span 1; grid-row: span 2; }
.bento-exp    { grid-column: span 3; }
```

### 6.5 Aurora Background

```css
.aurora-bg {
  position: relative;
  overflow: hidden;
}
.aurora-bg::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(from 0deg, #6366F1, #EC4899, #06B6D4, #8B5CF6, #6366F1);
  animation: aurora-rotate 12s linear infinite;
  filter: blur(80px);
  opacity: 0.3;
}
@keyframes aurora-rotate {
  to { transform: rotate(360deg); }
}
```

### 6.6 Mesh Gradient

```css
.mesh-gradient {
  background:
    radial-gradient(at 20% 20%, #6366F130 0%, transparent 50%),
    radial-gradient(at 80% 80%, #EC489930 0%, transparent 50%),
    radial-gradient(at 50% 50%, #06B6D430 0%, transparent 50%),
    var(--bg-color);
}
```

### 6.7 Spotlight Effect

```css
.spotlight {
  position: relative;
  overflow: hidden;
}
.spotlight::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%);
  left: var(--mouse-x, 50%);
  top: var(--mouse-y, 50%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: left 0.3s, top 0.3s;
}
```

---

## 7. Mobile-First Responsive Design

### 7.1 Breakpoint System

| Breakpoint | Width | Layout Changes |
|---|---|---|
| **Mobile** | < 640px | Single column, stacked sections, hamburger sidebar, touch-optimized |
| **Tablet** | 640px – 1024px | 2-column grids, collapsible sidebar, medium touch targets |
| **Desktop** | > 1024px | Full 3-panel layout, hover effects, keyboard navigation |

### 7.2 Responsive Template Behavior

```
Desktop (1280px):
┌──────────┬────────────────────────┬──────────┐
│ Sidebar  │    Preview Canvas      │ Styling  │
│ 280px    │    flex-1              │ Panel    │
│          │                        │ 300px    │
└──────────┴────────────────────────┴──────────┘

Tablet (768px):
┌─────────────────────────────────────────────┐
│  Tabs: [Templates] [Components] [Styles]    │
├─────────────────────────────────────────────┤
│                                             │
│         Preview Canvas (full width)         │
│                                             │
└─────────────────────────────────────────────┘
↓ Slide-up panel for active tab

Mobile (375px):
┌───────────────────────┐
│  [☰] Portfolio  [Export] │
├───────────────────────┤
│                       │
│   Preview Canvas      │
│   (full width)        │
│                       │
├───────────────────────┤
│  Bottom Sheet:        │
│  [Templates] [Edit]   │
│  [Styles]  [Animate]  │
└───────────────────────┘
```

### 7.3 Performance Optimization

- **Lazy loading**: Template preview images use `loading="lazy"`
- **Code splitting**: Each template's render function is dynamically imported
- **Memoization**: `useMemo` for HTML generation; Zustand selectors for fine-grained re-renders
- **Debounced updates**: Color/style changes debounce 150ms before re-rendering preview
- **CSS containment**: `contain: layout style paint` on preview sections
- **Reduced motion**: All animations respect `prefers-reduced-motion`
- **Efficient re-renders**: Only regenerate HTML when customization or data actually changes (shallow comparison)

---

## 8. User Image Upload System

### 8.1 Flow

```
User clicks "Upload Photo"
  → File picker opens (accept: image/png, image/jpeg, image/webp)
  → File selected
  → Client-side validation:
      - Max size: 5MB
      - Allowed types: PNG, JPEG, WebP
  → Client-side resize (canvas API):
      - Max dimensions: 800x800px
      - Maintain aspect ratio
      - Output: WebP for efficiency
  → Upload to Atoms Cloud File Storage
  → Receive CDN URL
  → Store URL in EditorState.profileImage
  → Renderer injects <img> into template hero section
```

### 8.2 Image Display Per Template

| Layout Type | Image Position | Shape Options | Size |
|---|---|---|---|
| Single Column | Centered above name | Circle, Rounded, Square | S/M/L |
| Sidebar Left | Top of sidebar | Circle, Rounded | S/M |
| Sidebar Right | Top of sidebar | Circle, Rounded | S/M |
| Split Hero | Right half of hero | Circle, Rounded, Square | M/L |
| Bento Grid | Hero cell | Rounded, Square | M/L |
| Magazine | Beside headline | Circle, Rounded | S/M |
| Timeline Center | Center top | Circle | S/M |
| Card Stack | Card header | Rounded, Square | M/L |
| Fullscreen Sections | Centered overlay | Circle, Rounded | L |
| Asymmetric | Offset position | Circle, Rounded, Square | M/L |
| Minimal Center | Above name, small | Circle | S |
| Dashboard | Top-left card | Rounded, Square | S/M |

### 8.3 Fallback Behavior
- If no image uploaded: template renders without image placeholder (clean layout)
- Image is **always optional** — templates must look complete without it
- Remove image button clears the URL and reverts to no-image layout

---

## 9. Data Structures & Interfaces Overview

### Core Data Flow

```
PortfolioData (resume content)
       +
TemplateConfig (template definition)
       +
CustomizationOptions (user overrides)
       ↓
TemplateRenderer.generateCSS()
TemplateRenderer.renderSection() × N
TemplateRenderer.injectAnimations()
TemplateRenderer.injectVisualStyles()
TemplateRenderer.injectImage()
       ↓
Complete standalone HTML string
       ↓
iframe srcDoc (preview) / Blob download (export)
```

### Key Interfaces

- **`PortfolioData`** — Extended with `profileImage: string | null`
- **`TemplateConfig`** — New comprehensive template definition with layout, colors, fonts, animations, visual style, sections
- **`CustomizationOptions`** — Extended with `fonts: FontPairing`, `animation: AnimationProfile`, `visualStyle: VisualStyleConfig`, `profileImage`, `layout: LayoutType`, `sections: SectionInstance[]`
- **`EditorStore`** — Zustand store managing all editor state, undo/redo, and actions
- **`TemplateRegistry`** — Singleton registry for template lookup, search, and categorization
- **`TemplateRenderer`** — Pure function class that generates HTML from data + config
- **`AnimationController`** — Manages Intersection Observer and hover listeners in preview iframe
- **`ImageService`** — Handles upload, validation, resize, and storage via Atoms Cloud

---

## 10. Program Call Flow Overview

### 10.1 Initialization
1. User navigates to Builder with resume data → `BuilderPage` mounts
2. `EditorStore` initializes with default state and parsed resume data
3. `TemplateRegistry.getByUserType(userType)` returns recommended templates
4. `TemplateRenderer.render(data, templateConfig, customization)` generates initial HTML
5. HTML loaded into iframe via `srcDoc`

### 10.2 Template Selection
1. User clicks template card → `EditorStore.setSelectedTemplateId(id)`
2. Store fetches `TemplateConfig` from registry → resets customization to template defaults
3. `TemplateRenderer.render()` regenerates HTML with new template
4. Preview iframe reloads

### 10.3 Section Reorder (Drag & Drop)
1. User drags section handle → `DndContext.onDragStart()` fires
2. `DragOverlay` shows ghost preview
3. User drops at new position → `DndContext.onDragEnd()` fires
4. `EditorStore.reorderSections(activeId, overId)` updates section order
5. `TemplateRenderer.render()` regenerates HTML with new section order
6. Preview iframe reloads

### 10.4 Inline Editing
1. User clicks text in preview → iframe posts message to parent: `{type: 'section-click', sectionId}`
2. Parent sets `EditorStore.setActiveSection(sectionId)`
3. Iframe enables `contentEditable` on clicked element
4. User types → iframe posts message: `{type: 'content-change', field, value}`
5. `EditorStore.updatePortfolioData({[field]: value})` updates data
6. Debounced re-render (150ms) updates preview

### 10.5 Styling Change
1. User picks color → `EditorStore.updateColors({primary: '#FF6B6B'})`
2. Store updates customization state
3. Debounced `TemplateRenderer.render()` regenerates HTML
4. Preview iframe reloads with new colors

### 10.6 Image Upload
1. User clicks upload → `ImageService.upload(file)` called
2. Client-side validation → resize → upload to Atoms Cloud
3. CDN URL returned → `EditorStore.setProfileImage(url)`
4. `TemplateRenderer.injectImage()` adds `<img>` to hero section
5. Preview updates

### 10.7 Export
1. User clicks Export → `TemplateRenderer.render()` generates final HTML
2. All CSS, JS, fonts embedded inline (self-contained)
3. Blob created → download triggered

---

## 11. Database ER Diagram Overview

The system uses Atoms Cloud Database with the following key entities:

- **Portfolios** — Main portfolio record linking user, template, and content
- **PortfolioSections** — Ordered section instances per portfolio
- **PortfolioSkills** — Skills with categories per portfolio
- **PortfolioExperience** — Work experience entries per portfolio
- **PortfolioEducation** — Education entries per portfolio
- **PortfolioProjects** — Project entries per portfolio
- **PortfolioCertifications** — Certification entries per portfolio
- **CustomizationSettings** — All customization options per portfolio (colors, fonts, effects, animations)
- **Templates** — Template definitions (pre-seeded, 22 records)
- **AnimationProfiles** — Reusable animation configurations
- **SectionDefinitions** — Template-specific section configurations
- **UploadedImages** — User uploaded images with metadata

Key relationships:
- Portfolio → 1:N → Sections, Skills, Experience, Education, Projects, Certifications
- Portfolio → 1:1 → CustomizationSettings
- Portfolio → N:1 → Templates
- Template → 1:N → SectionDefinitions
- Template → N:1 → AnimationProfiles

---

## 12. Integration Plan — Replacing Existing Components

### 12.1 Files to Modify

| File | Change |
|---|---|
| `src/pages/Builder.tsx` | Replace 2-tab sidebar with 3-panel layout; add Zustand store; add viewport controls |
| `src/lib/portfolio-templates.ts` | Expand to 22 templates; add new interfaces; add TemplateRegistry; enhance TemplateRenderer |
| `src/components/TemplateSelector.tsx` | Replace with `TemplateGallery` — category filters, search, 22 templates |
| `src/components/CustomizationPanel.tsx` | Replace with `StylingPanel` — 5 tabs (Colors/Fonts/Effects/Animations/Image) |
| `src/components/PortfolioPreview.tsx` | Enhance with inline editing, section highlighting, viewport simulation |

### 12.2 New Files to Create

| File | Purpose |
|---|---|
| `src/store/editor-store.ts` | Zustand store for all editor state |
| `src/store/undo-middleware.ts` | Undo/redo middleware for Zustand |
| `src/lib/template-registry.ts` | Template registry with lookup/search |
| `src/lib/template-renderer.ts` | Enhanced HTML renderer with animations/effects |
| `src/lib/animation-controller.ts` | Intersection Observer + hover animation manager |
| `src/lib/image-service.ts` | Image upload, validate, resize service |
| `src/lib/visual-styles.ts` | CSS generators for gradients, glass, aurora, etc. |
| `src/lib/responsive-css.ts` | Mobile-first responsive CSS generator |
| `src/components/editor/ComponentsPanel.tsx` | Drag-and-drop section list |
| `src/components/editor/StylingPanel.tsx` | 5-tab styling controls |
| `src/components/editor/TemplateGallery.tsx` | 22-template gallery with filters |
| `src/components/editor/LayoutPanel.tsx` | Layout type selector + viewport switcher |
| `src/components/editor/InlineEditor.tsx` | ContentEditable overlay for preview |
| `src/components/editor/ImageUploader.tsx` | Image upload with preview and controls |
| `src/components/editor/ColorPicker.tsx` | Enhanced color picker with contrast indicator |
| `src/components/editor/FontSelector.tsx` | Google Font selector with preview |
| `src/components/editor/AnimationSettings.tsx` | Animation configuration panel |
| `src/components/editor/EffectsPanel.tsx` | Visual effects toggle panel |
| `src/templates/student-clean.ts` | Template 1 definition + render |
| `src/templates/student-vibrant.ts` | Template 2 definition + render |
| ... (22 template files) | One file per template |
| `src/templates/index.ts` | Template barrel export + registry seeding |

### 12.3 Migration Strategy

**Phase 1 — Foundation (non-breaking)**
1. Create `editor-store.ts` with Zustand
2. Create `template-registry.ts` and `template-renderer.ts`
3. Create all 22 template definition files
4. Create `animation-controller.ts`, `visual-styles.ts`, `responsive-css.ts`
5. Create `image-service.ts`

**Phase 2 — New Components (non-breaking)**
1. Build all new editor components (ComponentsPanel, StylingPanel, TemplateGallery, etc.)
2. Build new StylingPanel with 5 tabs
3. Build enhanced PortfolioPreview with inline editing

**Phase 3 — Integration (replace existing)**
1. Update `Builder.tsx` to use new 3-panel layout + Zustand store
2. Replace `TemplateSelector` with `TemplateGallery`
3. Replace `CustomizationPanel` with `StylingPanel`
4. Enhance `PortfolioPreview` with inline editing
5. Update `portfolio-templates.ts` to export new interfaces (backward compatible)

**Phase 4 — Polish**
1. Add undo/redo
2. Add keyboard shortcuts
3. Performance optimization (debouncing, memoization)
4. Accessibility audit
5. Mobile responsive editor layout

---

## 13. Unclear Aspects & Assumptions

| # | Uncertainty | Assumption |
|---|---|---|
| 1 | Atoms Cloud File Storage API exact endpoints | Assume RESTful upload endpoint exists; will verify during implementation |
| 2 | Maximum template preview image hosting | Assume template preview images are hosted on external CDN (current pattern) |
| 3 | Google Fonts API rate limits | Assume free tier is sufficient for portfolio builder usage |
| 4 | Inline editing in iframe cross-origin | Using `srcDoc` (same-origin) so `postMessage` works; no cross-origin issues |
| 5 | Undo/redo stack depth limit | Assume 50 states is sufficient; will implement LIFO with max size |
| 6 | Image upload concurrent limits | Assume one image at a time is sufficient for profile photo |
| 7 | Template rendering performance with 22 templates | Template definitions are lightweight config objects; only the selected template's HTML is generated |
| 8 | Whether existing 4 template IDs must be preserved | Assume we can use new IDs; old portfolios will need migration or fallback |
| 9 | DeepSeek AI model version for content enhancement | Using `deepseek-v3.2 [gentxt]` as specified in project requirements |
| 10 | Whether portfolio data should persist across sessions | Assume yes; Atoms Cloud Database will store portfolio + customization |

---

## 14. File Tree (New Project Structure)

```
src/
├── store/
│   ├── editor-store.ts              # Zustand editor state
│   └── undo-middleware.ts           # Undo/redo middleware
├── lib/
│   ├── portfolio-templates.ts       # Updated interfaces + backward compat
│   ├── template-registry.ts         # Template lookup/search
│   ├── template-renderer.ts         # HTML generation engine
│   ├── animation-controller.ts      # Intersection Observer + hover
│   ├── visual-styles.ts             # CSS generators for effects
│   ├── responsive-css.ts            # Mobile-first CSS generator
│   ├── image-service.ts             # Upload/validate/resize
│   ├── color-utils.ts               # Color manipulation (colord)
│   └── font-loader.ts               # Google Fonts dynamic loader
├── templates/
│   ├── index.ts                     # Barrel export + registry seed
│   ├── student-clean.ts
│   ├── student-vibrant.ts
│   ├── student-minimal.ts
│   ├── student-creative.ts
│   ├── fresher-launch.ts
│   ├── fresher-aurora.ts
│   ├── fresher-grad.ts
│   ├── fresher-bold.ts
│   ├── pro-executive.ts
│   ├── pro-elite.ts
│   ├── pro-modern.ts
│   ├── pro-slate.ts
│   ├── pro-aurora.ts
│   ├── free-studio.ts
│   ├── free-freelance.ts
│   ├── free-creative.ts
│   ├── free-spotlight.ts
│   ├── free-neon.ts
│   ├── dev-terminal.ts
│   ├── dev-code.ts
│   ├── dev-hacker.ts
│   └── dev-oss.ts
├── components/
│   ├── editor/
│   │   ├── ComponentsPanel.tsx       # Drag-and-drop section list
│   │   ├── StylingPanel.tsx          # 5-tab styling controls
│   │   ├── TemplateGallery.tsx       # 22-template gallery
│   │   ├── LayoutPanel.tsx           # Layout + viewport controls
│   │   ├── InlineEditor.tsx          # ContentEditable overlay
│   │   ├── ImageUploader.tsx         # Image upload + controls
│   │   ├── ColorPicker.tsx           # Enhanced color picker
│   │   ├── FontSelector.tsx          # Google Font selector
│   │   ├── AnimationSettings.tsx     # Animation config panel
│   │   └── EffectsPanel.tsx          # Visual effects toggles
│   ├── CustomizationPanel.tsx        # [DEPRECATED] replaced by StylingPanel
│   ├── TemplateSelector.tsx          # [DEPRECATED] replaced by TemplateGallery
│   └── PortfolioPreview.tsx          # [ENHANCED] inline editing + viewport
├── pages/
│   └── Builder.tsx                   # [REFACTORED] 3-panel layout
└── ...
```