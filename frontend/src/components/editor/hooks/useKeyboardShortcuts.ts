import { useEffect, useCallback } from 'react';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';

/**
 * Hook for managing keyboard shortcuts in the canvas editor
 */
export function useKeyboardShortcuts() {
  const {
    selectedIds,
    undo,
    redo,
    selectAll,
    clearSelection,
    deleteSelected,
    duplicateElement,
    groupElements,
    ungroupElements,
    copyElement,
    pasteElement,
  } = useCanvasEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Prevent default for important shortcuts
      const shouldPreventDefault = [
        'z', 'y', 'a', 'd', 'g', 'c', 'v', 'Delete', 'Backspace'
      ].includes(e.key);

      // ─── History ──────────────────────────────────────────────
      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if ((ctrlKey && e.key === 'z' && e.shiftKey) || (ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
        return;
      }

      // ─── Selection ────────────────────────────────────────────
      if (ctrlKey && e.key === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        return;
      }

      // ─── Clipboard ────────────────────────────────────────────
      if (ctrlKey && e.key === 'c') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          copyElement(selectedIds[0]);
        }
        return;
      }

      if (ctrlKey && e.key === 'v') {
        e.preventDefault();
        pasteElement();
        return;
      }

      // ─── Duplication ──────────────────────────────────────────
      if (ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          duplicateElement(selectedIds[0]);
        }
        return;
      }

      // ─── Deletion ─────────────────────────────────────────────
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // ─── Grouping ─────────────────────────────────────────────
      if (ctrlKey && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        if (selectedIds.length > 1) {
          groupElements(selectedIds);
        }
        return;
      }

      if ((ctrlKey && e.key === 'g' && e.shiftKey) || (ctrlKey && e.shiftKey && e.key === 'G')) {
        e.preventDefault();
        // TODO: Ungroup selected
        if (selectedIds.length > 0) {
          // ungroupElements(selectedIds[0]);
        }
        return;
      }

      // ─── Arrow keys for movement ──────────────────────────────
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const store = useCanvasEditorStore.getState();

        selectedIds.forEach((id) => {
          const element = store.elements.find((el) => el.id === id);
          if (element) {
            const { x, y } = element.transform;
            let newX = x,
              newY = y;

            switch (e.key) {
              case 'ArrowUp':
                newY -= step;
                break;
              case 'ArrowDown':
                newY += step;
                break;
              case 'ArrowLeft':
                newX -= step;
                break;
              case 'ArrowRight':
                newX += step;
                break;
            }

            store.moveElement(id, newX, newY);
          }
        });

        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedIds,
    undo,
    redo,
    selectAll,
    clearSelection,
    deleteSelected,
    duplicateElement,
    groupElements,
    ungroupElements,
    copyElement,
    pasteElement,
  ]);
}

export default useKeyboardShortcuts;
