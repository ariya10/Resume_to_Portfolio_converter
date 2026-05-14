/**
 * Canvas Editor Zustand Store
 * Manages all state for the Konva-based visual editor
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type {
  EditorState,
  CanvasElement,
  CanvasConfig,
  Selection,
  HistoryState,
  DrawingMode,
  TextElementProps,
  ShapeElementProps,
  ImageElementProps,
  ElementType,
  ShapeType,
} from '@/types/canvas';
import { ElementType as ElementTypeEnum, ShapeType as ShapeTypeEnum } from '@/types/canvas';

// ============================================================================
// Store Interface
// ============================================================================

interface CanvasStore extends EditorState {
  // Selection actions
  select: (ids: string[]) => void;
  deselect: () => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  selectByBounds: (bounds: { x: number; y: number; width: number; height: number }) => void;

  // Element actions
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (ids: string[]) => void;
  duplicateElement: (ids: string[]) => void;
  groupElements: (ids: string[]) => void;
  ungroupElements: (id: string) => void;

  // Transform actions
  moveElements: (ids: string[], deltaX: number, deltaY: number) => void;
  resizeElement: (id: string, width: number, height: number) => void;
  rotateElement: (id: string, rotation: number) => void;
  scaleElement: (id: string, scaleX: number, scaleY: number) => void;

  // Alignment & Distribution
  alignElements: (ids: string[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeElements: (ids: string[], direction: 'horizontal' | 'vertical') => void;
  bringToFront: (ids: string[]) => void;
  sendToBack: (ids: string[]) => void;
  bringForward: (ids: string[]) => void;
  sendBackward: (ids: string[]) => void;

  // Canvas config
  setCanvasConfig: (config: Partial<CanvasConfig>) => void;
  setZoom: (zoom: number) => void;
  setPan: (offsetX: number, offsetY: number) => void;
  resetZoomAndPan: () => void;
  fitToScreen: () => void;

  // Drawing mode
  setDrawingMode: (mode: DrawingMode) => void;
  cancelDrawing: () => void;

  // Clipboard & History
  copy: () => void;
  cut: () => void;
  paste: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  saveSnapshot: (description: string) => void;

  // Lock/Hide
  lockElements: (ids: string[]) => void;
  unlockElements: (ids: string[]) => void;
  hideElements: (ids: string[]) => void;
  showElements: (ids: string[]) => void;

  // Batch operations
  batchUpdateElements: (updates: Array<{ id: string; data: Partial<CanvasElement> }>) => void;

  // Reset
  reset: () => void;
}

// ============================================================================
// Default State
// ============================================================================

const defaultCanvasConfig: CanvasConfig = {
  width: 1200,
  height: 800,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  showGrid: true,
  gridSize: 20,
  snapToGrid: true,
  showRulers: true,
  showGuides: true,
};

const defaultState: EditorState = {
  elements: [],
  selection: {
    ids: [],
    bounds: null,
    multiple: false,
    rotating: false,
  },
  config: defaultCanvasConfig,
  history: [],
  historyIndex: -1,
  drawingMode: {
    active: false,
  },
  clipboard: null,
  showLayersPanel: true,
  showPropertiesPanel: true,
  panMode: false,
};

// ============================================================================
// Utility Functions
// ============================================================================

/** Generate a unique ID for elements */
const generateId = (): string => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/** Calculate bounding box for multiple elements */
const calculateBounds = (elements: CanvasElement[]) => {
  if (elements.length === 0) return null;

  const xs = elements.map((el) => el.x);
  const ys = elements.map((el) => el.y);
  const xs2 = elements.map((el) => el.x + el.width);
  const ys2 = elements.map((el) => el.y + el.height);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs2) - Math.min(...xs),
    height: Math.max(...ys2) - Math.min(...ys),
  };
};

/** Find element by ID */
const findElementById = (elements: CanvasElement[], id: string): CanvasElement | undefined => {
  return elements.find((el) => el.id === id);
};

/** Find elements by IDs */
const findElementsByIds = (elements: CanvasElement[], ids: string[]): CanvasElement[] => {
  return elements.filter((el) => ids.includes(el.id));
};

// ============================================================================
// Zustand Store
// ============================================================================

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...defaultState,

      // Selection
      select: (ids: string[]) =>
        set((state) => {
          const selected = findElementsByIds(state.elements, ids);
          return {
            selection: {
              ids,
              bounds: calculateBounds(selected),
              multiple: ids.length > 1,
              rotating: false,
            },
          };
        }),

      deselect: () =>
        set({
          selection: {
            ids: [],
            bounds: null,
            multiple: false,
            rotating: false,
          },
        }),

      toggleSelect: (id: string) =>
        set((state) => {
          const ids = state.selection.ids.includes(id)
            ? state.selection.ids.filter((sid) => sid !== id)
            : [...state.selection.ids, id];
          const selected = findElementsByIds(state.elements, ids);
          return {
            selection: {
              ids,
              bounds: calculateBounds(selected),
              multiple: ids.length > 1,
              rotating: false,
            },
          };
        }),

      selectAll: () =>
        set((state) => {
          const ids = state.elements.map((el) => el.id);
          return {
            selection: {
              ids,
              bounds: calculateBounds(state.elements),
              multiple: ids.length > 1,
              rotating: false,
            },
          };
        }),

      selectByBounds: (bounds: { x: number; y: number; width: number; height: number }) =>
        set((state) => {
          const ids = state.elements
            .filter((el) => {
              const elRight = el.x + el.width;
              const elBottom = el.y + el.height;
              const boundsRight = bounds.x + bounds.width;
              const boundsBottom = bounds.y + bounds.height;

              return !(elRight < bounds.x || el.x > boundsRight || elBottom < bounds.y || el.y > boundsBottom);
            })
            .map((el) => el.id);

          const selected = findElementsByIds(state.elements, ids);
          return {
            selection: {
              ids,
              bounds: calculateBounds(selected),
              multiple: ids.length > 1,
              rotating: false,
            },
          };
        }),

      // Elements
      addElement: (element: CanvasElement) =>
        set((state) => {
          const newElement = {
            ...element,
            id: element.id || generateId(),
            zIndex: Math.max(0, ...state.elements.map((el) => el.zIndex), -1) + 1,
          };
          get().saveSnapshot(`Added ${newElement.type}`);
          return { elements: [...state.elements, newElement] };
        }),

      updateElement: (id: string, updates: Partial<CanvasElement>) =>
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          );
          return { elements: newElements };
        }),

      deleteElement: (ids: string[]) =>
        set((state) => {
          get().saveSnapshot(`Deleted ${ids.length} element(s)`);
          return {
            elements: state.elements.filter((el) => !ids.includes(el.id)),
            selection: {
              ids: [],
              bounds: null,
              multiple: false,
              rotating: false,
            },
          };
        }),

      duplicateElement: (ids: string[]) =>
        set((state) => {
          const toDuplicate = findElementsByIds(state.elements, ids);
          const duplicated = toDuplicate.map((el) => ({
            ...el,
            id: generateId(),
            x: el.x + 20,
            y: el.y + 20,
          }));
          get().saveSnapshot(`Duplicated ${ids.length} element(s)`);
          return {
            elements: [...state.elements, ...duplicated],
            selection: {
              ids: duplicated.map((el) => el.id),
              bounds: calculateBounds(duplicated),
              multiple: duplicated.length > 1,
              rotating: false,
            },
          };
        }),

      groupElements: (ids: string[]) =>
        set((state) => {
          const toGroup = findElementsByIds(state.elements, ids);
          if (toGroup.length < 2) return state;

          const bounds = calculateBounds(toGroup);
          if (!bounds) return state;

          const group: CanvasElement = {
            id: generateId(),
            name: 'Group',
            type: ElementTypeEnum.GROUP,
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: Math.max(...toGroup.map((el) => el.zIndex)),
            children: toGroup,
          };

          get().saveSnapshot('Grouped elements');
          return {
            elements: [
              ...state.elements.filter((el) => !ids.includes(el.id)),
              group,
            ],
            selection: {
              ids: [group.id],
              bounds,
              multiple: false,
              rotating: false,
            },
          };
        }),

      ungroupElements: (id: string) =>
        set((state) => {
          const element = findElementById(state.elements, id);
          if (element?.type !== ElementTypeEnum.GROUP) return state;

          const groupEl = element as any;
          const children = groupEl.children || [];

          get().saveSnapshot('Ungrouped elements');
          return {
            elements: [
              ...state.elements.filter((el) => el.id !== id),
              ...children,
            ],
            selection: {
              ids: children.map((el: any) => el.id),
              bounds: calculateBounds(children),
              multiple: children.length > 1,
              rotating: false,
            },
          };
        }),

      // Transform
      moveElements: (ids: string[], deltaX: number, deltaY: number) =>
        set((state) => {
          const newElements = state.elements.map((el) =>
            ids.includes(el.id)
              ? { ...el, x: el.x + deltaX, y: el.y + deltaY }
              : el
          );
          return { elements: newElements };
        }),

      resizeElement: (id: string, width: number, height: number) =>
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, width: Math.max(10, width), height: Math.max(10, height) } : el
          );
          return { elements: newElements };
        }),

      rotateElement: (id: string, rotation: number) =>
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, rotation: (rotation % 360 + 360) % 360 } : el
          );
          return { elements: newElements };
        }),

      scaleElement: (id: string, scaleX: number, scaleY: number) =>
        set((state) => {
          const element = findElementById(state.elements, id);
          if (!element) return state;

          const newElements = state.elements.map((el) =>
            el.id === id
              ? {
                  ...el,
                  width: Math.max(10, el.width * scaleX),
                  height: Math.max(10, el.height * scaleY),
                }
              : el
          );
          return { elements: newElements };
        }),

      // Alignment
      alignElements: (ids: string[], alignment: string) =>
        set((state) => {
          const toAlign = findElementsByIds(state.elements, ids);
          if (toAlign.length < 2) return state;

          const bounds = calculateBounds(toAlign);
          if (!bounds) return state;

          const newElements = state.elements.map((el) => {
            if (!ids.includes(el.id)) return el;

            switch (alignment) {
              case 'left':
                return { ...el, x: bounds.x };
              case 'center':
                return { ...el, x: bounds.x + bounds.width / 2 - el.width / 2 };
              case 'right':
                return { ...el, x: bounds.x + bounds.width - el.width };
              case 'top':
                return { ...el, y: bounds.y };
              case 'middle':
                return { ...el, y: bounds.y + bounds.height / 2 - el.height / 2 };
              case 'bottom':
                return { ...el, y: bounds.y + bounds.height - el.height };
              default:
                return el;
            }
          });

          get().saveSnapshot(`Aligned elements: ${alignment}`);
          return { elements: newElements };
        }),

      distributeElements: (ids: string[], direction: string) =>
        set((state) => {
          const toDistribute = findElementsByIds(state.elements, ids);
          if (toDistribute.length < 3) return state;

          const bounds = calculateBounds(toDistribute);
          if (!bounds) return state;

          const sorted = direction === 'horizontal'
            ? toDistribute.sort((a, b) => a.x - b.x)
            : toDistribute.sort((a, b) => a.y - b.y);

          const spacing = direction === 'horizontal'
            ? (bounds.width - sorted.reduce((sum, el) => sum + el.width, 0)) / (sorted.length - 1)
            : (bounds.height - sorted.reduce((sum, el) => sum + el.height, 0)) / (sorted.length - 1);

          let offset = bounds.x;
          const newElements = state.elements.map((el) => {
            const index = sorted.findIndex((sel) => sel.id === el.id);
            if (index === -1) return el;

            if (direction === 'horizontal') {
              const newEl = { ...el, x: offset };
              offset += el.width + spacing;
              return newEl;
            } else {
              const newEl = { ...el, y: offset };
              offset += el.height + spacing;
              return newEl;
            }
          });

          get().saveSnapshot(`Distributed elements: ${direction}`);
          return { elements: newElements };
        }),

      bringToFront: (ids: string[]) =>
        set((state) => {
          const maxZ = Math.max(...state.elements.map((el) => el.zIndex), 0);
          const newElements = state.elements.map((el) => ({
            ...el,
            zIndex: ids.includes(el.id) ? maxZ + 1 : el.zIndex,
          }));
          get().saveSnapshot('Brought to front');
          return { elements: newElements };
        }),

      sendToBack: (ids: string[]) =>
        set((state) => {
          const minZ = Math.min(...state.elements.map((el) => el.zIndex), 0);
          const newElements = state.elements.map((el) => ({
            ...el,
            zIndex: ids.includes(el.id) ? minZ - 1 : el.zIndex,
          }));
          get().saveSnapshot('Sent to back');
          return { elements: newElements };
        }),

      bringForward: (ids: string[]) =>
        set((state) => {
          const selected = findElementsByIds(state.elements, ids);
          const maxZ = Math.max(...selected.map((el) => el.zIndex), -1);
          const newElements = state.elements.map((el) => ({
            ...el,
            zIndex: ids.includes(el.id) ? maxZ + 1 : el.zIndex,
          }));
          get().saveSnapshot('Brought forward');
          return { elements: newElements };
        }),

      sendBackward: (ids: string[]) =>
        set((state) => {
          const selected = findElementsByIds(state.elements, ids);
          const minZ = Math.min(...selected.map((el) => el.zIndex), 0);
          const newElements = state.elements.map((el) => ({
            ...el,
            zIndex: ids.includes(el.id) ? minZ - 1 : el.zIndex,
          }));
          get().saveSnapshot('Sent backward');
          return { elements: newElements };
        }),

      // Canvas Config
      setCanvasConfig: (config: Partial<CanvasConfig>) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),

      setZoom: (zoom: number) =>
        set((state) => ({
          config: { ...state.config, zoom: Math.max(0.1, Math.min(5, zoom)) },
        })),

      setPan: (offsetX: number, offsetY: number) =>
        set((state) => ({
          config: { ...state.config, offsetX, offsetY },
        })),

      resetZoomAndPan: () =>
        set((state) => ({
          config: { ...state.config, zoom: 1, offsetX: 0, offsetY: 0 },
        })),

      fitToScreen: () =>
        set((state) => {
          const bounds = calculateBounds(state.elements);
          if (!bounds) return state;

          const padding = 20;
          const scaleX = (state.config.width - padding * 2) / bounds.width;
          const scaleY = (state.config.height - padding * 2) / bounds.height;
          const zoom = Math.min(scaleX, scaleY, 1);

          return {
            config: {
              ...state.config,
              zoom,
              offsetX: (state.config.width - bounds.width * zoom) / 2 - bounds.x * zoom,
              offsetY: (state.config.height - bounds.height * zoom) / 2 - bounds.y * zoom,
            },
          };
        }),

      // Drawing Mode
      setDrawingMode: (mode: DrawingMode) =>
        set({ drawingMode: mode }),

      cancelDrawing: () =>
        set({
          drawingMode: {
            active: false,
          },
        }),

      // Clipboard & History
      copy: () =>
        set((state) => ({
          clipboard: findElementsByIds(state.elements, state.selection.ids),
        })),

      cut: () =>
        set((state) => {
          const toCut = findElementsByIds(state.elements, state.selection.ids);
          get().saveSnapshot('Cut elements');
          return {
            clipboard: toCut,
            elements: state.elements.filter((el) => !state.selection.ids.includes(el.id)),
            selection: {
              ids: [],
              bounds: null,
              multiple: false,
              rotating: false,
            },
          };
        }),

      paste: () =>
        set((state) => {
          if (!state.clipboard) return state;

          const pasted = state.clipboard.map((el) => ({
            ...el,
            id: generateId(),
            x: el.x + 20,
            y: el.y + 20,
          }));

          get().saveSnapshot('Pasted elements');
          return {
            elements: [...state.elements, ...pasted],
            selection: {
              ids: pasted.map((el) => el.id),
              bounds: calculateBounds(pasted),
              multiple: pasted.length > 1,
              rotating: false,
            },
          };
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state;

          const newIndex = state.historyIndex - 1;
          const historyState = state.history[newIndex];

          return {
            elements: historyState.elements,
            selection: {
              ids: historyState.selectedIds,
              bounds: calculateBounds(findElementsByIds(historyState.elements, historyState.selectedIds)),
              multiple: historyState.selectedIds.length > 1,
              rotating: false,
            },
            historyIndex: newIndex,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;

          const newIndex = state.historyIndex + 1;
          const historyState = state.history[newIndex];

          return {
            elements: historyState.elements,
            selection: {
              ids: historyState.selectedIds,
              bounds: calculateBounds(findElementsByIds(historyState.elements, historyState.selectedIds)),
              multiple: historyState.selectedIds.length > 1,
              rotating: false,
            },
            historyIndex: newIndex,
          };
        }),

      clearHistory: () =>
        set({
          history: [],
          historyIndex: -1,
        }),

      saveSnapshot: (description: string) =>
        set((state) => {
          // Trim future history if we're not at the end
          const newHistory = state.history.slice(0, state.historyIndex + 1);

          const snapshot: HistoryState = {
            elements: state.elements,
            selectedIds: state.selection.ids,
            timestamp: Date.now(),
            description,
          };

          newHistory.push(snapshot);

          // Limit history to 100 states
          if (newHistory.length > 100) {
            newHistory.shift();
            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            };
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),

      // Lock/Hide
      lockElements: (ids: string[]) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            ids.includes(el.id) ? { ...el, locked: true } : el
          ),
        })),

      unlockElements: (ids: string[]) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            ids.includes(el.id) ? { ...el, locked: false } : el
          ),
        })),

      hideElements: (ids: string[]) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            ids.includes(el.id) ? { ...el, visible: false } : el
          ),
        })),

      showElements: (ids: string[]) =>
        set((state) => ({
          elements: state.elements.map((el) =>
            ids.includes(el.id) ? { ...el, visible: true } : el
          ),
        })),

      // Batch
      batchUpdateElements: (updates: Array<{ id: string; data: Partial<CanvasElement> }>) =>
        set((state) => {
          const updateMap = new Map(updates.map((u) => [u.id, u.data]));
          return {
            elements: state.elements.map((el) =>
              updateMap.has(el.id) ? { ...el, ...updateMap.get(el.id) } : el
            ),
          };
        }),

      // Reset
      reset: () => set(defaultState),
    }))
  )
);

export default useCanvasStore;
