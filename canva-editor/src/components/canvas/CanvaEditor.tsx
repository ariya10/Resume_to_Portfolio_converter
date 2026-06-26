import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Canvas } from './Canvas';
import { LeftSidebar } from '../panels/LeftSidebar';
import { RightSidebar } from '../panels/RightSidebar';
import { TopToolbar } from '../toolbar/TopToolbar';
import { ExportDialog } from '../modals/ExportDialog';
import { PreviewDialog } from '../modals/PreviewDialog';
import { useEditorStore } from '@/stores/editorStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
import { cn } from '@/lib/utils';
import type { ProjectData } from '@/types/canvas';

interface CanvaEditorProps {
  initialProject?: ProjectData;
  onSave?: (project: ProjectData) => void;
  onExport?: (blob: Blob, format: string) => void;
  className?: string;
}

export function CanvaEditor({
  initialProject,
  onSave,
  onExport,
  className,
}: CanvaEditorProps) {
  const {
    canvas,
    elements,
    elementOrder,
    selection,
    zoom,
    panX,
    panY,
    leftPanelOpen,
    rightPanelOpen,
    loadProject,
    saveProject,
    isDirty,
  } = useEditorStore();

  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false);
  const [debugProject, setDebugProject] = React.useState<any>(null);

  // Load initial project if provided
  useEffect(() => {
    if (initialProject) {
      loadProject(initialProject);
      try { window.parent?.postMessage?.({ type: 'PROJECT_LOADED', project: initialProject }, '*'); } catch (e) {}
      toast.success('Project loaded successfully');
    }
  }, [initialProject, loadProject]);

  // Listen for external messages (e.g., parent iframe) to load a project
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      try {
        const data = e.data;
        if (!data || typeof data !== 'object') return;
        if (data.type === 'LOAD_PROJECT' && data.project) {
          const incoming = data.project;

          // If the incoming payload looks like a full ProjectData, load as-is
          if (incoming.elements && Array.isArray(incoming.elements)) {
              console.debug('CanvaEditor: received full ProjectData via postMessage', incoming);
            loadProject(incoming as ProjectData);
            try {
              localStorage.setItem('canva_debug_project', JSON.stringify(incoming));
              (window as any).__CANVA_LAST_PROJECT = incoming;
              setDebugProject(incoming);
            } catch (err) {}

            // Reapply repeatedly until we are confident the project persists (mitigate persist rehydration race)
            (function ensureLoaded(project: ProjectData) {
              let attempts = 0;
              const maxAttempts = 20;
              const iv = setInterval(() => {
                try {
                  loadProject(project);
                } catch (err) {}
                attempts++;
                if (attempts >= maxAttempts) {
                  clearInterval(iv);
                  try { window.parent?.postMessage?.({ type: 'PROJECT_LOADED', project }, '*'); } catch (e) {}
                }
              }, 200);
            })(incoming as ProjectData);

            toast.success('Project loaded from parent');
            return;
          }

          // Otherwise, accept a simplified payload with selectedTemplateId + parsedData
          const name = incoming.parsedData?.name || 'Untitled';
            console.debug('CanvaEditor: received simplified payload via postMessage', incoming);
          const title = incoming.parsedData?.title || '';
          const summary = incoming.parsedData?.summary || '';

          const now = Date.now();

          const baseProject: ProjectData = {
            version: '1.0',
            name: `${name} - Template ${incoming.selectedTemplateId || ''}`,
            elements: [
              {
                id: `text-${now}-1`,
                type: 'text',
                name: 'Name',
                x: 60,
                y: 60,
                width: 600,
                height: 80,
                rotation: 0,
                opacity: 1,
                visible: true,
                locked: false,
                zIndex: 1,
                timestamp: now,
                content: name,
                fontFamily: 'Inter',
                fontSize: 36,
                fontWeight: '700',
                fontStyle: 'normal',
                textDecoration: 'none',
                textAlign: 'left',
                lineHeight: 1.2,
                letterSpacing: 0,
                fill: '#111827',
              },
              {
                id: `text-${now}-2`,
                type: 'text',
                name: 'Title',
                x: 60,
                y: 140,
                width: 600,
                height: 60,
                rotation: 0,
                opacity: 1,
                visible: true,
                locked: false,
                zIndex: 2,
                timestamp: now,
                content: title || summary,
                fontFamily: 'Inter',
                fontSize: 18,
                fontWeight: '400',
                fontStyle: 'normal',
                textDecoration: 'none',
                textAlign: 'left',
                lineHeight: 1.3,
                letterSpacing: 0,
                fill: '#374151',
              },
            ],
            canvas: {
              width: 1200,
              height: 800,
              background: '#ffffff',
              gridEnabled: false,
              gridSize: 20,
              gridColor: '#e5e7eb',
              snapToGrid: false,
              snapToObjects: true,
              snapThreshold: 6,
            },
            assets: [],
            metadata: {
              createdAt: now,
              lastModified: now,
            },
          };

          loadProject(baseProject);
          try {
            localStorage.setItem('canva_debug_project', JSON.stringify(baseProject));
            (window as any).__CANVA_LAST_PROJECT = baseProject;
            setDebugProject(baseProject);
          } catch (err) {}

          // Reapply repeatedly to mitigate persist rehydration overwriting the incoming project
          (function ensureLoaded(project: ProjectData) {
            let attempts = 0;
            const maxAttempts = 20;
            const iv = setInterval(() => {
              try { loadProject(project); } catch (err) {}
              attempts++;
              if (attempts >= maxAttempts) {
                clearInterval(iv);
                try { window.parent?.postMessage?.({ type: 'PROJECT_LOADED', project }, '*'); } catch (e) {}
              }
            }, 200);
          })(baseProject);

          toast.success('Template loaded into editor');
        }
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loadProject]);

  // Also support loading a project from the URL query (base64 JSON in `project` param)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('project');
      if (!encoded) return;
      const decoded = JSON.parse(atob(encoded));

      if (decoded) {
        // Support payloads that wrap a full project under `project`
        const maybeProject = decoded.project || decoded;

        // If full project data provided
        if (maybeProject.elements && Array.isArray(maybeProject.elements)) {
          console.debug('CanvaEditor: decoded project from URL', maybeProject);
          loadProject(maybeProject as ProjectData);
          try {
            localStorage.setItem('canva_debug_project', JSON.stringify(maybeProject));
            (window as any).__CANVA_LAST_PROJECT = maybeProject;
            setDebugProject(maybeProject);
          } catch (err) {}

          (function ensureLoaded(project: ProjectData) {
            let attempts = 0;
            const maxAttempts = 20;
            const iv = setInterval(() => {
              try { loadProject(project); } catch (err) {}
              attempts++;
              if (attempts >= maxAttempts) {
                clearInterval(iv);
                try { window.parent?.postMessage?.({ type: 'PROJECT_LOADED', project }, '*'); } catch (e) {}
              }
            }, 200);
          })(maybeProject as ProjectData);

          toast.success('Project loaded from URL');
          return;
        }

        // Otherwise accept simplified payload
        const incoming = decoded;
        const name = incoming.parsedData?.name || 'Untitled';
        const title = incoming.parsedData?.title || '';
        const summary = incoming.parsedData?.summary || '';
        const now = Date.now();

        const baseProject: ProjectData = {
          version: '1.0',
          name: `${name} - Template ${incoming.selectedTemplateId || ''}`,
          elements: [
            {
              id: `text-${now}-1`,
              type: 'text',
              name: 'Name',
              x: 60,
              y: 60,
              width: 600,
              height: 80,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              zIndex: 1,
              timestamp: now,
              content: name,
              fontFamily: 'Inter',
              fontSize: 36,
              fontWeight: '700',
              fontStyle: 'normal',
              textDecoration: 'none',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              fill: '#111827',
            },
            {
              id: `text-${now}-2`,
              type: 'text',
              name: 'Title',
              x: 60,
              y: 140,
              width: 600,
              height: 60,
              rotation: 0,
              opacity: 1,
              visible: true,
              locked: false,
              zIndex: 2,
              timestamp: now,
              content: title || summary,
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: '400',
              fontStyle: 'normal',
              textDecoration: 'none',
              textAlign: 'left',
              lineHeight: 1.3,
              letterSpacing: 0,
              fill: '#374151',
            },
          ],
          canvas: {
            width: 1200,
            height: 800,
            background: '#ffffff',
            gridEnabled: false,
            gridSize: 20,
            gridColor: '#e5e7eb',
            snapToGrid: false,
            snapToObjects: true,
            snapThreshold: 6,
          },
          assets: [],
          metadata: {
            createdAt: now,
            lastModified: now,
          },
        };

        loadProject(baseProject);
        try { window.parent?.postMessage?.({ type: 'PROJECT_LOADED', project: baseProject }, '*'); } catch (e) {}
        // Also re-apply after a short delay to avoid rehydration race conditions
        setTimeout(() => loadProject(baseProject), 300);
        toast.success('Project loaded from URL');
      }
    } catch (err) {
      // ignore
    }
  }, [loadProject]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts();

  // Setup autosave
  useAutosave({
    interval: 30000, // 30 seconds
    onSave: () => {
      const project = saveProject();
      onSave?.(project);
      toast.success('Autosaved');
    },
  });

  // Handle manual save
  const handleSave = useCallback(() => {
    const project = saveProject();
    onSave?.(project);
    toast.success('Project saved successfully');
  }, [saveProject, onSave]);

  // Get sorted elements for rendering
  const sortedElements = elementOrder
    .map((id) => elements[id])
    .filter(Boolean);

  return (
    <div className={cn('h-screen flex flex-col bg-slate-50', className)}>
      {/* Top Toolbar */}
      <TopToolbar
        onSave={handleSave}
        onExport={() => setExportDialogOpen(true)}
        onPreview={() => setPreviewDialogOpen(true)}
        isDirty={isDirty}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: leftPanelOpen ? 320 : 0,
            opacity: leftPanelOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="border-r border-slate-200 bg-white overflow-hidden"
        >
          <LeftSidebar />
        </motion.aside>

        {/* Canvas Area */}
        <main className="flex-1 relative bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                canvas.gridEnabled
                  ? `
                    linear-gradient(${canvas.gridColor} 1px, transparent 1px),
                    linear-gradient(90deg, ${canvas.gridColor} 1px, transparent 1px)
                  `
                  : 'none',
              backgroundSize: canvas.gridEnabled
                ? `${canvas.gridSize * zoom}px ${canvas.gridSize * zoom}px`
                : 'auto',
              backgroundPosition: `${panX}px ${panY}px`,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <Canvas
              width={canvas.width}
              height={canvas.height}
              elements={sortedElements}
              selectedIds={selection.selectedIds}
              zoom={zoom}
              panX={panX}
              panY={panY}
              gridEnabled={canvas.gridEnabled}
              gridSize={canvas.gridSize}
              snapToGrid={canvas.snapToGrid}
              snapToObjects={canvas.snapToObjects}
              snapThreshold={canvas.snapThreshold}
              background={canvas.background}
            />
          </div>

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg border border-slate-200">
            <span className="text-xs font-medium text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Element Count Indicator */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg border border-slate-200">
            <span className="text-xs font-medium text-slate-700">
              {elementOrder.length} element{elementOrder.length !== 1 ? 's' : ''}
            </span>
          </div>
        </main>

        {/* Right Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: rightPanelOpen ? 320 : 0,
            opacity: rightPanelOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="border-l border-slate-200 bg-white overflow-hidden"
        >
          <RightSidebar />
        </motion.aside>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={async (blob, format) => {
          onExport?.(blob, format);
          toast.success(`Exported as ${format.toUpperCase()}`);
        }}
      />

      {/* Preview Dialog */}
      <PreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      />

      {/* Unsaved Changes Warning */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Unsaved changes
        </div>
      )}
      {/* Debug overlay (visible during development) */}
      {debugProject && (
        <pre
          id="canva-debug"
          className="fixed bottom-4 left-4 max-w-sm max-h-60 overflow-auto bg-white/90 text-xs text-black p-2 rounded shadow-lg border border-slate-200 z-50"
        >
          {JSON.stringify(debugProject, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default CanvaEditor;
