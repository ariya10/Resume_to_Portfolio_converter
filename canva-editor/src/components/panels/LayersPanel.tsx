import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Type,
  Image,
  Square,
  Layers,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEditorStore, useSortedElements } from '@/stores/editorStore';
import { cn } from '@/lib/utils';
import type { CanvasElement } from '@/types/canvas';

export function LayersPanel() {
  const {
    selection,
    selectElement,
    updateElement,
    deleteElement,
    duplicateElement,
    bringToFront,
    sendToBack,
  } = useEditorStore();

  const elements = useSortedElements();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return Type;
      case 'image':
        return Image;
      case 'shape':
        return Square;
      case 'group':
        return Layers;
      default:
        return Square;
    }
  };

  const handleNameEdit = (element: CanvasElement) => {
    setEditingId(element.id);
    setEditingName(element.name);
  };

  const handleNameSave = (id: string) => {
    if (editingName.trim()) {
      updateElement(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  const toggleVisibility = (element: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(element.id, { visible: !element.visible });
  };

  const toggleLock = (element: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(element.id, { locked: !element.locked });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">Layers</h3>
          <span className="text-xs text-slate-500">
            {elements.length} layer{elements.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Click to select, drag to reorder
        </p>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {elements.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No layers yet. Add elements from the Tools panel.
            </div>
          ) : (
            <div className="space-y-1">
              {/* Render in reverse order (top to bottom) */}
              {[...elements].reverse().map((element) => {
                const Icon = getElementIcon(element.type);
                const isSelected = selection.selectedIds.includes(element.id);
                const isEditing = editingId === element.id;

                return (
                  <div
                    key={element.id}
                    className={cn(
                      'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'hover:bg-slate-50 border-2 border-transparent'
                    )}
                    onClick={() => selectElement(element.id)}
                  >
                    {/* Icon */}
                    <Icon className="w-4 h-4 text-slate-600 flex-shrink-0" />

                    {/* Name */}
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => handleNameSave(element.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNameSave(element.id);
                          } else if (e.key === 'Escape') {
                            setEditingId(null);
                          }
                        }}
                        autoFocus
                        className="h-6 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className={cn(
                          'flex-1 text-sm truncate',
                          !element.visible && 'text-slate-400 line-through'
                        )}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleNameEdit(element);
                        }}
                      >
                        {element.name}
                      </span>
                    )}

                    {/* Controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => toggleVisibility(element, e)}
                      >
                        {element.visible ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => toggleLock(element, e)}
                      >
                        {element.locked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-600" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNameEdit(element);
                            }}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateElement(element.id);
                            }}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              bringToFront(element.id);
                            }}
                          >
                            Bring to Front
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              sendToBack(element.id);
                            }}
                          >
                            Send to Back
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(element.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default LayersPanel;
