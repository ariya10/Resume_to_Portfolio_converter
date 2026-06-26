# Canva-Style Visual Editor - Architecture Documentation

## Overview
A production-ready, high-performance visual design editor built with React, Konva.js, and modern web technologies. This editor provides a Canva-like experience with drag-and-drop canvas editing, layers management, rich styling controls, and export capabilities.

## Technology Stack

### Core Framework
- **React 18.3**: UI framework with hooks and context
- **TypeScript 5.5**: Type-safe development
- **Vite 5.4**: Fast build tool and dev server

### Canvas & Rendering
- **Konva.js 9.3**: High-performance 2D canvas library
- **react-konva 18.2**: React bindings for Konva
- **HTML Canvas API**: For exports and rendering

### State Management
- **Zustand 4.5**: Lightweight, scalable state management
- **Local Storage**: Draft persistence
- **IndexedDB**: Asset caching (future enhancement)

### UI Components
- **Shadcn/UI**: Radix UI-based component library
- **TailwindCSS 3.4**: Utility-first CSS framework
- **Framer Motion 11.5**: Animation library
- **Lucide React**: Icon library

### File Handling
- **react-dropzone 14.2**: File upload handling
- **html2canvas 1.4**: Canvas to image conversion
- **jsPDF 2.5**: PDF generation

## Project Structure

```
src/
├── components/
│   ├── canvas/                # Canvas-related components
│   │   ├── Canvas.tsx         # Main Konva canvas wrapper
│   │   ├── CanvasElement.tsx  # Base canvas element
│   │   ├── TextElement.tsx    # Editable text element
│   │   ├── ImageElement.tsx   # Image element with transforms
│   │   ├── ShapeElement.tsx   # Vector shapes
│   │   ├── TransformControls.tsx # Resize/rotate handles
│   │   └── SelectionBox.tsx   # Multi-select box
│   │
│   ├── panels/               # Sidebar panels
│   │   ├── LeftSidebar.tsx  # Tools, assets, layers
│   │   ├── RightSidebar.tsx # Properties, styling
│   │   ├── ToolsPanel.tsx   # Toolbox
│   │   ├── AssetsPanel.tsx  # Asset library
│   │   ├── LayersPanel.tsx  # Layer management
│   │   └── PropertiesPanel.tsx # Element properties
│   │
│   ├── toolbar/             # Top toolbar components
│   │   ├── TopToolbar.tsx   # Main toolbar
│   │   ├── UndoRedo.tsx     # History controls
│   │   ├── ZoomControls.tsx # Zoom/pan controls
│   │   └── ExportMenu.tsx   # Export options
│   │
│   ├── modals/              # Modal dialogs
│   │   ├── ExportDialog.tsx # Export settings
│   │   ├── UploadDialog.tsx # Asset upload
│   │   └── PreviewDialog.tsx # Full preview
│   │
│   └── ui/                  # Shadcn UI components
│       └── ... (button, dialog, etc.)
│
├── stores/                   # Zustand stores
│   ├── editorStore.ts       # Main editor state
│   ├── canvasStore.ts       # Canvas elements & layers
│   ├── historyStore.ts      # Undo/redo history
│   └── assetStore.ts        # Asset library state
│
├── lib/                      # Utilities and helpers
│   ├── canvas/
│   │   ├── elementFactory.ts # Create canvas elements
│   │   ├── transformer.ts    # Transform utilities
│   │   ├── snapping.ts       # Snap-to-grid/guides
│   │   └── renderer.ts       # Export rendering
│   │
│   ├── export/
│   │   ├── exportPNG.ts      # PNG export
│   │   ├── exportPDF.ts      # PDF export
│   │   └── exportHTML.ts     # HTML/CSS export
│   │
│   ├── utils/
│   │   ├── geometry.ts       # Geometric calculations
│   │   ├── colors.ts         # Color utilities
│   │   └── keyboard.ts       # Keyboard shortcuts
│   │
│   └── constants.ts          # App constants
│
├── types/                    # TypeScript definitions
│   ├── canvas.ts            # Canvas element types
│   ├── editor.ts            # Editor types
│   └── export.ts            # Export types
│
├── hooks/                    # Custom React hooks
│   ├── useCanvas.ts         # Canvas operations
│   ├── useSelection.ts      # Selection management
│   ├── useHistory.ts        # Undo/redo logic
│   ├── useKeyboard.ts       # Keyboard shortcuts
│   └── useAutosave.ts       # Auto-save functionality
│
├── pages/
│   └── Editor.tsx           # Main editor page
│
├── App.tsx                  # Root component
└── main.tsx                # Entry point
```

## Core Features & Implementation

### 1. Canvas System
**Architecture:** Konva.js stage with React integration
```typescript
- Stage (main container)
  └── Layer (rendering layer)
      ├── Group (element grouping)
      │   ├── Transformer (resize/rotate handles)
      │   └── Elements (shapes, text, images)
      └── Selection Box
```

**Key Features:**
- Infinite canvas with pan/zoom
- Smart snapping guides
- Grid system
- Multi-select support
- Keyboard shortcuts (Cmd/Ctrl+C/V/Z, Delete)

### 2. Element Types
**Implemented Elements:**
1. **Text Element**
   - Rich text editing
   - Font family, size, weight
   - Letter spacing, line height
   - Color, opacity, shadows
   - Alignment controls

2. **Image Element**
   - Upload from local
   - Drag from asset library
   - Crop, filters, effects
   - Opacity, blend modes

3. **Shape Element**
   - Rectangle, Circle, Polygon
   - Line, Arrow
   - Fill, stroke, shadow
   - Gradient support

4. **SVG/Icon Element**
   - Import SVG files
   - Color customization
   - Size controls

### 3. Layer Management
**Architecture:** Z-index based hierarchy with drag-drop reordering

**Features:**
- Visual layer tree
- Lock/unlock layers
- Show/hide visibility
- Rename layers
- Group/ungroup
- Nested groups support

### 4. Transform System
**Implementation:** Konva Transformer with custom handles

**Capabilities:**
- Resize (with aspect ratio lock)
- Rotate (with angle snapping)
- Scale (uniform/non-uniform)
- Position (x, y coordinates)
- Alignment tools (left, center, right, top, middle, bottom)
- Distribution tools

### 5. Property Panel
**Dynamic property editing based on selected element type:**

**Text Properties:**
- Font family dropdown
- Font size slider
- Font weight selector
- Text alignment
- Letter spacing
- Line height
- Text color picker
- Text shadow

**Image Properties:**
- Opacity slider
- Blend mode selector
- Filters (brightness, contrast, saturation, blur)
- Crop tool
- Replace image

**Shape Properties:**
- Fill color
- Stroke color
- Stroke width
- Corner radius (rectangles)
- Shadow controls

### 6. Animation System
**Architecture:** Framer Motion for UI, Konva animations for canvas

**Supported Animations:**
- Entrance: fade in, slide in, scale in, rotate in
- Exit: fade out, slide out, scale out
- Hover effects
- Timeline-based sequencing
- Duration & easing controls

### 7. Asset Library
**Features:**
- Local uploads (images, SVGs)
- Categorization & tags
- Search & filter
- Drag-and-drop to canvas
- Lazy loading
- Thumbnail generation
- Asset deletion

**Storage:**
- Base64 encoding for images
- LocalStorage for small assets
- Future: IndexedDB for large libraries

### 8. History System
**Implementation:** Command pattern with state snapshots

```typescript
interface HistoryEntry {
  elements: CanvasElement[]
  timestamp: number
  action: string
}
```

**Features:**
- Undo/Redo stack (50 operations)
- Keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
- Action batching for drag operations
- Optimized snapshot diffing

### 9. Export System

**PNG Export:**
- High-resolution export (1x, 2x, 3x)
- Transparent background option
- Automatic canvas sizing

**PDF Export:**
- Vector text preservation
- Image embedding
- Page sizing options
- Multi-page support (future)

**HTML/CSS Export:**
- Absolute positioning
- Inline styles
- Asset bundling
- Responsive breakpoints (future)

### 10. Autosave & Persistence

**Implementation:**
```typescript
- Debounced autosave (3s delay)
- LocalStorage for drafts
- JSON project serialization
- Recovery on reload
```

**Saved Data:**
```json
{
  "version": "1.0",
  "elements": [...],
  "canvas": {
    "width": 1920,
    "height": 1080,
    "background": "#ffffff"
  },
  "assets": [...],
  "lastModified": "2024-01-01T00:00:00Z"
}
```

## Performance Optimizations

### 1. Rendering Performance
- **Virtualization**: Only render visible canvas elements
- **Memoization**: React.memo for heavy components
- **useMemo/useCallback**: Prevent unnecessary recalculations
- **Layer caching**: Konva layer caching for static content

### 2. State Management
- **Selective updates**: Update only changed properties
- **Batching**: Group multiple state changes
- **Derived state**: Compute only when dependencies change

### 3. Asset Loading
- **Lazy loading**: Load images on demand
- **Progressive loading**: Show thumbnails first
- **Caching**: Cache decoded images
- **WebP support**: Use modern formats

### 4. Event Handling
- **Debouncing**: Text input, zoom, pan
- **Throttling**: Mouse move, resize events
- **Event delegation**: Single canvas event listener
- **Passive listeners**: Scroll/touch events

## Accessibility

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Minimum 4.5:1 ratio
- **Alternative Text**: Image descriptions
- **Keyboard Shortcuts**: Configurable shortcuts with visual hints

## Security Considerations
- **File Upload Validation**: Type and size checks
- **XSS Prevention**: Sanitize user inputs
- **CORS Handling**: Secure image loading
- **Data Privacy**: Local-first approach, no server uploads

## Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Canvas operations, state management
- **E2E Tests**: Playwright for critical user flows
- **Performance Tests**: Lighthouse, React DevTools Profiler

## Future Enhancements
1. **Collaboration**: Real-time multi-user editing (Socket.io/WebRTC)
2. **AI Tools**: Background removal, smart crop, style transfer
3. **Template Marketplace**: Pre-built templates and components
4. **Video Export**: Canvas animation to MP4
5. **Cloud Storage**: Save projects to cloud
6. **Version Control**: Project versioning and branching
7. **Advanced Animations**: Lottie integration, physics-based animations
8. **Plugins**: Extensible plugin system
9. **Mobile App**: React Native version
10. **Advanced Text**: Markdown support, text effects

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Consistent naming conventions
- Comprehensive JSDoc comments

### Component Guidelines
- Single responsibility principle
- Props typing with interfaces
- Default props for optional values
- Error boundaries for crash handling

### State Management
- Immutable updates
- Normalized state shape
- Computed selectors
- Middleware for logging (dev only)

### Performance Rules
- Avoid inline functions in render
- Use keys for list items
- Lazy load heavy components
- Profile before optimizing

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables
```env
VITE_APP_NAME=Canva Editor
VITE_MAX_UPLOAD_SIZE=10485760  # 10MB
VITE_AUTOSAVE_DELAY=3000       # 3 seconds
VITE_MAX_HISTORY=50            # History entries
```

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 14+, Chrome Android 90+

## License
MIT License - See LICENSE file for details

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-01  
**Maintainer:** Development Team
