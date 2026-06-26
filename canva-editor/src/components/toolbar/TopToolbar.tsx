import React from 'react';
import {
  Undo,
  Redo,
  Save,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorStore, useCanUndo, useCanRedo, useSelectedElements } from '@/stores/editorStore';

interface TopToolbarProps {
  onSave: () => void;
  onExport: () => void;
  onPreview: () => void;
  isDirty: boolean;
}

export function TopToolbar({ onSave, onExport, onPreview, isDirty }: TopToolbarProps) {
  const {
    undo,
    redo,
    zoom,
    setZoom,
    resetView,
    alignElements,
    bringToFront,
    sendToBack,
    copy,
    deleteElement,
    selection,
    updateElement,
  } = useEditorStore();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const selectedElements = useSelectedElements();
  const hasSelection = selectedElements.length > 0;
  const isSingleSelection = selectedElements.length === 1;

  const handleZoomIn = () => setZoom(Math.min(5, zoom * 1.2));
  const handleZoomOut = () => setZoom(Math.max(0.1, zoom / 1.2));
  const handleZoomReset = () => resetView();

  const toggleLock = () => {
    if (isSingleSelection) {
      const element = selectedElements[0];
      updateElement(element.id, { locked: !element.locked });
    }
  };

  const isLocked = isSingleSelection && selectedElements[0]?.locked;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
        {/* Left Section - Undo/Redo */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Cmd+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Cmd+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Zoom Controls */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomReset}
            className="min-w-[60px] text-xs font-mono"
          >
            {Math.round(zoom * 100)}%
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomReset}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fit to Screen</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center Section - Alignment & Arrangement */}
        {hasSelection && (
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Horizontal Alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alignElements('left')}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Left</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alignElements('center')}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Center</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alignElements('right')}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Right</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Vertical Alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alignElements('top')}
                >
                  <AlignStartVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Top</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alignElements('middle')}
                >
                  <AlignCenterVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Middle</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => alignElements('bottom')}
                >
                  <AlignEndVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Bottom</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Arrange */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => isSingleSelection && bringToFront(selectedElements[0].id)}
                  disabled={!isSingleSelection}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bring to Front</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => isSingleSelection && sendToBack(selectedElements[0].id)}
                  disabled={!isSingleSelection}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send to Back</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={copy}>
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy (Cmd+C)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLock}
                  disabled={!isSingleSelection}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLocked ? 'Unlock' : 'Lock'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    selection.selectedIds.forEach((id) => deleteElement(id));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete (Del)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Right Section - Save/Export */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onPreview}>
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            {isDirty ? 'Save' : 'Saved'}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default TopToolbar;
