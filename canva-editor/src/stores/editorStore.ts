import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  CanvasElement,
  CanvasConfig,
  EditorState,
  EditorActions,
  Tool,
  Asset,
  ProjectData,
  ExportOptions,
  AlignType,
  DistributeType,
  HistoryEntry,
} from '../types/canvas';

const MAX_HISTORY = 50;
const AUTOSAVE_KEY = 'canva-editor-autosave';

// Default canvas configuration
const defaultCanvas: CanvasConfig = {
  width: 1920,
  height: 1080,
  background: '#ffffff',
  gridEnabled: true,
  gridSize: 20,
  gridColor: '#e5e7eb',
  snapToGrid: false,
  snapToObjects: true,
  snapThreshold: 5,
};

// Initial editor state
const initialState: EditorState = {
  canvas: defaultCanvas,
  elements: {},
  elementOrder: [],
  selection: {
    selectedIds: [],
    isMultiSelect: false,
    isDragging: false,
    isResizing: false,
    isRotating: false,
  },
  activeTool: 'select',
  zoom: 1,
  panX: 0,
  panY: 0,
  history: [],
  historyIndex: -1,
  leftPanelOpen: true,
  rightPanelOpen: true,
  leftPanelTab: 'tools',
  rightPanelTab: 'properties',
  assets: {},
  clipboard: null,
  isDirty: false,
  lastSaved: null,
  rehydrated: false,
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create the editor store
export const useEditorStore = create<EditorState & EditorActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Element CRUD operations
        addElement: (element: CanvasElement) => {
          const id = element.id || generateId();
          const elementWithId = { ...element, id, timestamp: Date.now() };
          
          set((state) => ({
            elements: {
              ...state.elements,
              [id]: elementWithId,
            },
            elementOrder: [...state.elementOrder, id],
            isDirty: true,
          }));
          
          get().pushHistory('Add element');
        },

        updateElement: (id: string, updates: Partial<CanvasElement>) => {
          const element = get().elements[id];
          if (!element) return;
          set({
            elements: {
              ...get().elements,
              [id]: { ...element, ...updates, timestamp: Date.now() } as CanvasElement,
            },
            isDirty: true,
          });
        },

        deleteElement: (id: string) => {
          set((state) => {
            const { [id]: removed, ...remainingElements } = state.elements;
            return {
              elements: remainingElements,
              elementOrder: state.elementOrder.filter((elId) => elId !== id),
              selection: {
                ...state.selection,
                selectedIds: state.selection.selectedIds.filter((selId) => selId !== id),
              },
              isDirty: true,
            };
          });
          
          get().pushHistory('Delete element');
        },

        duplicateElement: (id: string) => {
          const element = get().elements[id];
          if (!element) return;

          const newElement: CanvasElement = {
            ...element,
            id: generateId(),
            x: element.x + 20,
            y: element.y + 20,
            name: `${element.name} Copy`,
            timestamp: Date.now(),
          };

          get().addElement(newElement);
          get().selectElement(newElement.id);
        },

        // Selection operations
        selectElement: (id: string, addToSelection = false) => {
          set((state) => {
            const newSelectedIds = addToSelection
              ? [...state.selection.selectedIds, id]
              : [id];

            return {
              selection: {
                ...state.selection,
                selectedIds: newSelectedIds,
                isMultiSelect: newSelectedIds.length > 1,
              },
            };
          });
        },

        deselectAll: () => {
          set((state) => ({
            selection: {
              ...state.selection,
              selectedIds: [],
              isMultiSelect: false,
            },
          }));
        },

        selectAll: () => {
          set((state) => ({
            selection: {
              ...state.selection,
              selectedIds: state.elementOrder,
              isMultiSelect: state.elementOrder.length > 1,
            },
          }));
        },

        // Transform operations
        moveElement: (id: string, x: number, y: number) => {
          get().updateElement(id, { x, y });
        },

        resizeElement: (id: string, width: number, height: number) => {
          get().updateElement(id, { width, height });
        },

        rotateElement: (id: string, rotation: number) => {
          get().updateElement(id, { rotation });
        },

        // Z-index operations
        bringToFront: (id: string) => {
          set((state) => {
            const order = state.elementOrder.filter((elId) => elId !== id);
            return {
              elementOrder: [...order, id],
              isDirty: true,
            };
          });
          get().pushHistory('Bring to front');
        },

        sendToBack: (id: string) => {
          set((state) => {
            const order = state.elementOrder.filter((elId) => elId !== id);
            return {
              elementOrder: [id, ...order],
              isDirty: true,
            };
          });
          get().pushHistory('Send to back');
        },

        bringForward: (id: string) => {
          set((state) => {
            const currentIndex = state.elementOrder.indexOf(id);
            if (currentIndex === -1 || currentIndex === state.elementOrder.length - 1) {
              return state;
            }

            const newOrder = [...state.elementOrder];
            [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
              newOrder[currentIndex + 1],
              newOrder[currentIndex],
            ];

            return {
              elementOrder: newOrder,
              isDirty: true,
            };
          });
        },

        sendBackward: (id: string) => {
          set((state) => {
            const currentIndex = state.elementOrder.indexOf(id);
            if (currentIndex <= 0) return state;

            const newOrder = [...state.elementOrder];
            [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
              newOrder[currentIndex - 1],
              newOrder[currentIndex],
            ];

            return {
              elementOrder: newOrder,
              isDirty: true,
            };
          });
        },

        // Grouping operations
        groupElements: (ids: string[]) => {
          if (ids.length < 2) return;

          const elements = get().elements;
          const groupElements = ids.map((id) => elements[id]).filter(Boolean);

          // Calculate group bounds
          const minX = Math.min(...groupElements.map((el) => el.x));
          const minY = Math.min(...groupElements.map((el) => el.y));
          const maxX = Math.max(...groupElements.map((el) => el.x + el.width));
          const maxY = Math.max(...groupElements.map((el) => el.y + el.height));

          const groupId = generateId();
          const groupElement: CanvasElement = {
            id: groupId,
            type: 'group',
            name: 'Group',
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: Math.max(...groupElements.map((el) => el.zIndex || 0)) + 1,
            childIds: ids,
            timestamp: Date.now(),
          };

          // Update child elements with parent reference
          const updatedElements = { ...elements };
          ids.forEach((id) => {
            updatedElements[id] = {
              ...updatedElements[id],
              parentId: groupId,
            };
          });

          set({
            elements: {
              ...updatedElements,
              [groupId]: groupElement,
            },
            elementOrder: [
              ...get().elementOrder.filter((id) => !ids.includes(id)),
              groupId,
            ],
            selection: {
              ...get().selection,
              selectedIds: [groupId],
              isMultiSelect: false,
            },
            isDirty: true,
          });

          get().pushHistory('Group elements');
        },

        ungroupElement: (id: string) => {
          const element = get().elements[id];
          if (element?.type !== 'group') return;

          const childIds = (element as any).childIds || [];
          const elements = { ...get().elements };

          // Remove parent reference from children
          childIds.forEach((childId: string) => {
            if (elements[childId]) {
              const { parentId, ...rest } = elements[childId] as any;
              elements[childId] = rest;
            }
          });

          // Remove group element
          delete elements[id];

          set({
            elements,
            elementOrder: get().elementOrder.filter((elId) => elId !== id),
            selection: {
              ...get().selection,
              selectedIds: childIds,
              isMultiSelect: childIds.length > 1,
            },
            isDirty: true,
          });

          get().pushHistory('Ungroup elements');
        },

        // Alignment operations
        alignElements: (type: AlignType) => {
          const { elements, selection } = get();
          const selectedElements = selection.selectedIds
            .map((id) => elements[id])
            .filter(Boolean);

          if (selectedElements.length < 2) return;

          const updates: Record<string, Partial<CanvasElement>> = {};

          switch (type) {
            case 'left': {
              const minX = Math.min(...selectedElements.map((el) => el.x));
              selectedElements.forEach((el) => {
                updates[el.id] = { x: minX };
              });
              break;
            }
            case 'center': {
              const minX = Math.min(...selectedElements.map((el) => el.x));
              const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
              const centerX = (minX + maxX) / 2;
              selectedElements.forEach((el) => {
                updates[el.id] = { x: centerX - el.width / 2 };
              });
              break;
            }
            case 'right': {
              const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
              selectedElements.forEach((el) => {
                updates[el.id] = { x: maxX - el.width };
              });
              break;
            }
            case 'top': {
              const minY = Math.min(...selectedElements.map((el) => el.y));
              selectedElements.forEach((el) => {
                updates[el.id] = { y: minY };
              });
              break;
            }
            case 'middle': {
              const minY = Math.min(...selectedElements.map((el) => el.y));
              const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));
              const centerY = (minY + maxY) / 2;
              selectedElements.forEach((el) => {
                updates[el.id] = { y: centerY - el.height / 2 };
              });
              break;
            }
            case 'bottom': {
              const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));
              selectedElements.forEach((el) => {
                updates[el.id] = { y: maxY - el.height };
              });
              break;
            }
          }

          Object.entries(updates).forEach(([id, update]) => {
            get().updateElement(id, update);
          });

          get().pushHistory(`Align ${type}`);
        },

        distributeElements: (type: DistributeType) => {
          const { elements, selection } = get();
          const selectedElements = selection.selectedIds
            .map((id) => elements[id])
            .filter(Boolean)
            .sort((a, b) => (type === 'horizontal' ? a.x - b.x : a.y - b.y));

          if (selectedElements.length < 3) return;

          const updates: Record<string, Partial<CanvasElement>> = {};

          if (type === 'horizontal') {
            const firstX = selectedElements[0].x;
            const lastX = selectedElements[selectedElements.length - 1].x;
            const totalWidth = selectedElements.reduce((sum, el) => sum + el.width, 0);
            const spacing = (lastX - firstX - totalWidth) / (selectedElements.length - 1);

            let currentX = firstX;
            selectedElements.forEach((el) => {
              updates[el.id] = { x: currentX };
              currentX += el.width + spacing;
            });
          } else {
            const firstY = selectedElements[0].y;
            const lastY = selectedElements[selectedElements.length - 1].y;
            const totalHeight = selectedElements.reduce((sum, el) => sum + el.height, 0);
            const spacing = (lastY - firstY - totalHeight) / (selectedElements.length - 1);

            let currentY = firstY;
            selectedElements.forEach((el) => {
              updates[el.id] = { y: currentY };
              currentY += el.height + spacing;
            });
          }

          Object.entries(updates).forEach(([id, update]) => {
            get().updateElement(id, update);
          });

          get().pushHistory(`Distribute ${type}`);
        },

        // History operations
        pushHistory: (action: string) => {
          set((state) => {
            const entry: HistoryEntry = {
              id: generateId(),
              action,
              timestamp: Date.now(),
              elements: Object.values(state.elements),
              canvas: state.canvas,
            };

            const newHistory = [
              ...state.history.slice(0, state.historyIndex + 1),
              entry,
            ];

            // Limit history size
            if (newHistory.length > MAX_HISTORY) {
              newHistory.shift();
            }

            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            };
          });
        },

        undo: () => {
          const { history, historyIndex } = get();
          if (historyIndex <= 0) return;

          const previousEntry = history[historyIndex - 1];
          const elementsMap: Record<string, CanvasElement> = {};
          previousEntry.elements.forEach((el) => {
            elementsMap[el.id] = el;
          });

          set({
            elements: elementsMap,
            elementOrder: previousEntry.elements.map((el) => el.id),
            canvas: previousEntry.canvas,
            historyIndex: historyIndex - 1,
            isDirty: true,
          });
        },

        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex >= history.length - 1) return;

          const nextEntry = history[historyIndex + 1];
          const elementsMap: Record<string, CanvasElement> = {};
          nextEntry.elements.forEach((el) => {
            elementsMap[el.id] = el;
          });

          set({
            elements: elementsMap,
            elementOrder: nextEntry.elements.map((el) => el.id),
            canvas: nextEntry.canvas,
            historyIndex: historyIndex + 1,
            isDirty: true,
          });
        },

        // Clipboard operations
        copy: () => {
          const { elements, selection } = get();
          const selectedElements = selection.selectedIds
            .map((id) => elements[id])
            .filter(Boolean);

          set({ clipboard: selectedElements });
        },

        paste: () => {
          const { clipboard } = get();
          if (!clipboard || clipboard.length === 0) return;

          const newElements = clipboard.map((el) => ({
            ...el,
            id: generateId(),
            x: el.x + 20,
            y: el.y + 20,
            timestamp: Date.now(),
          }));

          newElements.forEach((el) => get().addElement(el));

          // Select pasted elements
          set((state) => ({
            selection: {
              ...state.selection,
              selectedIds: newElements.map((el) => el.id),
              isMultiSelect: newElements.length > 1,
            },
          }));

          get().pushHistory('Paste');
        },

        cut: () => {
          get().copy();
          const { selection } = get();
          selection.selectedIds.forEach((id) => get().deleteElement(id));
        },

        // Canvas operations
        setCanvasSize: (width: number, height: number) => {
          set((state) => ({
            canvas: { ...state.canvas, width, height },
            isDirty: true,
          }));
          get().pushHistory('Resize canvas');
        },

        setBackground: (color: string) => {
          set((state) => ({
            canvas: { ...state.canvas, background: color },
            isDirty: true,
          }));
        },

        toggleGrid: () => {
          set((state) => ({
            canvas: { ...state.canvas, gridEnabled: !state.canvas.gridEnabled },
          }));
        },

        // View operations
        setZoom: (zoom: number) => {
          set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
        },

        setPan: (panX: number, panY: number) => {
          set({ panX, panY });
        },

        resetView: () => {
          set({ zoom: 1, panX: 0, panY: 0 });
        },

        // Tool operations
        setActiveTool: (tool: Tool) => {
          set({ activeTool: tool });
        },

        // Asset operations
        addAsset: (asset: Asset) => {
          set((state) => ({
            assets: {
              ...state.assets,
              [asset.id]: asset,
            },
            isDirty: true,
          }));
        },

        deleteAsset: (id: string) => {
          set((state) => {
            const { [id]: removed, ...remainingAssets } = state.assets;
            return {
              assets: remainingAssets,
              isDirty: true,
            };
          });
        },

        // Project operations
        loadProject: (project: ProjectData) => {
          const elementsMap: Record<string, CanvasElement> = {};
          project.elements.forEach((el) => {
            elementsMap[el.id] = el;
          });

          const assetsMap: Record<string, Asset> = {};
          project.assets.forEach((asset) => {
            assetsMap[asset.id] = asset;
          });

          set({
            elements: elementsMap,
            elementOrder: project.elements.map((el) => el.id),
            canvas: project.canvas,
            assets: assetsMap,
            isDirty: false,
            lastSaved: project.metadata.lastModified,
          });

          get().pushHistory('Load project');
        },

        saveProject: (): ProjectData => {
          const state = get();
          const project: ProjectData = {
            version: '1.0',
            name: 'Untitled Project',
            elements: Object.values(state.elements),
            canvas: state.canvas,
            assets: Object.values(state.assets),
            metadata: {
              createdAt: state.lastSaved || Date.now(),
              lastModified: Date.now(),
            },
          };

          set({ isDirty: false, lastSaved: Date.now() });

          // Save to localStorage
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project));

          return project;
        },

        newProject: () => {
          set({
            ...initialState,
            history: [],
            historyIndex: -1,
          });
          localStorage.removeItem(AUTOSAVE_KEY);
        },

        // Export operation (implementation will be in separate utility)
        exportCanvas: async (options: ExportOptions): Promise<Blob> => {
          // This will be implemented in the export utilities
          throw new Error('Export not implemented yet');
        },
      }),
      {
        name: 'canva-editor-storage',
        partialize: (state) => ({
          canvas: state.canvas,
          elements: state.elements,
          elementOrder: state.elementOrder,
          assets: state.assets,
          leftPanelOpen: state.leftPanelOpen,
          rightPanelOpen: state.rightPanelOpen,
          leftPanelTab: state.leftPanelTab,
          rightPanelTab: state.rightPanelTab,
        }),
      
      }
    ),
    { name: 'CanvaEditor' }
  )
);

// Selectors for derived state
export const useSelectedElements = () => {
  return useEditorStore((state) =>
    state.selection.selectedIds.map((id) => state.elements[id]).filter(Boolean)
  );
};

export const useCanUndo = () => {
  return useEditorStore((state) => state.historyIndex > 0);
};

export const useCanRedo = () => {
  return useEditorStore((state) => state.historyIndex < state.history.length - 1);
};

export const useElementCount = () => {
  return useEditorStore((state) => state.elementOrder.length);
};

export const useSortedElements = () => {
  return useEditorStore((state) =>
    state.elementOrder.map((id) => state.elements[id]).filter(Boolean)
  );
};
