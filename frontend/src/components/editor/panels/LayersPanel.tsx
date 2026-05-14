import React, { useCallback } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Sortable layer item for drag-and-drop
 */
const SortableLayer: React.FC<{
  element: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ element, isSelected, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: element.id,
  });

  const {
    toggleVisibility,
    toggleLock,
    removeElement,
    duplicateElement,
    selectElement,
  } = useCanvasEditorStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer',
        isSelected
          ? 'bg-violet-500/20 border-violet-500/50'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
      onClick={onClick}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
      >
        <div className="w-4 h-4 flex items-center justify-center text-[10px]">⋮⋮</div>
      </div>

      {/* Element Name */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">
          {element.name || element.type}
        </p>
        <p className="text-[10px] text-slate-500">{element.type}</p>
      </div>

      {/* Visibility Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleVisibility(element.id);
        }}
        className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
        title={element.visible ? 'Hide' : 'Show'}
      >
        {element.visible ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4 opacity-50" />
        )}
      </button>

      {/* Lock Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleLock(element.id);
        }}
        className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
        title={element.locked ? 'Unlock' : 'Lock'}
      >
        {element.locked ? (
          <Lock className="w-4 h-4" />
        ) : (
          <Unlock className="w-4 h-4 opacity-50" />
        )}
      </button>

      {/* Duplicate */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          duplicateElement(element.id);
        }}
        className="p-1 text-slate-500 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all"
        title="Duplicate"
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeElement(element.id);
        }}
        className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Layers panel for managing canvas elements
 */
const LayersPanel: React.FC = () => {
  const { elements, selectedIds, selectElement, setZIndex, clearSelection } =
    useCanvasEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 })
  );

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = sortedElements.findIndex((el) => el.id === active.id);
    const overIndex = sortedElements.findIndex((el) => el.id === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    // Update z-index based on new position
    const newZIndex = overIndex;
    setZIndex(active.id, newZIndex);

    // Re-sort all elements
    sortedElements.forEach((el, i) => {
      if (i !== activeIndex) {
        setZIndex(el.id, i < activeIndex ? i : i);
      }
    });
  };

  const moveLayerUp = (id: string) => {
    const currentIndex = sortedElements.findIndex((el) => el.id === id);
    if (currentIndex < sortedElements.length - 1) {
      setZIndex(id, currentIndex + 1);
    }
  };

  const moveLayerDown = (id: string) => {
    const currentIndex = sortedElements.findIndex((el) => el.id === id);
    if (currentIndex > 0) {
      setZIndex(id, currentIndex - 1);
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto flex flex-col">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
        Layers ({elements.length})
      </h3>

      {/* Layer List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedElements.map((el) => el.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1 flex-1">
            {sortedElements.map((element) => (
              <div
                key={element.id}
                className="group flex items-center gap-1"
              >
                <div className="flex-1 min-w-0">
                  <SortableLayer
                    element={element}
                    isSelected={selectedIds.includes(element.id)}
                    onClick={() => selectElement(element.id, false)}
                  />
                </div>

                {/* Layer Order Controls */}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveLayerUp(element.id)}
                    className="p-1 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded"
                    title="Move up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveLayerDown(element.id)}
                    className="p-1 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded"
                    title="Move down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {elements.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <p className="text-xs text-slate-500 mb-2">No elements yet</p>
            <p className="text-[10px] text-slate-600">
              Add elements from the tools panel
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
