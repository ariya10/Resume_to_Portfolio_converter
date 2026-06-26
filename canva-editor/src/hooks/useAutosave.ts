import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';

interface UseAutosaveOptions {
  interval?: number; // ms, default 30 000
  onSave?: () => void;
}

export function useAutosave({ interval = 30_000, onSave }: UseAutosaveOptions = {}) {
  const isDirty = useEditorStore((s) => s.isDirty);
  const saveProject = useEditorStore((s) => s.saveProject);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Only schedule autosave when there are unsaved changes
    if (!isDirty) return;

    timerRef.current = setInterval(() => {
      saveProject();
      onSave?.();
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDirty, interval, saveProject, onSave]);

  // Save on unmount if dirty
  useEffect(() => {
    return () => {
      if (useEditorStore.getState().isDirty) {
        useEditorStore.getState().saveProject();
      }
    };
  }, []);
}
