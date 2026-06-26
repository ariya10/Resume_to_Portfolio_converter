# Canva-Style Visual Editor - Complete Implementation Guide

## 🎨 Overview

This is a **production-ready, high-performance Canva-style visual editor** built with modern React architecture. It provides:

- 🖌️ **Drag-and-drop canvas editing** with Konva.js
- 📐 **Advanced transform controls** (resize, rotate, align, distribute)
- 🎭 **Rich element types** (text, images, shapes, SVG)
- 📚 **Layer management** with drag-drop reordering
- 🎨 **Comprehensive styling** controls
- ⚡ **Animation system** with Framer Motion
- 💾 **Auto-save & undo/redo** (50-step history)
- 📤 **Multi-format export** (PNG, PDF, HTML/CSS)
- 🎯 **Keyboard shortcuts** for power users
- ♿ **WCAG 2.1 AA accessibility** compliant

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Integration into Existing App](#integration)
4. [Project Structure](#structure)
5. [Core Components](#components)
6. [State Management](#state-management)
7. [Usage Examples](#examples)
8. [API Reference](#api)
9. [Performance Optimization](#performance)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

```json
{
  "node": ">=18.0.0",
  "npm": ">=9.0.0",
  "react": "^18.3.0",
  "typescript": "^5.0.0"
}
```

## 📦 Installation

### Step 1: Install Dependencies

Add these packages to your existing `package.json`:

```bash
npm install konva react-konva zustand framer-motion
npm install html2canvas jspdf react-dropzone
npm install lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-tooltip
```

Or add them manually to `package.json`:

```json
{
  "dependencies": {
    "konva": "^9.3.6",
    "react-konva": "^18.2.10",
    "zustand": "^4.5.5",
    "framer-motion": "^11.5.4",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "react-dropzone": "^14.2.3"
  }
}
```

### Step 2: Copy Source Files

Copy the following directories from this package into your project:

```
your-project/
└── src/
    ├── components/
    │   ├── canvas/           # Canvas components (provided)
    │   ├── panels/           # Sidebar panels (provided)
    │   ├── toolbar/          # Toolbar components (provided)
    │   └── modals/           # Modal dialogs (provided)
    ├── stores/
    │   └── editorStore.ts    # Main Zustand store (provided)
    ├── types/
    │   └── canvas.ts         # TypeScript types (provided)
    ├── lib/
    │   ├── canvas/           # Canvas utilities (provided)
    │   ├── export/           # Export functions (provided)
    │   └── utils/            # Helper utilities (provided)
    └── hooks/
        └── ...               # Custom hooks (provided)
```

---

## 🔗 Integration into Existing App

### Option A: Replace Existing Builder Page

If you want to completely replace your current builder with the Canva editor:

```tsx
// src/pages/Builder.tsx
import { CanvaEditor } from '@/components/canvas/CanvaEditor';

export default function Builder() {
  return <CanvaEditor />;
}
```

### Option B: Side-by-Side Integration

Keep both editors and let users choose:

```tsx
// src/pages/Builder.tsx
import { useState } from 'react';
import { CanvaEditor } from '@/components/canvas/CanvaEditor';
import { LegacyBuilder } from '@/components/LegacyBuilder';
import { Button } from '@/components/ui/button';

export default function Builder() {
  const [editorType, setEditorType] = useState<'canva' | 'legacy'>('canva');

  return (
    <div>
      <div className="p-4 border-b">
        <Button onClick={() => setEditorType('canva')}>Canva Editor</Button>
        <Button onClick={() => setEditorType('legacy')}>Legacy Builder</Button>
      </div>
      
      {editorType === 'canva' ? <CanvaEditor /> : <LegacyBuilder />}
    </div>
  );
}
```

### Option C: Gradual Migration

Integrate specific panels one at a time:

```tsx
// Start by using just the canvas component
import { Canvas } from '@/components/canvas/Canvas';
import { useEditorStore } from '@/stores/editorStore';

export default function Builder() {
  const { elements, selectedIds, updateElement, selectElement } = useEditorStore();

  return (
    <div className="flex">
      {/* Your existing left sidebar */}
      <YourLeftSidebar />
      
      {/* New Canva canvas */}
      <Canvas
        width={1920}
        height={1080}
        elements={Object.values(elements)}
        selectedIds={selectedIds}
        onSelect={selectElement}
        onUpdateElement={updateElement}
      />
      
      {/* Your existing right sidebar */}
      <YourRightSidebar />
    </div>
  );
}
```

---

## 📁 Project Structure

### Complete File Tree

```
src/
├── components/
│   ├── canvas/
│   │   ├── CanvaEditor.tsx           # Main editor wrapper
│   │   ├── Canvas.tsx                 # Konva canvas component
│   │   ├── CanvasElement.tsx          # Base element renderer
│   │   ├── TextElement.tsx            # Text editing
│   │   ├── ImageElement.tsx           # Image handling
│   │   ├── ShapeElement.tsx           # Vector shapes
│   │   ├── TransformControls.tsx      # Resize/rotate handles
│   │   └── SelectionBox.tsx           # Multi-select
│   │
│   ├── panels/
│   │   ├── LeftSidebar.tsx            # Main left panel
│   │   ├── ToolsPanel.tsx             # Tool selection
│   │   ├── AssetsPanel.tsx            # Asset library
│   │   ├── LayersPanel.tsx            # Layer tree
│   │   ├── RightSidebar.tsx           # Main right panel
│   │   └── PropertiesPanel.tsx        # Element properties
│   │
│   ├── toolbar/
│   │   ├── TopToolbar.tsx             # Main toolbar
│   │   ├── UndoRedo.tsx               # History controls
│   │   ├── ZoomControls.tsx           # Zoom/pan
│   │   └── ExportMenu.tsx             # Export dropdown
│   │
│   └── modals/
│       ├── ExportDialog.tsx           # Export settings
│       ├── UploadDialog.tsx           # Asset upload
│       └── PreviewDialog.tsx          # Fullscreen preview
│
├── stores/
│   └── editorStore.ts                 # Zustand state
│
├── types/
│   └── canvas.ts                      # TypeScript definitions
│
├── lib/
│   ├── canvas/
│   │   ├── elementFactory.ts          # Create elements
│   │   ├── transformer.ts             # Transform math
│   │   ├── snapping.ts                # Snap guides
│   │   └── renderer.ts                # Export rendering
│   │
│   ├── export/
│   │   ├── exportPNG.ts               # PNG export
│   │   ├── exportPDF.ts               # PDF generation
│   │   └── exportHTML.ts              # HTML/CSS export
│   │
│   └── utils/
│       ├── geometry.ts                # Math utilities
│       ├── colors.ts                  # Color functions
│       └── keyboard.ts                # Shortcut handling
│
└── hooks/
    ├── useCanvas.ts                   # Canvas operations
    ├── useSelection.ts                # Selection logic
    ├── useHistory.ts                  # Undo/redo
    ├── useKeyboard.ts                 # Keyboard bindings
    └── useAutosave.ts                 # Auto-save
```

---

## 🧩 Core Components

### 1. CanvaEditor (Main Component)

The root component that orchestrates everything:

```tsx
import { CanvaEditor } from '@/components/canvas/CanvaEditor';

<CanvaEditor 
  initialProject={project}         // Optional: load existing project
  onSave={(project) => {}}         // Callback when saving
  onExport={(blob, format) => {}}  // Callback after export
/>
```

**Props:**
- `initialProject?: ProjectData` - Load an existing project
- `onSave?: (project: ProjectData) => void` - Save callback
- `onExport?: (blob: Blob, format: string) => void` - Export callback
- `className?: string` - Additional CSS classes

### 2. Canvas Component

The Konva-powered canvas:

```tsx
import { Canvas } from '@/components/canvas/Canvas';

<Canvas
  width={1920}
  height={1080}
  elements={elements}
  selectedIds={selectedIds}
  onSelect={handleSelect}
  onUpdateElement={handleUpdate}
/>
```

### 3. Panels

Modular sidebar panels:

```tsx
import { LeftSidebar, RightSidebar } from '@/components/panels';

<div className="flex h-screen">
  <LeftSidebar />
  <Canvas {...props} />
  <RightSidebar />
</div>
```

---

## 🗄️ State Management

### Zustand Store Structure

```typescript
const useEditorStore = create<EditorState & EditorActions>()((set, get) => ({
  // Canvas state
  canvas: { width: 1920, height: 1080, background: '#fff' },
  elements: {},
  elementOrder: [],
  
  // Selection
  selection: { selectedIds: [], isMultiSelect: false },
  
  // View
  zoom: 1,
  panX: 0,
  panY: 0,
  
  // History
  history: [],
  historyIndex: -1,
  
  // Actions
  addElement: (element) => { /* ... */ },
  updateElement: (id, updates) => { /* ... */ },
  deleteElement: (id) => { /* ... */ },
  undo: () => { /* ... */ },
  redo: () => { /* ... */ },
  // ... 30+ more actions
}));
```

### Usage in Components

```tsx
import { useEditorStore, useSelectedElements } from '@/stores/editorStore';

function MyComponent() {
  // Select specific state
  const { addElement, undo, redo } = useEditorStore();
  const selectedElements = useSelectedElements();
  
  // Use actions
  const handleAdd = () => {
    addElement({
      type: 'text',
      content: 'Hello World',
      x: 100,
      y: 100,
      // ... other properties
    });
  };
  
  return (
    <div>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={handleAdd}>Add Text</button>
    </div>
  );
}
```

---

## 💡 Usage Examples

### Example 1: Add Text Element

```tsx
const { addElement } = useEditorStore();

addElement({
  id: 'text-1',
  type: 'text',
  name: 'Heading',
  content: 'Hello World',
  x: 100,
  y: 100,
  width: 200,
  height: 50,
  rotation: 0,
  opacity: 1,
  visible: true,
  locked: false,
  zIndex: 1,
  fontFamily: 'Inter',
  fontSize: 32,
  fontWeight: 'bold',
  fill: '#000000',
  textAlign: 'center',
  lineHeight: 1.2,
  letterSpacing: 0,
  timestamp: Date.now(),
});
```

### Example 2: Upload and Add Image

```tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUpload() {
  const { addElement } = useEditorStore();
  
  const onDrop = useCallback((files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        
        const img = new Image();
        img.onload = () => {
          addElement({
            type: 'image',
            src,
            x: 100,
            y: 100,
            width: img.width,
            height: img.height,
            originalWidth: img.width,
            originalHeight: img.height,
            cropX: 0,
            cropY: 0,
            cropWidth: img.width,
            cropHeight: img.height,
            // ... other properties
          });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  }, [addElement]);
  
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });
  
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drop images here</p>
    </div>
  );
}
```

### Example 3: Export as PNG

```tsx
import { exportToPNG } from '@/lib/export/exportPNG';

async function handleExport() {
  const { elements, canvas } = useEditorStore.getState();
  
  const blob = await exportToPNG({
    elements: Object.values(elements),
    canvas,
    scale: 2, // 2x resolution
    transparentBackground: false,
  });
  
  // Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'design.png';
  a.click();
}
```

### Example 4: Keyboard Shortcuts

```tsx
import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';

function KeyboardShortcuts() {
  const { undo, redo, copy, paste, deleteElement, selection } = useEditorStore();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      
      if (modifier && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (modifier && e.key === 'c') {
        e.preventDefault();
        copy();
      } else if (modifier && e.key === 'v') {
        e.preventDefault();
        paste();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        selection.selectedIds.forEach(id => deleteElement(id));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copy, paste, deleteElement, selection]);
  
  return null;
}
```

---

## 📚 API Reference

### Store Actions

#### Element Operations
- `addElement(element: CanvasElement): void` - Add new element
- `updateElement(id: string, updates: Partial<CanvasElement>): void` - Update element
- `deleteElement(id: string): void` - Delete element
- `duplicateElement(id: string): void` - Duplicate element

#### Selection
- `selectElement(id: string, addToSelection?: boolean): void` - Select element
- `deselectAll(): void` - Clear selection
- `selectAll(): void` - Select all elements

#### Transform
- `moveElement(id: string, x: number, y: number): void` - Move element
- `resizeElement(id: string, width: number, height: number): void` - Resize element
- `rotateElement(id: string, rotation: number): void` - Rotate element

#### Z-Index
- `bringToFront(id: string): void` - Move to top
- `sendToBack(id: string): void` - Move to bottom
- `bringForward(id: string): void` - Move up one layer
- `sendBackward(id: string): void` - Move down one layer

#### Grouping
- `groupElements(ids: string[]): void` - Group elements
- `ungroupElement(id: string): void` - Ungroup

#### Alignment
- `alignElements(type: AlignType): void` - Align selected elements
  - Types: `'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'`
- `distributeElements(type: DistributeType): void` - Distribute elements
  - Types: `'horizontal' | 'vertical'`

#### History
- `undo(): void` - Undo last action
- `redo(): void` - Redo next action
- `pushHistory(action: string): void` - Add to history

#### Clipboard
- `copy(): void` - Copy selected elements
- `paste(): void` - Paste from clipboard
- `cut(): void` - Cut selected elements

#### Project
- `loadProject(project: ProjectData): void` - Load project
- `saveProject(): ProjectData` - Save and return project
- `newProject(): void` - Clear and start new

### Selectors

```typescript
// Get selected elements
const selectedElements = useSelectedElements();

// Check undo/redo availability
const canUndo = useCanUndo();
const canRedo = useCanRedo();

// Get element count
const count = useElementCount();

// Get elements in z-order
const sortedElements = useSortedElements();
```

---

## ⚡ Performance Optimization

### Best Practices

1. **Memoize Heavy Components**
```tsx
const LayerItem = React.memo(({ element }) => {
  return <div>{element.name}</div>;
});
```

2. **Use Selective Subscriptions**
```tsx
// Bad: Subscribes to entire store
const store = useEditorStore();

// Good: Subscribe only to what you need
const zoom = useEditorStore(state => state.zoom);
```

3. **Debounce Frequent Updates**
```tsx
import { debounce } from 'lodash';

const debouncedUpdate = debounce((id, updates) => {
  updateElement(id, updates);
}, 100);
```

4. **Virtualize Long Lists**
```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={elements.length}
  itemSize={40}
>
  {({ index, style }) => (
    <LayerItem style={style} element={elements[index]} />
  )}
</FixedSizeList>
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Konva Not Rendering

**Problem:** Canvas is blank  
**Solution:** Ensure Konva Stage has proper width/height:

```tsx
<Stage width={window.innerWidth} height={window.innerHeight}>
  {/* ... */}
</Stage>
```

#### 2. Text Not Editable

**Problem:** Double-click doesn't activate text editing  
**Solution:** Check if element is locked or invisible

```tsx
if (element.locked || !element.visible) {
  return; // Can't edit
}
```

#### 3. Export Quality Poor

**Problem:** Exported images are blurry  
**Solution:** Increase export scale:

```tsx
exportToPNG({ scale: 3 }); // 3x resolution
```

#### 4. Slow Performance with Many Elements

**Problem:** Laggy interactions  
**Solution:** Enable Konva layer caching:

```tsx
<Layer listening={false}>
  {staticElements.map(el => <Element key={el.id} {...el} />)}
</Layer>
```

#### 5. TypeScript Errors

**Problem:** Type mismatches  
**Solution:** Ensure all types are imported:

```tsx
import type { CanvasElement, TextElement } from '@/types/canvas';
```

---

## 🎯 Next Steps

1. **Customize the UI** - Adjust colors, fonts, spacing to match your brand
2. **Add Templates** - Create preset designs for users
3. **Integrate AI** - Add background removal, smart crop, etc.
4. **Add Collaboration** - Implement real-time editing with WebSockets
5. **Mobile Support** - Add touch gestures and responsive layouts
6. **Analytics** - Track usage patterns and popular features

---

## 📞 Support

For issues, questions, or contributions:

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Docs: [Full documentation](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/example/repo/issues)

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

**Built with ❤️ using React, Konva, and modern web technologies**
