import React, { useRef } from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  FileJson,
  FileImage,
  FileText,
  Eye,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Rows,
  Columns,
  Copy,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';
import { useCanvasExport } from '@/components/editor/hooks/useCanvasExport';
import { toast } from 'sonner';

interface TopToolbarProps {
  stageRef?: React.RefObject<any>;
  onSettingsClick?: () => void;
}

/**
 * Enhanced Top toolbar with editor controls and alignment tools
 */
const TopToolbar: React.FC<TopToolbarProps> = ({ stageRef, onSettingsClick }) => {
  const store = useCanvasEditorStore();
  const { 
    undo, 
    redo, 
    history, 
    historyIndex, 
    zoomIn, 
    zoomOut, 
    viewport, 
    setPreviewMode, 
    previewMode,
    selectedIds = [],
    elements = [],
    duplicateElement,
    removeElement,
    updateElement,
  } = store ?? ({} as any);
  const { exportJSON, exportPNG, exportPDF, exportHTML } = useCanvasExport();

  const canUndo = (historyIndex ?? -1) > 0;
  const canRedo = (historyIndex ?? 0) < (history?.length ?? 1) - 1;
  const hasMultipleSelected = (selectedIds?.length ?? 0) > 1;
  const hasSelection = (selectedIds?.length ?? 0) > 0;

  // ─── Alignment Functions ────────────────────────────────

  const getSelectedElements = () => {
    return (elements ?? []).filter((el: any) => selectedIds?.includes(el.id));
  };

  const alignLeft = () => {
    const selected = getSelectedElements();
    if (selected.length < 2) return;
    const minX = Math.min(...selected.map((el: any) => el.transform.x));
    selected.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, x: minX },
      });
    });
    toast.success('Aligned left');
  };

  const alignCenterH = () => {
    const selected = getSelectedElements();
    if (selected.length < 2) return;
    const centerX =
      (Math.min(...selected.map((el: any) => el.transform.x)) +
        Math.max(...selected.map((el: any) => el.transform.x + el.transform.width))) /
      2;
    selected.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, x: centerX - el.transform.width / 2 },
      });
    });
    toast.success('Aligned center');
  };

  const alignRight = () => {
    const selected = getSelectedElements();
    if (selected.length < 2) return;
    const maxX = Math.max(...selected.map((el: any) => el.transform.x + el.transform.width));
    selected.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, x: maxX - el.transform.width },
      });
    });
    toast.success('Aligned right');
  };

  const alignTop = () => {
    const selected = getSelectedElements();
    if (selected.length < 2) return;
    const minY = Math.min(...selected.map((el: any) => el.transform.y));
    selected.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, y: minY },
      });
    });
    toast.success('Aligned top');
  };

  const alignMiddle = () => {
    const selected = getSelectedElements();
    if (selected.length < 2) return;
    const centerY =
      (Math.min(...selected.map((el: any) => el.transform.y)) +
        Math.max(...selected.map((el: any) => el.transform.y + el.transform.height))) /
      2;
    selected.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, y: centerY - el.transform.height / 2 },
      });
    });
    toast.success('Aligned middle');
  };

  const alignBottom = () => {
    const selected = getSelectedElements();
    if (selected.length < 2) return;
    const maxY = Math.max(...selected.map((el: any) => el.transform.y + el.transform.height));
    selected.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, y: maxY - el.transform.height },
      });
    });
    toast.success('Aligned bottom');
  };

  const distributeHorizontally = () => {
    const selected = getSelectedElements();
    if (selected.length < 3) {
      toast.error('Select at least 3 elements to distribute');
      return;
    }
    const sorted = [...selected].sort((a: any, b: any) => a.transform.x - b.transform.x);
    const minX = sorted[0].transform.x;
    const maxX = sorted[sorted.length - 1].transform.x + sorted[sorted.length - 1].transform.width;
    const totalGap = maxX - minX;
    const totalWidth = sorted.reduce((sum: number, el: any) => sum + el.transform.width, 0);
    const gap = (totalGap - totalWidth) / (sorted.length - 1);

    let currentX = minX;
    sorted.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, x: currentX },
      });
      currentX += el.transform.width + gap;
    });
    toast.success('Distributed horizontally');
  };

  const distributeVertically = () => {
    const selected = getSelectedElements();
    if (selected.length < 3) {
      toast.error('Select at least 3 elements to distribute');
      return;
    }
    const sorted = [...selected].sort((a: any, b: any) => a.transform.y - b.transform.y);
    const minY = sorted[0].transform.y;
    const maxY = sorted[sorted.length - 1].transform.y + sorted[sorted.length - 1].transform.height;
    const totalGap = maxY - minY;
    const totalHeight = sorted.reduce((sum: number, el: any) => sum + el.transform.height, 0);
    const gap = (totalGap - totalHeight) / (sorted.length - 1);

    let currentY = minY;
    sorted.forEach((el: any) => {
      updateElement(el.id, {
        transform: { ...el.transform, y: currentY },
      });
      currentY += el.transform.height + gap;
    });
    toast.success('Distributed vertically');
  };

  // ─── Export Handlers ─────────────────────────────────────

  const handleExportJSON = () => {
    exportJSON('canvas.json');
    toast.success('Exported as JSON');
  };

  const handleExportPNG = async () => {
    if (!stageRef?.current) {
      toast.error('Canvas not ready');
      return;
    }
    try {
      await exportPNG(stageRef.current.container(), 'canvas.png', { scale: 2 });
      toast.success('Exported as PNG');
    } catch (error) {
      toast.error('Failed to export PNG');
    }
  };

  const handleExportPDF = async () => {
    if (!stageRef?.current) {
      toast.error('Canvas not ready');
      return;
    }
    try {
      await exportPDF(stageRef.current.container(), 'canvas.pdf', { scale: 2 });
      toast.success('Exported as PDF');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportHTML = () => {
    exportHTML('canvas.html');
    toast.success('Exported as HTML');
  };

  const handleFitToView = () => {
    if (stageRef?.current?.fitToView) {
      stageRef.current.fitToView();
      toast.success('Fitted to view');
    }
  };

  const handleDuplicate = () => {
    if (!hasSelection) return;
    selectedIds.forEach((id: string) => duplicateElement(id));
    toast.success('Duplicated');
  };

  const handleDelete = () => {
    if (!hasSelection) return;
    selectedIds.forEach((id: string) => removeElement(id));
    toast.success('Deleted');
  };

  return (
    <div className="h-14 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm flex items-center px-3 gap-2 overflow-x-auto">
      {/* ─── History Controls ────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="h-7 w-7 p-0 disabled:opacity-50"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px h-3 bg-slate-700" />
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          className="h-7 w-7 p-0 disabled:opacity-50"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* ─── Zoom Controls ──────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          title="Zoom Out"
          className="h-7 w-7 p-0"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="text-xs text-slate-400 px-1.5 min-w-[42px] text-center">
          {Math.round((viewport?.zoom || 1) * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          title="Zoom In"
          className="h-7 w-7 p-0"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* ─── View Controls ──────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitToView}
          title="Fit to View"
          className="h-7 w-7 p-0"
        >
          <Maximize className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px h-3 bg-slate-700" />
        <Button
          variant={previewMode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          title="Preview Mode"
          className="h-7 w-7 p-0"
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* ─── Alignment Controls ──────────────────────────────────── */}
      {hasMultipleSelected && (
        <>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-0.5 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={alignLeft}
              title="Align Left"
              className="h-7 w-7 p-0"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={alignCenterH}
              title="Align Center"
              className="h-7 w-7 p-0"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={alignRight}
              title="Align Right"
              className="h-7 w-7 p-0"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </Button>
            <div className="w-px h-3 bg-slate-700 mx-0.5" />
            <Button
              variant="ghost"
              size="sm"
              onClick={alignTop}
              title="Align Top"
              className="h-7 w-7 p-0"
            >
              <AlignStartVertical className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={alignMiddle}
              title="Align Middle"
              className="h-7 w-7 p-0"
            >
              <AlignCenterVertical className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={alignBottom}
              title="Align Bottom"
              className="h-7 w-7 p-0"
            >
              <AlignEndVertical className="w-3.5 h-3.5" />
            </Button>
            <div className="w-px h-3 bg-slate-700 mx-0.5" />
            <Button
              variant="ghost"
              size="sm"
              onClick={distributeHorizontally}
              title="Distribute Horizontally"
              className="h-7 w-7 p-0"
            >
              <Columns className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={distributeVertically}
              title="Distribute Vertically"
              className="h-7 w-7 p-0"
            >
              <Rows className="w-3.5 h-3.5" />
            </Button>
          </div>
        </>
      )}

      {/* ─── Edit Controls ──────────────────────────────────────── */}
      {hasSelection && (
        <>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-0.5 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              title="Duplicate"
              className="h-7 w-7 p-0"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              title="Delete"
              className="h-7 w-7 p-0 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </>
      )}

      {/* ─── Spacer ──────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ─── Export Dropdown ─────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        {/* Quick Export JSON */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportJSON}
          title="Export as JSON"
          className="h-7 px-2 gap-1"
        >
          <FileJson className="w-3.5 h-3.5" />
          <span className="text-xs hidden sm:inline">JSON</span>
        </Button>

        {/* Export Menu */}
        <div className="relative group">
          <Button
            variant="default"
            size="sm"
            title="Export"
            className="h-7 px-2 gap-1 bg-blue-600 hover:bg-blue-500 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={handleExportPNG}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded transition-colors"
              >
                <FileImage className="w-3.5 h-3.5" />
                Export as PNG
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Export as PDF
              </button>
              <button
                onClick={handleExportHTML}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Export as HTML
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        {onSettingsClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            title="Settings"
            className="h-7 w-7 p-0"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopToolbar;
