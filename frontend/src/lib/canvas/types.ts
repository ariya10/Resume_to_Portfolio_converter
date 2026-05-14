// ============================================================================
// Canvas Editor Type Definitions
// ============================================================================

/**
 * Animation configuration for canvas elements
 */
export interface Animation {
  id: string;
  type: 'entrance' | 'exit' | 'hover';
  name: string; // 'fadeIn', 'slideUp', 'scaleIn', etc.
  duration: number; // milliseconds
  delay: number; // milliseconds
  easing: string; // 'ease', 'easeIn', 'easeOut', etc.
  repeat?: number; // -1 for infinite
}

/**
 * Shadow effect configuration
 */
export interface ShadowEffect {
  blur: number;
  offsetX: number;
  offsetY: number;
  color: string;
  opacity: number;
}

/**
 * Stroke configuration
 */
export interface StrokeConfig {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  dashArray?: number[];
}

/**
 * Text styling for text elements
 */
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number; // 100-900
  fontStyle: 'normal' | 'italic';
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'overline' | 'line-through';
}

/**
 * Fill configuration (solid color or gradient)
 */
export interface FillConfig {
  type: 'solid' | 'linear-gradient' | 'radial-gradient';
  color?: string;
  gradient?: {
    angle: number; // 0-360
    stops: Array<{ offset: number; color: string }>;
  };
}

/**
 * Gradient fill helper
 */
export interface GradientFill {
  type: 'linear' | 'radial';
  angle?: number;
  colors: string[];
}

/**
 * Base position and size
 */
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // 0-360
  scaleX: number;
  scaleY: number;
}

/**
 * Canvas element union type
 */
export type ElementType = 
  | 'text' 
  | 'rectangle' 
  | 'circle' 
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'image' 
  | 'group';

/**
 * Base properties for all canvas elements
 */
export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  transform: Transform;
  
  // Styling
  fill: FillConfig;
  stroke: StrokeConfig | null;
  opacity: number; // 0-1
  blendMode?: string;
  borderRadius?: number; // for rectangles
  shadow?: ShadowEffect | null;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  
  // Animations
  animations: Animation[];
}

/**
 * Text element
 */
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  textStyle: TextStyle;
  textColor: string;
  textShadow?: ShadowEffect | null;
  maxWidth?: number;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

/**
 * Rectangle element
 */
export interface RectangleElement extends BaseElement {
  type: 'rectangle';
  borderRadius: number;
}

/**
 * Circle element
 */
export interface CircleElement extends BaseElement {
  type: 'circle';
}

/**
 * Triangle element
 */
export interface TriangleElement extends BaseElement {
  type: 'triangle';
  points?: number[][]; // for custom polygon
}

/**
 * Line element
 */
export interface LineElement extends BaseElement {
  type: 'line';
  points: Array<[number, number]>;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'bevel' | 'round' | 'miter';
}

/**
 * Arrow element (line with arrowhead)
 */
export interface ArrowElement extends BaseElement {
  type: 'arrow';
  points: Array<[number, number]>;
  arrowSize: number;
  arrowDirection: 'end' | 'start' | 'both';
}

/**
 * Image element
 */
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // data URL or image URL
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
  };
}

/**
 * Group element (container for multiple elements)
 */
export interface GroupElement extends BaseElement {
  type: 'group';
  childIds: string[];
}

/**
 * Union of all element types
 */
export type CanvasElement = 
  | TextElement 
  | RectangleElement 
  | CircleElement 
  | TriangleElement 
  | LineElement 
  | ArrowElement 
  | ImageElement 
  | GroupElement;

/**
 * Canvas action types for history
 */
export type CanvasAction = 
  | 'CREATE_ELEMENT'
  | 'DELETE_ELEMENT'
  | 'UPDATE_ELEMENT'
  | 'SELECT_ELEMENT'
  | 'MOVE_ELEMENT'
  | 'RESIZE_ELEMENT'
  | 'ROTATE_ELEMENT'
  | 'DUPLICATE_ELEMENT'
  | 'GROUP_ELEMENTS'
  | 'UNGROUP_ELEMENTS'
  | 'REORDER_LAYERS'
  | 'ADD_ANIMATION'
  | 'UPDATE_STYLE';

/**
 * Canvas state snapshot for undo/redo
 */
export interface CanvasSnapshot {
  elements: CanvasElement[];
  selectedIds: string[];
  timestamp: number;
  action: CanvasAction;
}

/**
 * Canvas viewport state
 */
export interface ViewportState {
  zoom: number; // 0.1 to 10
  panX: number;
  panY: number;
  gridSize: number;
}

/**
 * Editor settings
 */
export interface EditorSettings {
  showGrid: boolean;
  snapToGrid: boolean;
  snapToElements: boolean;
  showRulers: boolean;
  autoGroup: boolean;
  duplicateDistance: number;
}

/**
 * Full canvas editor state
 */
export interface CanvasEditorState {
  // Elements
  elements: CanvasElement[];
  selectedIds: string[];
  hoveredId: string | null;
  
  // Viewport
  viewport: ViewportState;
  
  // Editor state
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
  dragStart: { x: number; y: number } | null;
  settings: EditorSettings;
  
  // History
  history: CanvasSnapshot[];
  historyIndex: number;
  
  // Clipboard
  clipboard: CanvasElement | null;
  
  // UI
  showLayersPanel: boolean;
  showPropertiesPanel: boolean;
  showAssetsPanel: boolean;
  showAnimationPanel: boolean;
  activeTab: 'layers' | 'properties' | 'assets' | 'animations';
  
  // Temp
  previewMode: boolean;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'png' | 'pdf' | 'json' | 'html';
  quality: number; // 0-1
  scale: number; // 1-4 (for png/pdf)
  transparent?: boolean;
  filename?: string;
}

/**
 * Asset item (image, icon, etc)
 */
export interface AssetItem {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  type: 'image' | 'icon' | 'svg' | 'sticker';
  category: string;
  tags: string[];
}

/**
 * Asset collection
 */
export interface AssetCollection {
  id: string;
  name: string;
  items: AssetItem[];
  category: string;
}

/**
 * Editor selection state
 */
export interface SelectionState {
  ids: string[];
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  pivot?: { x: number; y: number }; // Center point for rotation
}

/**
 * Snap guide line
 */
export interface SnapGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  elements: string[]; // IDs of elements it aligns with
}
