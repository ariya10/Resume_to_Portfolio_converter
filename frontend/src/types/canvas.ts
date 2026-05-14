/**
 * Canvas Editor Type Definitions
 * Defines all types for the Konva-based visual editor system
 */

// ============================================================================
// Element Types
// ============================================================================

export enum ElementType {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  GROUP = 'group',
  BACKGROUND = 'background',
}

export enum ShapeType {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
  LINE = 'line',
  ARROW = 'arrow',
  POLYGON = 'polygon',
}

// ============================================================================
// Element Properties
// ============================================================================

export interface BaseElementProps {
  id: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  groupId?: string; // For nested groups
  metadata?: Record<string, any>;
}

export interface TextElementProps extends BaseElementProps {
  type: ElementType.TEXT;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '500' | '600' | '700';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  fill: string;
  textDecoration: 'none' | 'underline' | 'line-through';
}

export interface ImageElementProps extends BaseElementProps {
  type: ElementType.IMAGE;
  src: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
  };
}

export interface ShapeElementProps extends BaseElementProps {
  type: ElementType.SHAPE;
  shapeType: ShapeType;
  fill: string;
  stroke?: {
    color: string;
    width: number;
  };
  borderRadius?: number;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
    opacity: number;
  };
}

export interface GroupElementProps extends BaseElementProps {
  type: ElementType.GROUP;
  children: CanvasElement[];
}

export interface BackgroundElementProps extends BaseElementProps {
  type: ElementType.BACKGROUND;
  fill: string;
  image?: string;
}

export type CanvasElement = 
  | TextElementProps 
  | ImageElementProps 
  | ShapeElementProps 
  | GroupElementProps 
  | BackgroundElementProps;

// ============================================================================
// Style Properties
// ============================================================================

export interface ShadowStyle {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  color: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  color: string;
  category?: 'brand' | 'accent' | 'neutral' | 'custom';
}

// ============================================================================
// Canvas State
// ============================================================================

export interface HistoryState {
  elements: CanvasElement[];
  selectedIds: string[];
  timestamp: number;
  description: string;
}

export interface CanvasConfig {
  width: number;
  height: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  guide?: {
    vertical?: number[];
    horizontal?: number[];
  };
}

export interface Selection {
  ids: string[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  multiple: boolean;
  rotating: boolean;
}

export interface DrawingMode {
  active: boolean;
  type?: ElementType;
  shapeType?: ShapeType;
  startX?: number;
  startY?: number;
}

export interface EditorState {
  // Elements
  elements: CanvasElement[];
  selection: Selection;
  
  // Canvas
  config: CanvasConfig;
  
  // History
  history: HistoryState[];
  historyIndex: number;
  
  // UI State
  drawingMode: DrawingMode;
  clipboard: CanvasElement[] | null;
  showLayersPanel: boolean;
  showPropertiesPanel: boolean;
  panMode: boolean;
  
  // Animation
  selectedAnimation?: {
    elementId: string;
    type: 'entrance' | 'exit' | 'hover';
    animation: string;
    duration: number;
    delay: number;
  };
}

// ============================================================================
// Editor Actions
// ============================================================================

export interface EditorAction {
  type: string;
  description: string;
  timestamp: number;
}

export interface TextEditorState {
  elementId: string;
  isActive: boolean;
  position: { x: number; y: number };
}

// ============================================================================
// Export Types
// ============================================================================

export enum ExportFormat {
  PNG = 'png',
  JPG = 'jpg',
  SVG = 'svg',
  PDF = 'pdf',
  WEBP = 'webp',
}

export interface ExportOptions {
  format: ExportFormat;
  quality?: number; // 0-100
  width?: number;
  height?: number;
  scale?: number;
  includeBackground?: boolean;
  transparency?: boolean;
}

export interface ExportedProject {
  version: string;
  name: string;
  description?: string;
  thumbnail?: string;
  canvas: CanvasConfig;
  elements: CanvasElement[];
  colorPresets?: ColorPreset[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
}

// ============================================================================
// Animation Types
// ============================================================================

export enum AnimationType {
  FADE_IN = 'fadeIn',
  SLIDE_IN = 'slideIn',
  ZOOM_IN = 'zoomIn',
  BOUNCE_IN = 'bounceIn',
  ROTATE_IN = 'rotateIn',
  FADE_OUT = 'fadeOut',
  SLIDE_OUT = 'slideOut',
  ZOOM_OUT = 'zoomOut',
}

export interface Animation {
  id: string;
  elementId: string;
  type: AnimationType;
  trigger: 'entrance' | 'exit' | 'hover' | 'click';
  duration: number; // ms
  delay: number; // ms
  easing: string;
  repeat?: number;
  loop?: boolean;
}

// ============================================================================
// Asset Types
// ============================================================================

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'texture' | 'background';
  url: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  size?: number;
}

export interface AssetLibrary {
  id: string;
  name: string;
  assets: Asset[];
  category: string;
}

// ============================================================================
// Keyboard Shortcut Types
// ============================================================================

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}

// ============================================================================
// Performance & Optimization Types
// ============================================================================

export interface RenderStats {
  fps: number;
  elementCount: number;
  renderTime: number;
  lastUpdate: number;
}
