import { useCallback } from 'react';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';
import type { CanvasElement } from '@/lib/canvas/types';

/**
 * Hook for selection management and element queries
 */
export function useSelection() {
  const {
    elements,
    selectedIds,
    selectElement,
    deselectElement,
    clearSelection,
    selectAll,
  } = useCanvasEditorStore();

  // Get selected elements
  const selectedElements = useCallback(
    () => elements.filter((el) => selectedIds.includes(el.id)),
    [elements, selectedIds]
  );

  // Get first selected element
  const primarySelected = useCallback(
    () => selectedElements()[0] || null,
    [selectedElements]
  );

  // Check if multiple elements selected
  const isMultiSelect = useCallback(
    () => selectedIds.length > 1,
    [selectedIds]
  );

  // Get element by ID
  const getElement = useCallback(
    (id: string) => elements.find((el) => el.id === id) || null,
    [elements]
  );

  // Select elements by type
  const selectByType = useCallback(
    (type: string) => {
      clearSelection();
      elements.forEach((el) => {
        if (el.type === type) {
          selectElement(el.id, true);
        }
      });
    },
    [elements, clearSelection, selectElement]
  );

  // Select elements in region
  const selectInRegion = useCallback(
    (
      regionX: number,
      regionY: number,
      regionWidth: number,
      regionHeight: number,
      multi = false
    ) => {
      if (!multi) clearSelection();

      elements.forEach((el) => {
        const { x, y, width, height } = el.transform;
        if (
          x < regionX + regionWidth &&
          x + width > regionX &&
          y < regionY + regionHeight &&
          y + height > regionY
        ) {
          selectElement(el.id, true);
        }
      });
    },
    [elements, clearSelection, selectElement]
  );

  // Toggle selection
  const toggleSelection = useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        deselectElement(id);
      } else {
        selectElement(id, true);
      }
    },
    [selectedIds, selectElement, deselectElement]
  );

  // Invert selection
  const invertSelection = useCallback(() => {
    clearSelection();
    elements.forEach((el) => {
      if (!selectedIds.includes(el.id)) {
        selectElement(el.id, true);
      }
    });
  }, [elements, selectedIds, clearSelection, selectElement]);

  // Count selected
  const countSelected = useCallback(
    () => selectedIds.length,
    [selectedIds]
  );

  // Check if all locked
  const areAllLocked = useCallback(
    () =>
      selectedElements().length > 0 &&
      selectedElements().every((el) => el.locked),
    [selectedElements]
  );

  // Check if all hidden
  const areAllHidden = useCallback(
    () =>
      selectedElements().length > 0 &&
      selectedElements().every((el) => !el.visible),
    [selectedElements]
  );

  return {
    selectedElements,
    primarySelected,
    isMultiSelect,
    countSelected,
    getElement,
    selectByType,
    selectInRegion,
    toggleSelection,
    invertSelection,
    areAllLocked,
    areAllHidden,
    clearSelection,
    selectAll,
  };
}

export default useSelection;
