import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { cn } from '@/lib/utils';
import type { CanvasElement, TextElement, ImageElement, ShapeElement } from '@/types/canvas';

const FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Oswald', 'Raleway', 'Poppins', 'Merriweather', 'Playfair Display',
  'Georgia', 'Times New Roman', 'Arial', 'Helvetica', 'Verdana',
  'Courier New', 'Impact', 'Comic Sans MS',
];

interface PropertiesPanelProps {
  selectedElements: CanvasElement[];
}

export function PropertiesPanel({ selectedElements }: PropertiesPanelProps) {
  const { updateElement } = useEditorStore();

  if (selectedElements.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="8" width="10" height="8" rx="2" fill="#94a3b8" />
            <rect x="18" y="8" width="10" height="8" rx="2" fill="#cbd5e1" />
            <rect x="4" y="20" width="24" height="4" rx="2" fill="#e2e8f0" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1">No element selected</p>
        <p className="text-xs text-slate-400">
          Click an element on the canvas to edit its properties.
        </p>
      </div>
    );
  }

  const element = selectedElements[0];
  const isMulti = selectedElements.length > 1;

  const update = (updates: Partial<CanvasElement>) => {
    if (isMulti) {
      selectedElements.forEach((el) => updateElement(el.id, updates));
    } else {
      updateElement(element.id, updates);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">

        {/* Position & Size */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Position & Size
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">X</Label>
              <Input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => update({ x: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Y</Label>
              <Input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => update({ y: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Width</Label>
              <Input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => update({ width: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Height</Label>
              <Input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => update({ height: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Rotation°</Label>
              <Input
                type="number"
                value={Math.round(element.rotation)}
                onChange={(e) => update({ rotation: Number(e.target.value) })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Opacity %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={Math.round(element.opacity * 100)}
                onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-slate-600">Opacity</Label>
              <span className="text-xs text-slate-500">{Math.round(element.opacity * 100)}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[Math.round(element.opacity * 100)]}
              onValueChange={([v]) => update({ opacity: v / 100 })}
              className="w-full"
            />
          </div>
        </section>

        <Separator />

        {/* Text Properties */}
        {element.type === 'text' && (
          <TextProperties element={element as TextElement} onUpdate={update} />
        )}

        {/* Shape Properties */}
        {element.type === 'shape' && (
          <ShapeProperties element={element as ShapeElement} onUpdate={update} />
        )}

        {/* Image Properties */}
        {element.type === 'image' && (
          <ImageProperties element={element as ImageElement} onUpdate={update} />
        )}

        {/* Shadow Controls */}
        <ShadowControls element={element} onUpdate={update} />
      </div>
    </ScrollArea>
  );
}

/* ─── Text Properties ─────────────────────────────────── */
function TextProperties({
  element,
  onUpdate,
}: {
  element: TextElement;
  onUpdate: (u: Partial<TextElement>) => void;
}) {
  return (
    <section>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Typography
      </h4>
      <div className="space-y-3">
        {/* Font Family */}
        <div>
          <Label className="text-xs text-slate-600 mb-1 block">Font Family</Label>
          <Select
            value={element.fontFamily}
            onValueChange={(v) => onUpdate({ fontFamily: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((f) => (
                <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Size (px)</Label>
            <Input
              type="number"
              min={6}
              max={400}
              value={element.fontSize}
              onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Weight</Label>
            <Select
              value={String(element.fontWeight)}
              onValueChange={(v) => onUpdate({ fontWeight: v as any })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['100','200','300','400','500','600','700','800','900'].map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Style Buttons */}
        <div>
          <Label className="text-xs text-slate-600 mb-1 block">Style</Label>
          <div className="flex gap-1">
            <Button
              variant={element.fontStyle === 'italic' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })
              }
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={element.textDecoration === 'underline' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdate({
                  textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline',
                })
              }
            >
              <Underline className="w-4 h-4" />
            </Button>
            <Button
              variant={element.textDecoration === 'line-through' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdate({
                  textDecoration:
                    element.textDecoration === 'line-through' ? 'none' : 'line-through',
                })
              }
            >
              <span className="text-xs line-through font-bold">S</span>
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <Label className="text-xs text-slate-600 mb-1 block">Alignment</Label>
          <div className="flex gap-1">
            {(
              [
                { value: 'left', Icon: AlignLeft },
                { value: 'center', Icon: AlignCenter },
                { value: 'right', Icon: AlignRight },
                { value: 'justify', Icon: AlignJustify },
              ] as const
            ).map(({ value, Icon }) => (
              <Button
                key={value}
                variant={element.textAlign === value ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdate({ textAlign: value })}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Letter Spacing & Line Height */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Letter Spacing</Label>
            <Input
              type="number"
              step={0.5}
              value={element.letterSpacing}
              onChange={(e) => onUpdate({ letterSpacing: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Line Height</Label>
            <Input
              type="number"
              step={0.1}
              min={0.5}
              max={5}
              value={element.lineHeight}
              onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <Label className="text-xs text-slate-600 mb-1 block">Text Color</Label>
          <div className="flex gap-2 items-center">
            <div
              className="w-8 h-8 rounded border border-slate-300 cursor-pointer overflow-hidden"
              style={{ backgroundColor: element.fill }}
            >
              <input
                type="color"
                value={element.fill}
                onChange={(e) => onUpdate({ fill: e.target.value })}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Input
              value={element.fill}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              className="h-8 text-sm flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Shape Properties ────────────────────────────────── */
function ShapeProperties({
  element,
  onUpdate,
}: {
  element: ShapeElement;
  onUpdate: (u: Partial<ShapeElement>) => void;
}) {
  return (
    <section>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Shape
      </h4>
      <div className="space-y-3">
        {/* Fill Color */}
        <div>
          <Label className="text-xs text-slate-600 mb-1 block">Fill Color</Label>
          <div className="flex gap-2 items-center">
            <div
              className="w-8 h-8 rounded border border-slate-300 cursor-pointer overflow-hidden"
              style={{ backgroundColor: element.fill }}
            >
              <input
                type="color"
                value={element.fill}
                onChange={(e) => onUpdate({ fill: e.target.value })}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Input
              value={element.fill}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              className="h-8 text-sm flex-1 font-mono"
            />
          </div>
        </div>

        {/* Stroke */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Stroke Color</Label>
            <div
              className="w-full h-8 rounded border border-slate-300 cursor-pointer overflow-hidden"
              style={{ backgroundColor: element.stroke || '#000000' }}
            >
              <input
                type="color"
                value={element.stroke || '#000000'}
                onChange={(e) => onUpdate({ stroke: e.target.value })}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Stroke Width</Label>
            <Input
              type="number"
              min={0}
              max={50}
              value={element.strokeWidth || 0}
              onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Corner Radius (rectangles) */}
        {element.shapeType === 'rectangle' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-slate-600">Corner Radius</Label>
              <span className="text-xs text-slate-500">{element.cornerRadius || 0}px</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[element.cornerRadius || 0]}
              onValueChange={([v]) => onUpdate({ cornerRadius: v })}
            />
          </div>
        )}

        {/* Sides (polygon/star) */}
        {(element.shapeType === 'polygon' || element.shapeType === 'star') && (
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">Sides</Label>
            <Input
              type="number"
              min={3}
              max={20}
              value={element.sides || 6}
              onChange={(e) => onUpdate({ sides: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Image Properties ────────────────────────────────── */
function ImageProperties({
  element,
  onUpdate,
}: {
  element: ImageElement;
  onUpdate: (u: Partial<ImageElement>) => void;
}) {
  const filters = element.filters ?? {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
  };

  const setFilter = (key: string, value: number) => {
    onUpdate({ filters: { ...filters, [key]: value } });
  };

  return (
    <section>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Image Adjustments
      </h4>
      <div className="space-y-3">
        {([
          { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1 },
          { key: 'contrast',   label: 'Contrast',   min: 0, max: 200, step: 1 },
          { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1 },
          { key: 'blur',       label: 'Blur',       min: 0, max: 40,  step: 1 },
          { key: 'grayscale',  label: 'Grayscale',  min: 0, max: 100, step: 1 },
          { key: 'sepia',      label: 'Sepia',      min: 0, max: 100, step: 1 },
          { key: 'hueRotate',  label: 'Hue Rotate', min: 0, max: 360, step: 1 },
        ] as const).map(({ key, label, min, max, step }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-slate-600">{label}</Label>
              <span className="text-xs text-slate-500">{(filters as any)[key]}</span>
            </div>
            <Slider
              min={min}
              max={max}
              step={step}
              value={[(filters as any)[key]]}
              onValueChange={([v]) => setFilter(key, v)}
            />
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() =>
            onUpdate({
              filters: {
                brightness: 100,
                contrast: 100,
                saturation: 100,
                blur: 0,
                grayscale: 0,
                sepia: 0,
                hueRotate: 0,
              },
            })
          }
        >
          Reset Filters
        </Button>
      </div>
    </section>
  );
}

/* ─── Shadow Controls ─────────────────────────────────── */
function ShadowControls({
  element,
  onUpdate,
}: {
  element: CanvasElement;
  onUpdate: (u: Partial<CanvasElement>) => void;
}) {
  const shadow = element.shadow ?? {
    enabled: false,
    color: '#00000040',
    blur: 10,
    offsetX: 4,
    offsetY: 4,
  };

  return (
    <>
      <Separator />
      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Shadow
          </h4>
          <Button
            variant={shadow.enabled ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => onUpdate({ shadow: { ...shadow, enabled: !shadow.enabled } })}
          >
            {shadow.enabled ? 'On' : 'Off'}
          </Button>
        </div>

        {shadow.enabled && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Shadow Color</Label>
              <div className="flex gap-2 items-center">
                <div
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: shadow.color }}
                >
                  <input
                    type="color"
                    value={shadow.color.slice(0, 7)}
                    onChange={(e) =>
                      onUpdate({ shadow: { ...shadow, color: e.target.value } })
                    }
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  value={shadow.color}
                  onChange={(e) =>
                    onUpdate({ shadow: { ...shadow, color: e.target.value } })
                  }
                  className="h-8 text-sm flex-1 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'blur', label: 'Blur' },
                { key: 'offsetX', label: 'Offset X' },
                { key: 'offsetY', label: 'Offset Y' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs text-slate-600 mb-1 block">{label}</Label>
                  <Input
                    type="number"
                    value={(shadow as any)[key]}
                    onChange={(e) =>
                      onUpdate({ shadow: { ...shadow, [key]: Number(e.target.value) } })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default PropertiesPanel;
