import type { CanvasElement } from '@/types/canvas';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SnapGuides {
  x: number[];
  y: number[];
}

/**
 * Given a dragged element rect and an array of other elements,
 * returns snap positions for both axes within the given threshold.
 */
export function calculateSnapGuides(
  dragged: Rect,
  others: CanvasElement[],
  threshold: number
): SnapGuides {
  const guides: SnapGuides = { x: [], y: [] };

  const dragEdges = {
    left:   dragged.x,
    centerX: dragged.x + dragged.width / 2,
    right:  dragged.x + dragged.width,
    top:    dragged.y,
    centerY: dragged.y + dragged.height / 2,
    bottom: dragged.y + dragged.height,
  };

  for (const other of others) {
    const otherEdges = {
      left:   other.x,
      centerX: other.x + other.width / 2,
      right:  other.x + other.width,
      top:    other.y,
      centerY: other.y + other.height / 2,
      bottom: other.y + other.height,
    };

    // Check X-axis snaps
    for (const [dk, dv] of Object.entries(dragEdges)) {
      if (!dk.includes('X') && !dk.includes('left') && !dk.includes('right')) continue;
      for (const [ok, ov] of Object.entries(otherEdges)) {
        if (!ok.includes('X') && !ok.includes('left') && !ok.includes('right')) continue;
        if (Math.abs(dv - ov) <= threshold) {
          guides.x.push(ov);
        }
      }
    }

    // Check Y-axis snaps
    for (const [dk, dv] of Object.entries(dragEdges)) {
      if (!dk.includes('Y') && !dk.includes('top') && !dk.includes('bottom')) continue;
      for (const [ok, ov] of Object.entries(otherEdges)) {
        if (!ok.includes('Y') && !ok.includes('top') && !ok.includes('bottom')) continue;
        if (Math.abs(dv - ov) <= threshold) {
          guides.y.push(ov);
        }
      }
    }
  }

  // Deduplicate
  guides.x = [...new Set(guides.x)];
  guides.y = [...new Set(guides.y)];

  return guides;
}

/**
 * Snap a value to the nearest grid increment.
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a point (x, y) to the grid.
 */
export function snapPointToGrid(
  x: number,
  y: number,
  gridSize: number
): { x: number; y: number } {
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
}
