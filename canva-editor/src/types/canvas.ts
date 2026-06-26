// Core Canvas Element Types

export type ElementType = 'text' | 'image' | 'shape' | 'svg' | 'group';

export type ShapeType = 'rectangle' | 'circle' | 'polygon' | 'line' | 'arrow' | 'star' | 'ellipse';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

export type AnimationType = 'fadeIn' | 'slideIn' | 'scaleIn' | 'rotateIn' | 'fadeOut' | 'slideOut' | 'scaleOut' | 'rotateOut';

// Base Element Interface
export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  parentId?: string; // For grouped elements
  blendMode?: BlendMode;
  shadow?: Shadow;
  animation?: Animation;
  timestamp: number; // For undo/redo
}

// Text Element
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  textAlign: TextAlign;
  lineHeight: number;
  letterSpacing: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

// Image Element
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // Base64 or URL
  originalWidth: number;
  originalHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  filters?: ImageFilters;
}

// Shape Element
export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number; // For rectangles
  sides?: number; // For polygons
  points?: number[]; // For lines/polygons
}

// SVG Element
export interface SvgElement extends BaseElement {
  type: 'svg';
  svgContent: string;
  fill?: string; // Override SVG colors
  stroke?: string;
}

// Group Element
export interface GroupElement extends BaseElement {
  type: 'group';
  childIds: string[];
}

// Union type for all elements
export type CanvasElement = TextElement | ImageElement | ShapeElement | SvgElement | GroupElement;

// Shadow Configuration
export interface Shadow {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  enabled: boolean;
}

// Image Filters
export interface ImageFilters {
  brightness: number; // 0-200
  contrast: number; // 0-200
  saturation: number; // 0-200
  blur: number; // 0-100
  grayscale: number; // 0-100
  sepia: number; // 0-100
  hueRotate: number; // 0-360
}

// Animation Configuration
export interface Animation {
  type: AnimationType;
  duration: number; // milliseconds
  delay: number; // milliseconds
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
  direction: 'up' | 'down' | 'left' | 'right' | 'center';
  playOnLoad: boolean;
}

// Canvas Configuration
export interface CanvasConfig {
  width: number;
  height: number;
  background: string;
  gridEnabled: boolean;
  gridSize: number;
  gridColor: string;
  snapToGrid: boolean;
  snapToObjects: boolean;
  snapThreshold: number;
}

// Selection State
export interface SelectionState {
  selectedIds: string[];
  isMultiSelect: boolean;
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
}

// Transform State
export interface TransformState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

// History Entry
export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: number;
  elements: CanvasElement[];
  canvas: CanvasConfig;
}

// Export Options
export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'svg' | 'html';
  quality: number; // 0-100 for jpg
  scale: number; // 1x, 2x, 3x
  transparentBackground: boolean;
  selectedOnly: boolean;
  includeBackground: boolean;
}

// Asset Item
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'svg' | 'icon';
  src: string; // Base64 or URL
  thumbnail?: string;
  width: number;
  height: number;
  tags: string[];
  category: string;
  uploadedAt: number;
  fileSize: number;
}

// Layer Item (for layers panel display)
export interface LayerItem {
  id: string;
  name: string;
  type: ElementType;
  icon: string;
  visible: boolean;
  locked: boolean;
  children?: LayerItem[]; // For groups
  isExpanded?: boolean; // For group expansion state
}

// Tool Types
export type Tool = 
  | 'select' 
  | 'text' 
  | 'image' 
  | 'rectangle' 
  | 'circle' 
  | 'line' 
  | 'arrow' 
  | 'polygon' 
  | 'pen' 
  | 'eraser' 
  | 'eyedropper' 
  | 'pan' 
  | 'zoom';

// Keyboard Shortcut
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: string;
  description: string;
}

// Color Stop for Gradients
export interface ColorStop {
  offset: number; // 0-1
  color: string;
}

// Gradient Configuration
export interface GradientConfig {
  type: 'linear' | 'radial';
  stops: ColorStop[];
  angle?: number; // For linear gradients
  centerX?: number; // For radial gradients
  centerY?: number;
  radius?: number;
}

// Alignment Options
export type AlignType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

// Distribution Options
export type DistributeType = 'horizontal' | 'vertical';

// Snap Guide
export interface SnapGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  elementId: string;
}

// Project Data (for save/load)
export interface ProjectData {
  version: string;
  name: string;
  elements: CanvasElement[];
  canvas: CanvasConfig;
  assets: Asset[];
  metadata: {
    createdAt: number;
    lastModified: number;
    author?: string;
    description?: string;
  };
}

// Editor State
export interface EditorState {
  // Canvas
  canvas: CanvasConfig;
  elements: Record<string, CanvasElement>; // Normalized by ID
  elementOrder: string[]; // Z-index order
  
  // Selection
  selection: SelectionState;
  
  // Tools
  activeTool: Tool;
  
  // View
  zoom: number;
  panX: number;
  panY: number;
  
  // History
  history: HistoryEntry[];
  historyIndex: number;
  
  // UI State
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  leftPanelTab: 'tools' | 'assets' | 'layers' | 'templates';
  rightPanelTab: 'properties' | 'animations' | 'export';
  
  // Assets
  assets: Record<string, Asset>;
  
  // Clipboard
  clipboard: CanvasElement[] | null;
  
  // Auto-save
  isDirty: boolean;
  lastSaved: number | null;
}

// Store Actions Interface
export interface EditorActions {
  // Element CRUD
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  
  // Selection
  selectElement: (id: string, addToSelection?: boolean) => void;
  deselectAll: () => void;
  selectAll: () => void;
  
  // Transform
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, width: number, height: number) => void;
  rotateElement: (id: string, rotation: number) => void;
  
  // Z-index
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  
  // Grouping
  groupElements: (ids: string[]) => void;
  ungroupElement: (id: string) => void;
  
  // Alignment
  alignElements: (type: AlignType) => void;
  distributeElements: (type: DistributeType) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  pushHistory: (action: string) => void;
  
  // Clipboard
  copy: () => void;
  paste: () => void;
  cut: () => void;
  
  // Canvas
  setCanvasSize: (width: number, height: number) => void;
  setBackground: (color: string) => void;
  toggleGrid: () => void;
  
  // View
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  
  // Tools
  setActiveTool: (tool: Tool) => void;
  
  // Assets
  addAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  
  // Project
  loadProject: (project: ProjectData) => void;
  saveProject: () => ProjectData;
  newProject: () => void;
  
  // Export
  exportCanvas: (options: ExportOptions) => Promise<Blob>;
}

// Component Props Types
export interface CanvasProps {
  width: number;
  height: number;
  elements: CanvasElement[];
  selectedIds: string[];
  onSelect: (id: string, addToSelection?: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export interface PropertyPanelProps {
  selectedElements: CanvasElement[];
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}

export interface LayersPanelProps {
  elements: CanvasElement[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

// Font Configuration
export interface FontConfig {
  family: string;
  variants: FontWeight[];
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
}

// Preset Configurations
export interface PresetConfig {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  tags: string[];
  config: Partial<CanvasElement>;
}

// Template Configuration
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  canvas: CanvasConfig;
  elements: CanvasElement[];
  isPremium: boolean;
}

// Validation Errors
export interface ValidationError {
  field: string;
  message: string;
}

// Performance Metrics
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  elementCount: number;
  memoryUsage: number;
}
