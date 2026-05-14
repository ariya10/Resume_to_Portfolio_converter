import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Square, 
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Lock,
  LockOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useCanvasEditorStore } from '@/store/canvas-editor-store';

/**
 * Enhanced Properties panel with comprehensive styling and editing controls
 * Includes transform, styling, typography, effects, and arrangement tools
 */
const PropertiesPanel: React.FC = () => {
  const store = useCanvasEditorStore();
  const { selectedIds, elements, updateElement, setZIndex, duplicateElement, removeElement, toggleLock, toggleVisibility } = store ?? ({} as any);

  const selectedElement = elements.find((el) => selectedIds.includes(el.id));

  if (!store || !selectedElement || selectedIds.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center text-center">
        <div>
          <p className="text-xs text-slate-500 mb-2">No element selected</p>
          <p className="text-[10px] text-slate-600">Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  const element = selectedElement;
  const isTextElement = element.type === 'text';
  const maxZIndex = Math.max(...elements.map((el: any) => el.zIndex || 0), 0);

  // ─── Transform Properties ────────────────────────────────

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateElement(element.id, {
      transform: {
        ...element.transform,
        [axis]: value,
      },
    } as any);
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updateElement(element.id, {
      transform: {
        ...element.transform,
        [dimension]: Math.max(10, value),
      },
    } as any);
  };

  const handleRotationChange = (value: number) => {
    updateElement(element.id, {
      transform: {
        ...element.transform,
        rotation: value % 360,
      },
    } as any);
  };

  const handleOpacityChange = (value: number) => {
    updateElement(element.id, {
      opacity: value / 100,
    } as any);
  };

  const handleBorderRadiusChange = (value: number) => {
    updateElement(element.id, {
      borderRadius: Math.max(0, value),
    } as any);
  };

  // ─── Styling ─────────────────────────────────────────────

  const handleFillChange = (color: string) => {
    updateElement(element.id, {
      fill: {
        type: 'solid',
        color,
      },
    } as any);
  };

  const handleStrokeChange = (color: string) => {
    updateElement(element.id, {
      stroke: {
        ...(element as any).stroke,
        color,
      },
    } as any);
  };

  const handleStrokeWidthChange = (width: number) => {
    updateElement(element.id, {
      stroke: {
        ...(element as any).stroke,
        width,
      },
    } as any);
  };

  const handleShadowChange = (property: string, value: any) => {
    const currentShadow = (element as any).shadow || {
      color: '#00000030',
      blur: 8,
      offsetX: 0,
      offsetY: 4,
      opacity: 1,
    };
    updateElement(element.id, {
      shadow: {
        ...currentShadow,
        [property]: value,
      },
    } as any);
  };

  // ─── Text Properties ────────────────────────────────────

  const handleFontSizeChange = (size: number) => {
    if (element.type !== 'text') return;
    const textStyle = (element as any).textStyle || {};
    updateElement(element.id, {
      textStyle: {
        ...textStyle,
        fontSize: size,
      },
    } as any);
  };

  const handleFontWeightChange = (weight: string) => {
    if (element.type !== 'text') return;
    const textStyle = (element as any).textStyle || {};
    updateElement(element.id, {
      textStyle: {
        ...textStyle,
        fontWeight: parseInt(weight),
      },
    } as any);
  };

  const handleFontFamilyChange = (family: string) => {
    if (element.type !== 'text') return;
    const textStyle = (element as any).textStyle || {};
    updateElement(element.id, {
      textStyle: {
        ...textStyle,
        fontFamily: family,
      },
    } as any);
  };

  const handleLineHeightChange = (height: number) => {
    if (element.type !== 'text') return;
    const textStyle = (element as any).textStyle || {};
    updateElement(element.id, {
      textStyle: {
        ...textStyle,
        lineHeight: height,
      },
    } as any);
  };

  const handleLetterSpacingChange = (spacing: number) => {
    if (element.type !== 'text') return;
    const textStyle = (element as any).textStyle || {};
    updateElement(element.id, {
      textStyle: {
        ...textStyle,
        letterSpacing: spacing,
      },
    } as any);
  };

  const handleTextAlignChange = (align: string) => {
    if (element.type !== 'text') return;
    const textStyle = (element as any).textStyle || {};
    updateElement(element.id, {
      textStyle: {
        ...textStyle,
        textAlign: align,
      },
    } as any);
  };

  const handleTextColorChange = (color: string) => {
    if (element.type !== 'text') return;
    updateElement(element.id, {
      textColor: color,
    } as any);
  };

  // ─── Alignment & Arrangement ────────────────────────────

  const handleDuplicate = () => {
    duplicateElement(element.id);
  };

  const handleDelete = () => {
    removeElement(element.id);
  };

  const handleBringToFront = () => {
    setZIndex(element.id, maxZIndex + 1);
  };

  const handleSendToBack = () => {
    setZIndex(element.id, 0);
  };

  // ─── Component Render ────────────────────────────────────

  const fillColor = (element as any).fill?.color || '#3B82F6';
  const strokeColor = (element as any).stroke?.color || '#000000';
  const strokeWidth = (element as any).stroke?.width || 0;
  const textColor = (element as any).textColor || '#000000';
  const fontSize = (element as any).textStyle?.fontSize || 24;
  const fontWeight = (element as any).textStyle?.fontWeight || 400;
  const fontFamily = (element as any).textStyle?.fontFamily || 'Arial';
  const lineHeight = (element as any).textStyle?.lineHeight || 1.2;
  const letterSpacing = (element as any).textStyle?.letterSpacing || 0;
  const textAlign = (element as any).textStyle?.textAlign || 'left';
  const borderRadius = (element as any).borderRadius || 0;
  const shadow = (element as any).shadow;
  const isLocked = (element as any).locked;
  const isVisible = (element as any).visible !== false;

  return (
    <div className="p-4 h-full overflow-y-auto flex flex-col space-y-2">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
          Properties
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => toggleVisibility(element.id)}
            title={isVisible ? 'Hide' : 'Show'}
          >
            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => toggleLock(element.id)}
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="transform" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-4 mb-3 h-8">
          <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          {isTextElement && <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>}
          <TabsTrigger value="arrange" className="text-xs">Arrange</TabsTrigger>
        </TabsList>

        {/* ─── Transform Tab ─────────────────────────────────── */}
        <TabsContent value="transform" className="space-y-3 overflow-y-auto">
          {/* Position Section */}
          <div className="space-y-2 pb-3 border-b border-slate-700">
            <Label className="text-xs font-semibold text-slate-300">Position & Size</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">X</Label>
                <Input
                  type="number"
                  value={Math.round(element.transform.x)}
                  onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">Y</Label>
                <Input
                  type="number"
                  value={Math.round(element.transform.y)}
                  onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">W</Label>
                <Input
                  type="number"
                  value={Math.round(element.transform.width)}
                  onChange={(e) => handleSizeChange('width', parseFloat(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">H</Label>
                <Input
                  type="number"
                  value={Math.round(element.transform.height)}
                  onChange={(e) => handleSizeChange('height', parseFloat(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Rotation & Opacity */}
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-slate-300 mb-1 block">
                Rotation: {Math.round(element.transform.rotation)}°
              </Label>
              <Slider
                value={[element.transform.rotation]}
                onValueChange={([v]) => handleRotationChange(v)}
                min={0}
                max={360}
                step={1}
                className="py-2"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-300 mb-1 block">
                Opacity: {Math.round(element.opacity * 100)}%
              </Label>
              <Slider
                value={[element.opacity * 100]}
                onValueChange={([v]) => handleOpacityChange(v)}
                min={0}
                max={100}
                step={1}
                className="py-2"
              />
            </div>
          </div>
        </TabsContent>

        {/* ─── Style Tab ──────────────────────────────────────── */}
        <TabsContent value="style" className="space-y-3 overflow-y-auto">
          {/* Fill Color */}
          <div className="space-y-2 pb-3 border-b border-slate-700">
            <Label className="text-xs font-semibold text-slate-300">Fill</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => handleFillChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={fillColor}
                onChange={(e) => handleFillChange(e.target.value)}
                className="h-7 text-xs flex-1"
              />
            </div>
          </div>

          {/* Stroke */}
          <div className="space-y-2 pb-3 border-b border-slate-700">
            <Label className="text-xs font-semibold text-slate-300">Stroke</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => handleStrokeChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => handleStrokeChange(e.target.value)}
                className="h-7 text-xs flex-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400 mb-1 block">Width: {strokeWidth}px</Label>
              <Slider
                value={[strokeWidth]}
                onValueChange={([v]) => handleStrokeWidthChange(v)}
                min={0}
                max={20}
                step={0.5}
                className="py-2"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-2 pb-3 border-b border-slate-700">
            <Label className="text-xs text-slate-300 mb-1 block">
              Border Radius: {borderRadius}px
            </Label>
            <Slider
              value={[borderRadius]}
              onValueChange={([v]) => handleBorderRadiusChange(v)}
              min={0}
              max={100}
              step={1}
              className="py-2"
            />
          </div>

          {/* Shadow */}
          {shadow && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-300">Shadow</Label>
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">Blur: {shadow.blur}px</Label>
                <Slider
                  value={[shadow.blur]}
                  onValueChange={([v]) => handleShadowChange('blur', v)}
                  min={0}
                  max={50}
                  step={1}
                  className="py-2"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">Opacity: {Math.round(shadow.opacity * 100)}%</Label>
                <Slider
                  value={[shadow.opacity * 100]}
                  onValueChange={([v]) => handleShadowChange('opacity', v / 100)}
                  min={0}
                  max={100}
                  step={1}
                  className="py-2"
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* ─── Text Tab ──────────────────────────────────────── */}
        {isTextElement && (
          <TabsContent value="text" className="space-y-3 overflow-y-auto">
            {/* Font Family */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Font Family</Label>
              <select
                value={fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full px-2 py-1.5 rounded text-xs bg-slate-800 border border-slate-700 text-slate-200"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="space-y-1 pb-3 border-b border-slate-700">
              <Label className="text-xs text-slate-300 mb-1 block">
                Font Size: {fontSize}px
              </Label>
              <Slider
                value={[fontSize]}
                onValueChange={([v]) => handleFontSizeChange(v)}
                min={8}
                max={96}
                step={1}
                className="py-2"
              />
            </div>

            {/* Font Weight */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Font Weight</Label>
              <select
                value={fontWeight}
                onChange={(e) => handleFontWeightChange(e.target.value)}
                className="w-full px-2 py-1.5 rounded text-xs bg-slate-800 border border-slate-700 text-slate-200"
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extrabold (800)</option>
              </select>
            </div>

            {/* Line Height */}
            <div className="space-y-1 pb-3 border-b border-slate-700">
              <Label className="text-xs text-slate-300 mb-1 block">
                Line Height: {lineHeight}
              </Label>
              <Slider
                value={[lineHeight * 10]}
                onValueChange={([v]) => handleLineHeightChange(v / 10)}
                min={8}
                max={40}
                step={1}
                className="py-2"
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-1 pb-3 border-b border-slate-700">
              <Label className="text-xs text-slate-300 mb-1 block">
                Letter Spacing: {letterSpacing}px
              </Label>
              <Slider
                value={[letterSpacing]}
                onValueChange={([v]) => handleLetterSpacingChange(v)}
                min={-5}
                max={20}
                step={0.5}
                className="py-2"
              />
            </div>

            {/* Text Alignment */}
            <div className="space-y-1 pb-3 border-b border-slate-700">
              <Label className="text-xs text-slate-300 mb-2 block">Text Align</Label>
              <div className="flex gap-1">
                <Button
                  variant={textAlign === 'left' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleTextAlignChange('left')}
                >
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant={textAlign === 'center' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleTextAlignChange('center')}
                >
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button
                  variant={textAlign === 'right' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleTextAlignChange('right')}
                >
                  <AlignRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="h-7 text-xs flex-1"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-1 pt-2 border-t border-slate-700">
              <Label className="text-xs text-slate-300">Content</Label>
              <textarea
                value={(element as any).content || ''}
                onChange={(e) =>
                  updateElement(element.id, {
                    content: e.target.value,
                  } as any)
                }
                className="w-full h-16 px-2 py-1 rounded text-xs bg-slate-900 border border-slate-700 text-slate-200 resize-none"
              />
            </div>
          </TabsContent>
        )}

        {/* ─── Arrange Tab ──────────────────────────────────── */}
        <TabsContent value="arrange" className="space-y-2 overflow-y-auto">
          <Label className="text-xs font-semibold text-slate-300 block mb-2">Layer Order</Label>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-700">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={handleBringToFront}
              title="Bring to Front"
            >
              <ChevronUp className="w-3 h-3 mr-1" />
              Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={handleSendToBack}
              title="Send to Back"
            >
              <ChevronDown className="w-3 h-3 mr-1" />
              Back
            </Button>
          </div>

          <Label className="text-xs font-semibold text-slate-300 block mb-2">Z-Index</Label>
          <Input
            type="number"
            value={element.zIndex || 0}
            onChange={(e) => setZIndex(element.id, parseInt(e.target.value))}
            className="h-7 text-xs mb-3"
          />

          <Label className="text-xs font-semibold text-slate-300 block mb-2">Actions</Label>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8"
              onClick={handleDuplicate}
            >
              <Copy className="w-3 h-3 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full justify-start text-xs h-8"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertiesPanel;
