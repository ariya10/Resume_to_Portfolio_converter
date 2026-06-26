import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MousePointer2,
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Minus,
  ArrowRight,
  Star,
  Hand,
  ZoomIn,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import type { Tool, ShapeType } from '@/types/canvas';

export function ToolsPanel() {
  const { activeTool, setActiveTool, addElement } = useEditorStore();

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleAddText = () => {
    addElement({
      id: `text_${Date.now()}`,
      type: 'text',
      name: 'Text',
      content: 'Add text',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: Date.now(),
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: '400',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fill: '#000000',
      timestamp: Date.now(),
    });
  };

  const handleAddShape = (shapeType: ShapeType) => {
    const size = 100;
    addElement({
      id: `shape_${Date.now()}`,
      type: 'shape',
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      shapeType,
      x: 150,
      y: 150,
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: Date.now(),
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      cornerRadius: shapeType === 'rectangle' ? 8 : undefined,
      sides: shapeType === 'polygon' ? 6 : shapeType === 'star' ? 5 : undefined,
      timestamp: Date.now(),
    });
  };

  const tools = [
    { tool: 'select' as Tool, icon: MousePointer2, label: 'Select', hotkey: 'V' },
    { tool: 'pan' as Tool, icon: Hand, label: 'Pan', hotkey: 'H' },
    { tool: 'zoom' as Tool, icon: ZoomIn, label: 'Zoom', hotkey: 'Z' },
  ];

  const shapes = [
    { type: 'rectangle' as ShapeType, icon: Square, label: 'Rectangle' },
    { type: 'circle' as ShapeType, icon: Circle, label: 'Circle' },
    { type: 'polygon' as ShapeType, icon: Triangle, label: 'Polygon' },
    { type: 'line' as ShapeType, icon: Minus, label: 'Line' },
    { type: 'arrow' as ShapeType, icon: ArrowRight, label: 'Arrow' },
    { type: 'star' as ShapeType, icon: Star, label: 'Star' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Tools Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            {tools.map(({ tool, icon: Icon, label, hotkey }) => (
              <Button
                key={tool}
                variant={activeTool === tool ? 'default' : 'outline'}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => handleToolClick(tool)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
                <span className="text-[10px] text-slate-500">{hotkey}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Elements Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Elements</h3>
          
          {/* Text Button */}
          <Button
            variant="outline"
            className="w-full h-16 mb-2 flex items-center justify-start gap-3"
            onClick={handleAddText}
          >
            <Type className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-medium">Add Text</div>
              <div className="text-xs text-slate-500">Click to add text box</div>
            </div>
          </Button>

          {/* Image Button */}
          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-3"
            onClick={() => {
              // Trigger file upload
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                  const src = event.target?.result as string;
                  const img = new window.Image();
                  img.onload = () => {
                    addElement({
                      id: `image_${Date.now()}`,
                      type: 'image',
                      name: file.name,
                      src,
                      x: 100,
                      y: 100,
                      width: img.width,
                      height: img.height,
                      originalWidth: img.width,
                      originalHeight: img.height,
                      cropX: 0,
                      cropY: 0,
                      cropWidth: img.width,
                      cropHeight: img.height,
                      rotation: 0,
                      opacity: 1,
                      visible: true,
                      locked: false,
                      zIndex: Date.now(),
                      timestamp: Date.now(),
                    });
                  };
                  img.src = src;
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }}
          >
            <Image className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-medium">Upload Image</div>
              <div className="text-xs text-slate-500">PNG, JPG, SVG</div>
            </div>
          </Button>
        </div>

        <Separator />

        {/* Shapes Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Shapes</h3>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => handleAddShape(type)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1">
              <span>Select All</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-100 border">⌘A</kbd>
            </div>
            <div className="flex justify-between py-1">
              <span>Copy</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-100 border">⌘C</kbd>
            </div>
            <div className="flex justify-between py-1">
              <span>Paste</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-100 border">⌘V</kbd>
            </div>
            <div className="flex justify-between py-1">
              <span>Delete</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-100 border">Del</kbd>
            </div>
            <div className="flex justify-between py-1">
              <span>Duplicate</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-100 border">⌘D</kbd>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default ToolsPanel;
