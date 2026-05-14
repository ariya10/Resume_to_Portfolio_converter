# 🚀 Quick Reference Guide

## File Locations

```
resume-to-portfolio/
├── backend/
│   ├── main.py (FastAPI server)
│   ├── routers/portfolio.py (parser endpoint)
│   └── services/auth.py
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx (routing - NEW /templates route)
│   │   ├── pages/
│   │   │   ├── Index.tsx (MODIFIED navigation to /templates)
│   │   │   ├── TemplateGallery.tsx (NEW - 450 lines)
│   │   │   ├── Builder.tsx (ENHANCED with template selection)
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ResumeUploader.tsx (MODIFIED)
│   │   │   ├── PortfolioPreview.tsx
│   │   │   ├── editor/
│   │   │   │   ├── ComponentsPanel.tsx (ENHANCED)
│   │   │   │   └── StylingPanel.tsx (ENHANCED)
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── portfolio-templates.ts (EXISTING - 22 templates)
│   │   │   └── ...
│   │   ├── store/
│   │   │   └── editor-store.ts (Zustand)
│   │   └── api/
│   │       └── settings.ts
│   │
│   ├── USER_GUIDE.md (NEW - user documentation)
│   ├── PORTFOLIO_EDITOR_GUIDE.md (NEW - technical guide)
│   └── vite.config.ts
│
└── TECHNICAL_CHECKLIST.md (NEW - implementation verification)
```

## Key Dependencies

```bash
# Already installed
npm install react react-dom react-router-dom
npm install zustand @dnd-kit/core @dnd-kit/sortable
npm install framer-motion tailwindcss lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-select
```

## Navigation Flow Map

```
┌─────────────────────────────────────────────────────────┐
│ Landing Page (/)                                        │
│ "Upload Resume" button                                  │
└──────────────────────┬──────────────────────────────────┘
                       │ ResumeUploader component
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Resume Parsing (Backend)                                │
│ POST /api/v1/portfolio/parse                            │
│ Returns: parsedData, enhancedData                        │
└──────────────────────┬──────────────────────────────────┘
                       │ On success
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Template Gallery (/templates)                           │
│ State: { parsedData, enhancedData, fileName }           │
│ Features: Search, Filter, Preview                       │
└──────────────────────┬──────────────────────────────────┘
                       │ User selects template
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Builder (/builder)                                      │
│ State: { ..., selectedTemplateId }                      │
│ 3-Panel: Layers | Preview | Styling                     │
│ Features: Edit, Customize, Export                       │
└─────────────────────────────────────────────────────────┘
```

## Code Snippets

### Navigate with State

```typescript
// Redirect to template gallery with resume data
navigate("/templates", {
  state: {
    parsedData: data,
    enhancedData: enhanced,
    fileName: file.name
  }
});

// Receive state in component
const location = useLocation();
const { parsedData, enhancedData, fileName } = location.state || {};
```

### Zustand Store Usage

```typescript
import { useEditorStore } from '@/store/editor-store';

// In component
const { customization, setColors, undo, redo } = useEditorStore();

// Update colors
setColors({
  ...customization.colors,
  primary: '#FF5733'
});

// Undo/Redo
undo(); // Ctrl+Z
redo(); // Ctrl+Shift+Z
```

### Template System

```typescript
import { THEME_PRESETS, getDefaultCustomization } from '@/lib/portfolio-templates';

// Get all templates
const templates = THEME_PRESETS; // Array of 22 templates

// Get specific template
const template = THEME_PRESETS.find(t => t.id === templateId);

// Get default customization
const customization = getDefaultCustomization(templateId);

// Access template data
template.name                 // "Aurora"
template.description          // "Fullscreen sections with parallax"
template.defaultColors        // Color palette
template.colorVariants        // 5+ color schemes
template.fonts                // Font pairings
template.animation            // Animation config
template.visualStyle          // Effects settings
```

### Drag-and-Drop Setup

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';

function ComponentsPanel() {
  return (
    <DndContext collisionDetection={closestCenter}>
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        {sections.map(section => (
          <SortableItem key={section.id} id={section.id} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
  
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <span>⋮⋮ Drag Handle</span>
      {/* Content */}
    </div>
  );
}
```

### Color Customization

```typescript
const { customization, setColors } = useEditorStore();

// Get current colors
const colors = customization.colors;
console.log(colors.primary, colors.accent);

// Update specific color
setColors({
  ...customization.colors,
  primary: newColor
});

// Update multiple colors at once
setColors({
  primary: '#000000',
  secondary: '#FFFFFF',
  accent: '#FF0000'
});
```

### Export Portfolio

```typescript
// PDF Export (browser print)
window.print();

// JSON Export
const exportData = {
  parsedData,
  customization,
  templateId: selectedTemplateId
};
const json = JSON.stringify(exportData, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${name}_Portfolio.json`;
a.click();

// HTML Export
const html = generatePortfolioHTML(parsedData, customization);
// Download as HTML
```

## Common Tasks

### Add New Template

```typescript
// In portfolio-templates.ts
const newTemplate = {
  id: 'my-template',
  name: 'My Template',
  description: 'Custom template',
  category: 'professionals',
  style: 'modern',
  personality: 'bold',
  defaultColors: { primary, secondary, ... },
  colorVariants: [...],
  fonts: { heading, body, mono },
  animation: { ... },
  visualStyle: { ... }
};

THEME_PRESETS.push(newTemplate);
```

### Add Styling Control

```typescript
// In StylingPanel.tsx Effects Tab
<div>
  <Label className="text-[11px] text-slate-300">My Control</Label>
  <Slider
    value={[customization.visualStyle.myControl]}
    onValueChange={([v]) => setVisualStyle({ ...vs, myControl: v })}
    min={0}
    max={100}
  />
</div>
```

### Add Filter to Gallery

```typescript
// In TemplateGallery.tsx
const [myFilter, setMyFilter] = useState('all');

const filteredTemplates = THEME_PRESETS.filter(t => {
  if (myFilter !== 'all' && t.myProperty !== myFilter) return false;
  // ... other filters
  return true;
});
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Esc | Close modal |
| Tab | Focus next |
| Arrow Up/Down | Move dragged item |

## Environment Variables

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_STORAGE_BUCKET=resume-to-portfolio
VITE_CDN_URL=https://cdn.example.com
```

## Running Locally

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Open http://localhost:5173
```

## Build & Deploy

```bash
# Frontend build
cd frontend
npm run build
# Output: dist/

# Backend deployment
cd backend
python -m pip install -r requirements.txt
gunicorn main:app
```

## Testing

```bash
# Run tests
npm test

# Test specific file
npm test TemplateGallery

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Troubleshooting

### Templates not showing?
```typescript
// Check THEME_PRESETS is imported
import { THEME_PRESETS } from '@/lib/portfolio-templates';
console.log(THEME_PRESETS.length); // Should be 22+
```

### Navigation not working?
```typescript
// Verify route exists in App.tsx
<Route path="/templates" element={<TemplateGallery />} />
```

### State not persisting?
```typescript
// Check Zustand hook setup
const store = useEditorStore();
console.log(store.customization); // Should have data
```

### Preview not updating?
```typescript
// Ensure PortfolioPreview gets prop updates
<PortfolioPreview 
  data={portfolioData}
  customization={customization}
/>
```

## Performance Tips

1. **Memoize components** that don't change frequently
```typescript
const TemplateCard = React.memo(({ template, ... }) => (...));
```

2. **Use useCallback** for event handlers
```typescript
const handleClick = useCallback(() => { ... }, [deps]);
```

3. **Lazy load modals**
```typescript
const PreviewModal = lazy(() => import('./PreviewModal'));
```

4. **Optimize images**
```typescript
// Use webp with fallback
<img src="image.webp" alt="..." />
```

## API Reference

### Backend Endpoint: Parse Resume

```
POST /api/v1/portfolio/parse
Content-Type: application/json

Request:
{
  "pdf_data_uri": "data:application/pdf;base64,...",
  "file_type": "pdf"
}

Response:
{
  "success": true,
  "parsed_data": {
    "name": "John Doe",
    "title": "Software Engineer",
    "summary": "...",
    "skills": [...],
    "experience": [...],
    "projects": [...],
    ...
  },
  "enhanced_data": {
    "enhanced_bio": "...",
    "enhanced_summary": "...",
    ...
  }
}
```

## Component Props

### TemplateGallery
```typescript
// Receives via location.state
{
  parsedData: ParsedResumeData;
  enhancedData: EnhancedResumeData;
  fileName: string;
}
```

### Builder
```typescript
// Receives via location.state
{
  parsedData: ParsedResumeData;
  enhancedData: EnhancedResumeData;
  fileName: string;
  selectedTemplateId: string;
}
```

### PortfolioPreview
```typescript
{
  data: PortfolioData;
  customization: CustomizationOptions;
  onEditClick?: (fieldPath: string) => void;
}
```

## Type Definitions

```typescript
interface ParsedResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  links: Link[];
}

interface CustomizationOptions {
  themeId: string;
  colors: ColorPalette;
  fonts: FontPairing;
  animation: AnimationProfile;
  visualStyle: VisualStyleConfig;
  sectionInstances: Section[];
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}
```

## Resources

- [React 18 Docs](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [@dnd-kit](https://docs.dnd-kit.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support Contacts

- **Frontend Issues**: Check `frontend/` folder
- **Backend Issues**: Check `backend/` folder
- **General Questions**: Review documentation files

---

**Last Updated**: 2026 v2.0
