# Canva-Style Visual Editor Integration Guide

## Overview

The visual editor has been fully implemented as a standalone, modular system that can be integrated into the Builder.tsx page. This guide walks through the integration steps.

## Component Architecture

```
CanvasEditor (Main Container)
├── TopToolbar (Undo/Redo, Zoom, Export)
├── ToolsPanel (Left sidebar - Element creation)
├── LayersPanel (Left sidebar - Layer management)
├── CanvasLayer (Center - Konva Stage)
└── PropertiesPanel (Right sidebar - Element styling)
```

## Quick Integration Steps

### Step 1: Import the Editor Component

In your `Builder.tsx`:

```typescript
import { CanvasEditor } from '@/components/editor';
```

### Step 2: Add Editor Mode State

```typescript
const [editorMode, setEditorMode] = useState<'preview' | 'visual' | 'hybrid'>('hybrid');
```

### Step 3: Render the Editor

Replace or supplement your existing UI with:

```typescript
{editorMode === 'visual' && (
  <CanvasEditor 
    onClose={() => setEditorMode('preview')} 
  />
)}

{editorMode !== 'visual' && (
  // Existing portfolio preview UI
)}
```

### Step 4: Pass Canvas Data to Backend (Optional)

Export canvas state and save to your backend:

```typescript
const { useCanvasEditorStore } = from '@/store/canvas-editor-store';

const saveCanvasState = () => {
  const store = useCanvasEditorStore.getState();
  const canvasState = {
    elements: store.elements,
    viewport: store.viewport,
    settings: store.settings,
  };
  
  // Send to backend
  await api.savePortfolioCanvas(canvasState);
};
```

## Available Imports

### Main Component
- `CanvasEditor` - Main container with all UI

### Canvas Components
- `CanvasLayer` - Konva Stage wrapper
- `CanvasElement` - Individual element renderer
- `SelectionBox` - Multi-select indicator
- `GridLayer` - Background grid

### UI Panels
- `ToolsPanel` - Element creation tools
- `LayersPanel` - Layer management
- `PropertiesPanel` - Element styling
- `TopToolbar` - Editor controls

### Hooks
- `useKeyboardShortcuts()` - Register all shortcuts
- `useSelection()` - Element selection utilities
- `useCanvasExport()` - Export functionality

## Store Integration

The editor uses Zustand for state management. Access the store anywhere:

```typescript
import { useCanvasEditorStore } from '@/store/canvas-editor-store';

const MyComponent = () => {
  const { 
    elements,           // All canvas elements
    selectedIds,        // Currently selected element IDs
    history,           // Undo/redo history
    viewport,          // Zoom and pan state
    undo, redo,        // History methods
    addElement,        // Add new element
    removeElement,     // Delete element
    updateElement,     // Modify element
  } = useCanvasEditorStore();

  // Use the store
};
```

## Store Methods Reference

### Element Management
- `addElement(element)` - Add new canvas element
- `removeElement(id)` - Delete element by ID
- `updateElement(id, updates)` - Update element properties
- `duplicateElement(id)` - Clone element
- `deleteSelected()` - Remove all selected elements

### Selection
- `selectElement(id, multiSelect)` - Select element
- `deselectElement(id)` - Deselect element
- `clearSelection()` - Clear all selections
- `selectAll()` - Select all elements

### Transforms
- `moveElement(id, x, y)` - Reposition element
- `resizeElement(id, w, h)` - Change dimensions
- `rotateElement(id, angle)` - Rotate element
- `setZIndex(id, zIndex)` - Change layer order

### Utilities
- `toggleVisibility(id)` - Toggle element visibility
- `toggleLock(id)` - Lock/unlock element
- `groupElements(ids)` - Group multiple elements
- `ungroupElements(id)` - Ungroup elements

### History
- `undo()` - Undo last action
- `redo()` - Redo last action
- `createSnapshot(label)` - Save state snapshot

### Viewport
- `zoomIn()` - Increase zoom (×1.2)
- `zoomOut()` - Decrease zoom (÷1.2)
- `setZoom(scale)` - Set zoom to specific value
- `pan(x, y)` - Move viewport

## Usage Example: Full Integration

```typescript
import React, { useState } from 'react';
import { CanvasEditor } from '@/components/editor';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';

export const Builder: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { elements } = useCanvasEditorStore();

  const handleExportPortfolio = async () => {
    // Get current canvas state
    const state = useCanvasEditorStore.getState();
    
    // Send to backend or download
    console.log('Canvas elements:', state.elements);
    console.log('Viewport state:', state.viewport);
  };

  if (showEditor) {
    return (
      <CanvasEditor onClose={() => setShowEditor(false)} />
    );
  }

  return (
    <div className="p-8">
      <button 
        onClick={() => setShowEditor(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Open Visual Editor
      </button>
      
      {elements.length > 0 && (
        <button 
          onClick={handleExportPortfolio}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export Portfolio ({elements.length} elements)
        </button>
      )}
    </div>
  );
};
```

## File Locations

```
frontend/src/
├── components/editor/
│   ├── index.ts                    # Main exports
│   ├── CanvasEditor.tsx            # Main container
│   ├── canvas/
│   │   ├── CanvasLayer.tsx         # Konva Stage
│   │   ├── CanvasElement.tsx       # Element renderer
│   │   ├── SelectionBox.tsx        # Multi-select
│   │   └── GridLayer.tsx           # Background grid
│   ├── panels/
│   │   ├── ToolsPanel.tsx          # Element tools
│   │   ├── LayersPanel.tsx         # Layer management
│   │   └── PropertiesPanel.tsx     # Styling controls
│   ├── toolbar/
│   │   └── TopToolbar.tsx          # Editor controls
│   └── hooks/
│       ├── useKeyboardShortcuts.ts # Keyboard handler
│       ├── useSelection.ts         # Selection utilities
│       └── useCanvasExport.ts      # Export functions
├── store/
│   └── canvas-editor-store.ts      # Zustand store
└── lib/canvas/
    ├── types.ts                    # TypeScript definitions
    └── utils.ts                    # Utility functions
```

## Keyboard Shortcuts

- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo
- **Ctrl/Cmd + A** - Select all
- **Escape** - Deselect
- **Ctrl/Cmd + C** - Copy
- **Ctrl/Cmd + V** - Paste
- **Ctrl/Cmd + D** - Duplicate
- **Delete/Backspace** - Delete selected
- **Ctrl/Cmd + G** - Group selected
- **Arrow Keys** - Move selected (±1px, Shift for ±10px)
- **Mouse Wheel** - Zoom in/out
- **Spacebar + Drag** - Pan viewport

## Customization

### Theme

All components use Tailwind CSS with dark theme. Customize in `tailwind.config.ts`:

```typescript
colors: {
  slate: { 50: '#...', 950: '#...' },
  violet: { 500: '#...', 600: '#...' },
}
```

### Default Settings

Modify in `canvas-editor-store.ts`:

```typescript
settings: {
  showGrid: true,           // Show background grid
  gridSize: 20,            // Grid cell size in pixels
  snapToGrid: false,       // Snap elements to grid
  snapDistance: 10,        // Snap proximity in pixels
  defaultFill: '#3B82F6',  // Default fill color
  defaultStroke: '#000000',// Default stroke color
}
```

### Export Options

Configure export behavior in `useCanvasExport`:

```typescript
const exportOptions = {
  scale: 2,                // PNG/PDF resolution multiplier
  quality: 0.95,           // JPEG quality (0-1)
  format: 'png',          // Default format
};
```

## Performance Optimization

### Current Implementation
- Lazy image loading
- Sorted rendering by zIndex
- Event debouncing on drag/resize
- 100-item history limit

### Future Enhancements
- React.memo on all panel components
- Virtual scrolling for 100+ layers
- Canvas pooling for large designs
- RequestAnimationFrame debouncing

## Testing the Integration

1. **Basic Load**
   ```typescript
   // Should render without errors
   <CanvasEditor />
   ```

2. **Element Creation**
   - Click "Text" in Tools → should add text element
   - Click "Rectangle" → should add rectangle
   - Check Layers panel shows new element

3. **Selection & Transform**
   - Click element on canvas → should be highlighted
   - Drag handles → should resize
   - Properties panel → should show element properties

4. **Keyboard Shortcuts**
   - Ctrl+Z → should undo
   - Ctrl+A → should select all
   - Delete → should delete selected

5. **Export**
   - Click Export → PNG/PDF/JSON/HTML should download

## Troubleshooting

### Elements not rendering
- Check `visible` flag is true
- Verify element dimensions > 0
- Check zIndex ordering

### Canvas not responding
- Verify Konva Stage has `ref` prop
- Check React-Konva is installed
- Inspect browser console for errors

### Store not updating
- Ensure using `useCanvasEditorStore()` hook
- Check updateElement is being called
- Verify store subscriptions are active

### Export not working
- Check html2canvas and jsPDF installed
- Verify canvas has content
- Check browser console for errors

## Next Steps

1. **Integrate with Resume Data**
   - Load resume elements into canvas on load
   - Map portfolio template colors to elements

2. **Add Asset Library**
   - Implement image upload/management
   - Add preset templates

3. **Persistence**
   - Auto-save canvas state to localStorage
   - Save to backend database

4. **Collaboration Features**
   - Real-time multi-user editing
   - Comments and annotations

## API Reference

See the full TypeScript interface definitions in `src/lib/canvas/types.ts` for complete type information.

## Support

For issues or questions about implementation:
1. Check this guide
2. Review type definitions in types.ts
3. Check store methods in canvas-editor-store.ts
4. Inspect component props in React dev tools
