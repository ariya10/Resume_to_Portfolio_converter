import type {
  CanvasElement,
  TextElement,
  RectangleElement,
  CircleElement,
  ImageElement,
  Transform,
  FillConfig,
  StrokeConfig,
} from '@/lib/canvas/types';

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create default transform
 */
export function createDefaultTransform(
  x = 0,
  y = 0,
  width = 100,
  height = 100
): Transform {
  return {
    x,
    y,
    width,
    height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };
}

/**
 * Create default fill
 */
export function createDefaultFill(color = '#000000'): FillConfig {
  return {
    type: 'solid',
    color,
  };
}

/**
 * Create default stroke
 */
export function createDefaultStroke(
  width = 2,
  color = '#000000'
): StrokeConfig {
  return {
    width,
    color,
    style: 'solid',
  };
}

/**
 * Create text element template
 */
export function createTextElement(
  text = 'Text',
  x = 0,
  y = 0
): TextElement {
  return {
    id: generateId(),
    type: 'text',
    name: 'Text Element',
    visible: true,
    locked: false,
    zIndex: 0,
    transform: createDefaultTransform(x, y, 200, 50),
    fill: createDefaultFill('#000000'),
    stroke: null,
    opacity: 1,
    animations: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content: text,
    textStyle: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 24,
      fontWeight: 400,
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      textTransform: 'none',
      textDecoration: 'none',
    },
    textColor: '#000000',
  };
}

/**
 * Create rectangle element template
 */
export function createRectangleElement(
  x = 0,
  y = 0,
  width = 100,
  height = 100
): RectangleElement {
  return {
    id: generateId(),
    type: 'rectangle',
    name: 'Rectangle',
    visible: true,
    locked: false,
    zIndex: 0,
    transform: createDefaultTransform(x, y, width, height),
    fill: createDefaultFill('#3B82F6'),
    stroke: createDefaultStroke(2, '#1F2937'),
    opacity: 1,
    borderRadius: 0,
    animations: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Create circle element template
 */
export function createCircleElement(
  x = 0,
  y = 0,
  size = 100
): CircleElement {
  return {
    id: generateId(),
    type: 'circle',
    name: 'Circle',
    visible: true,
    locked: false,
    zIndex: 0,
    transform: createDefaultTransform(x, y, size, size),
    fill: createDefaultFill('#EC4899'),
    stroke: createDefaultStroke(2, '#831843'),
    opacity: 1,
    animations: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Create image element template
 */
export function createImageElement(
  src: string,
  x = 0,
  y = 0,
  width = 200,
  height = 200
): ImageElement {
  return {
    id: generateId(),
    type: 'image',
    name: 'Image',
    visible: true,
    locked: false,
    zIndex: 0,
    transform: createDefaultTransform(x, y, width, height),
    fill: { type: 'solid', color: '#FFFFFF' },
    stroke: null,
    opacity: 1,
    animations: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    src,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
    },
  };
}

/**
 * Calculate bounding box for elements
 */
export function calculateBoundingBox(elements: CanvasElement[]) {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    const { x, y, width, height } = el.transform;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Align elements
 */
export function alignElements(
  elements: CanvasElement[],
  type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): Partial<CanvasElement>[] {
  const bbox = calculateBoundingBox(elements);
  const updates: Partial<CanvasElement>[] = [];

  elements.forEach((el) => {
    const update: Partial<CanvasElement> = {
      id: el.id,
      transform: { ...el.transform },
    };

    switch (type) {
      case 'left':
        update.transform!.x = bbox.x;
        break;
      case 'center':
        update.transform!.x = bbox.x + (bbox.width - el.transform.width) / 2;
        break;
      case 'right':
        update.transform!.x = bbox.x + bbox.width - el.transform.width;
        break;
      case 'top':
        update.transform!.y = bbox.y;
        break;
      case 'middle':
        update.transform!.y = bbox.y + (bbox.height - el.transform.height) / 2;
        break;
      case 'bottom':
        update.transform!.y = bbox.y + bbox.height - el.transform.height;
        break;
    }

    updates.push(update);
  });

  return updates;
}

/**
 * Distribute elements with equal spacing
 */
export function distributeElements(
  elements: CanvasElement[],
  direction: 'horizontal' | 'vertical',
  spacing: number
): Partial<CanvasElement>[] {
  const sorted =
    direction === 'horizontal'
      ? [...elements].sort((a, b) => a.transform.x - b.transform.x)
      : [...elements].sort((a, b) => a.transform.y - b.transform.y);

  const updates: Partial<CanvasElement>[] = [];

  sorted.forEach((el, i) => {
    const update: Partial<CanvasElement> = {
      id: el.id,
      transform: { ...el.transform },
    };

    if (i > 0) {
      const prev = sorted[i - 1];
      if (direction === 'horizontal') {
        update.transform!.x = prev.transform.x + prev.transform.width + spacing;
      } else {
        update.transform!.y = prev.transform.y + prev.transform.height + spacing;
      }
    }

    updates.push(update);
  });

  return updates;
}

/**
 * Export element to JSON
 */
export function serializeElement(element: CanvasElement): string {
  return JSON.stringify(element, null, 2);
}

/**
 * Import element from JSON
 */
export function deserializeElement(json: string): CanvasElement | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Clone element with new ID
 */
export function cloneElement(element: CanvasElement): CanvasElement {
  const clone = JSON.parse(JSON.stringify(element));
  clone.id = generateId();
  clone.createdAt = Date.now();
  clone.updatedAt = Date.now();
  return clone;
}

/**
 * Get element bounds after transformation
 */
export function getTransformedBounds(element: CanvasElement) {
  const { x, y, width, height, rotation } = element.transform;

  if (rotation === 0) {
    return { x, y, width, height };
  }

  // Calculate rotated bounds
  const cos = Math.cos((rotation * Math.PI) / 180);
  const sin = Math.sin((rotation * Math.PI) / 180);

  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  const rotated = corners.map((c) => ({
    x: c.x * cos - c.y * sin,
    y: c.x * sin + c.y * cos,
  }));

  const xs = rotated.map((p) => p.x);
  const ys = rotated.map((p) => p.y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    x: x + minX,
    y: y + minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Check if point is inside element
 */
export function isPointInElement(
  point: { x: number; y: number },
  element: CanvasElement
): boolean {
  const bounds = getTransformedBounds(element);
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

/**
 * Calculate snap guides
 */
export function calculateSnapGuides(
  element: CanvasElement,
  allElements: CanvasElement[],
  threshold = 10
) {
  const guides: Array<{ type: string; position: number }> = [];

  const others = allElements.filter((el) => el.id !== element.id);

  others.forEach((other) => {
    const snap = (a: number, b: number) => Math.abs(a - b) < threshold && a;
    const elemBounds = getTransformedBounds(element);
    const otherBounds = getTransformedBounds(other);

    // Vertical guides
    if (snap(elemBounds.x, otherBounds.x)) guides.push({ type: 'vertical', position: elemBounds.x });
    if (snap(elemBounds.x + elemBounds.width, otherBounds.x)) guides.push({ type: 'vertical', position: elemBounds.x });
    if (snap(elemBounds.x + elemBounds.width / 2, otherBounds.x + otherBounds.width / 2))
      guides.push({ type: 'vertical', position: elemBounds.x + elemBounds.width / 2 });

    // Horizontal guides
    if (snap(elemBounds.y, otherBounds.y)) guides.push({ type: 'horizontal', position: elemBounds.y });
    if (snap(elemBounds.y + elemBounds.height, otherBounds.y + otherBounds.height)) guides.push({ type: 'horizontal', position: elemBounds.y });
    if (snap(elemBounds.y + elemBounds.height / 2, otherBounds.y + otherBounds.height / 2))
      guides.push({ type: 'horizontal', position: elemBounds.y + elemBounds.height / 2 });
  });

  return guides;
}

/**
 * Format color to hex string
 */
export function formatColor(color: string): string {
  if (color.startsWith('#')) return color;
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (!matches || matches.length < 3) return '#000000';
    const r = parseInt(matches[0]).toString(16).padStart(2, '0');
    const g = parseInt(matches[1]).toString(16).padStart(2, '0');
    const b = parseInt(matches[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }
  return '#000000';
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Check if element is locked or in group
 */
export function isElementSelectable(element: CanvasElement, lockedElements: string[] = []): boolean {
  return !element.locked && !lockedElements.includes(element.id) && element.visible;
}

/**
 * Batch update elements
 */
export function batchUpdateElements(
  elements: CanvasElement[],
  updates: Record<string, Partial<CanvasElement>>
): CanvasElement[] {
  return elements.map((el) => {
    const update = updates[el.id];
    return update ? { ...el, ...update } : el;
  });
}
