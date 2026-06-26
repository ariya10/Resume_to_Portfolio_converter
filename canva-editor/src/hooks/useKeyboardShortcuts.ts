import { useEffect, useCallback } from 'react';
import { useEditorStore, useCanUndo, useCanRedo } from '@/stores/editorStore';

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    copy,
    paste,
    cut,
    deleteElement,
    duplicateElement,
    selectAll,
    deselectAll,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    groupElements,
    ungroupElement,
    setActiveTool,
    setZoom,
    zoom,
    selection,
    elements,
    toggleGrid,
  } = useEditorStore();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Don't intercept shortcuts when user is typing in an input, textarea, or contenteditable
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const key = e.key.toLowerCase();

      /* ── History ─────────────────────────────────────── */
      if (mod && key === 'z' && !shift) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }
      if ((mod && shift && key === 'z') || (mod && key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      /* ── Clipboard ───────────────────────────────────── */
      if (mod && key === 'c') {
        e.preventDefault();
        copy();
        return;
      }
      if (mod && key === 'v') {
        e.preventDefault();
        paste();
        return;
      }
      if (mod && key === 'x') {
        e.preventDefault();
        cut();
        return;
      }

      /* ── Duplicate ───────────────────────────────────── */
      if (mod && key === 'd') {
        e.preventDefault();
        selection.selectedIds.forEach((id) => duplicateElement(id));
        return;
      }

      /* ── Select All / Deselect ───────────────────────── */
      if (mod && key === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }
      if (key === 'escape') {
        e.preventDefault();
        deselectAll();
        return;
      }

      /* ── Delete ──────────────────────────────────────── */
      if ((key === 'delete' || key === 'backspace') && selection.selectedIds.length > 0) {
        e.preventDefault();
        selection.selectedIds.forEach((id) => deleteElement(id));
        return;
      }

      /* ── Z-index ─────────────────────────────────────── */
      if (selection.selectedIds.length === 1) {
        const id = selection.selectedIds[0];
        if (mod && shift && key === ']') {
          e.preventDefault();
          bringToFront(id);
          return;
        }
        if (mod && shift && key === '[') {
          e.preventDefault();
          sendToBack(id);
          return;
        }
        if (mod && key === ']') {
          e.preventDefault();
          bringForward(id);
          return;
        }
        if (mod && key === '[') {
          e.preventDefault();
          sendBackward(id);
          return;
        }
      }

      /* ── Grouping ────────────────────────────────────── */
      if (mod && key === 'g') {
        e.preventDefault();
        if (shift) {
          // Ungroup
          if (selection.selectedIds.length === 1) {
            ungroupElement(selection.selectedIds[0]);
          }
        } else {
          // Group
          if (selection.selectedIds.length > 1) {
            groupElements(selection.selectedIds);
          }
        }
        return;
      }

      /* ── Nudge elements with arrow keys ─────────────── */
      if (selection.selectedIds.length > 0) {
        const nudge = shift ? 10 : 1;
        let dx = 0;
        let dy = 0;

        if (e.key === 'ArrowLeft')  { dx = -nudge; }
        if (e.key === 'ArrowRight') { dx = nudge;  }
        if (e.key === 'ArrowUp')    { dy = -nudge; }
        if (e.key === 'ArrowDown')  { dy = nudge;  }

        if (dx !== 0 || dy !== 0) {
          e.preventDefault();
          selection.selectedIds.forEach((id) => {
            const el = elements[id];
            if (el && !el.locked) {
              useEditorStore.getState().updateElement(id, {
                x: el.x + dx,
                y: el.y + dy,
              });
            }
          });
          return;
        }
      }

      /* ── Tool Shortcuts ──────────────────────────────── */
      if (!mod && !shift && !alt) {
        switch (key) {
          case 'v': setActiveTool('select'); return;
          case 'h': setActiveTool('pan');    return;
          case 'z': setActiveTool('zoom');   return;
          case 't': setActiveTool('text');   return;
          case 'r': setActiveTool('rectangle'); return;
          case 'c': setActiveTool('circle'); return;
          case 'l': setActiveTool('line');   return;
        }
      }

      /* ── Zoom ────────────────────────────────────────── */
      if (mod && (key === '=' || key === '+')) {
        e.preventDefault();
        setZoom(Math.min(5, zoom * 1.25));
        return;
      }
      if (mod && key === '-') {
        e.preventDefault();
        setZoom(Math.max(0.1, zoom / 1.25));
        return;
      }
      if (mod && key === '0') {
        e.preventDefault();
        useEditorStore.getState().resetView();
        return;
      }

      /* ── Grid ────────────────────────────────────────── */
      if (mod && key === "'") {
        e.preventDefault();
        toggleGrid();
        return;
      }
    },
    [
      undo, redo, copy, paste, cut,
      deleteElement, duplicateElement, selectAll, deselectAll,
      bringToFront, sendToBack, bringForward, sendBackward,
      groupElements, ungroupElement, setActiveTool, setZoom, toggleGrid,
      zoom, selection, elements, canUndo, canRedo,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
