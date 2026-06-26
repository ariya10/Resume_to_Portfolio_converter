import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Grid3X3, Magnet, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';

const CANVAS_PRESETS = [
  { label: 'Presentation (16:9)',  width: 1920, height: 1080 },
  { label: 'Instagram Post',       width: 1080, height: 1080 },
  { label: 'Instagram Story',      width: 1080, height: 1920 },
  { label: 'Twitter Post',         width: 1600, height: 900  },
  { label: 'Facebook Cover',       width: 820,  height: 312  },
  { label: 'LinkedIn Banner',      width: 1584, height: 396  },
  { label: 'YouTube Thumbnail',    width: 1280, height: 720  },
  { label: 'A4 Portrait',          width: 2480, height: 3508 },
  { label: 'A4 Landscape',         width: 3508, height: 2480 },
  { label: 'Business Card',        width: 1050, height: 600  },
  { label: 'Custom',               width: 0,    height: 0    },
];

const PALETTE_PRESETS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#64748b', '#f1f5f9', '#1e293b', '#fef3c7', '#dbeafe',
];

export function AppearancePanel() {
  const { canvas, setCanvasSize, setBackground, toggleGrid } = useEditorStore();
  const [customW, setCustomW] = useState(String(canvas.width));
  const [customH, setCustomH] = useState(String(canvas.height));
  const [selectedPreset, setSelectedPreset] = useState('Custom');

  const handlePresetChange = (label: string) => {
    const preset = CANVAS_PRESETS.find((p) => p.label === label);
    if (!preset) return;
    setSelectedPreset(label);
    if (preset.width && preset.height) {
      setCustomW(String(preset.width));
      setCustomH(String(preset.height));
      setCanvasSize(preset.width, preset.height);
    }
  };

  const handleApplyCustom = () => {
    const w = parseInt(customW, 10);
    const h = parseInt(customH, 10);
    if (w > 0 && h > 0) {
      setCanvasSize(w, h);
      setSelectedPreset('Custom');
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">

        {/* Canvas Size */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Canvas Size
          </h4>

          {/* Preset Selector */}
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger className="h-8 text-sm mb-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CANVAS_PRESETS.map((p) => (
                <SelectItem key={p.label} value={p.label}>
                  {p.label}
                  {p.width > 0 && (
                    <span className="ml-2 text-xs text-slate-400">
                      {p.width} × {p.height}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom WxH */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Width (px)</Label>
              <Input
                type="number"
                min={1}
                value={customW}
                onChange={(e) => setCustomW(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Height (px)</Label>
              <Input
                type="number"
                min={1}
                value={customH}
                onChange={(e) => setCustomH(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleApplyCustom}
          >
            Apply Size
          </Button>

          {/* Device Quick Sizes */}
          <div className="mt-3 flex gap-2">
            {[
              { icon: Monitor,    label: '1920×1080', w: 1920, h: 1080 },
              { icon: Tablet,     label: '1024×768',  w: 1024, h: 768  },
              { icon: Smartphone, label: '390×844',   w: 390,  h: 844  },
            ].map(({ icon: Icon, label, w, h }) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                className="flex-1 flex flex-col items-center gap-1 h-14 text-[10px]"
                onClick={() => { setCanvasSize(w, h); setCustomW(String(w)); setCustomH(String(h)); }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        <Separator />

        {/* Background Color */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Background
          </h4>

          {/* Color Picker Row */}
          <div className="flex gap-2 items-center mb-3">
            <div
              className="w-9 h-9 rounded border border-slate-300 cursor-pointer overflow-hidden flex-shrink-0"
              style={{ backgroundColor: canvas.background }}
            >
              <input
                type="color"
                value={canvas.background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Input
              value={canvas.background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="#ffffff"
              className="h-8 text-sm font-mono flex-1"
            />
          </div>

          {/* Palette */}
          <div className="grid grid-cols-5 gap-1.5">
            {PALETTE_PRESETS.map((color) => (
              <button
                key={color}
                className="w-full aspect-square rounded-md border border-slate-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setBackground(color)}
                title={color}
              />
            ))}
          </div>

          {/* Transparent Option */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => setBackground('transparent')}
          >
            Transparent
          </Button>
        </section>

        <Separator />

        {/* Grid & Snapping */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Grid & Snapping
          </h4>
          <div className="space-y-3">
            {/* Show Grid */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-slate-500" />
                <Label className="text-sm text-slate-700 cursor-pointer">Show Grid</Label>
              </div>
              <Switch
                checked={canvas.gridEnabled}
                onCheckedChange={() => toggleGrid()}
              />
            </div>

            {/* Snap to Grid */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Magnet className="w-4 h-4 text-slate-500" />
                <Label className="text-sm text-slate-700 cursor-pointer">Snap to Grid</Label>
              </div>
              <Switch
                checked={canvas.snapToGrid}
                onCheckedChange={(v) =>
                  useEditorStore.setState((s) => ({
                    canvas: { ...s.canvas, snapToGrid: v },
                  }))
                }
              />
            </div>

            {/* Snap to Objects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Magnet className="w-4 h-4 text-slate-500" />
                <Label className="text-sm text-slate-700 cursor-pointer">Snap to Objects</Label>
              </div>
              <Switch
                checked={canvas.snapToObjects}
                onCheckedChange={(v) =>
                  useEditorStore.setState((s) => ({
                    canvas: { ...s.canvas, snapToObjects: v },
                  }))
                }
              />
            </div>

            {/* Grid Size */}
            {canvas.gridEnabled && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-slate-600">Grid Size</Label>
                  <span className="text-xs text-slate-500">{canvas.gridSize}px</span>
                </div>
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={[canvas.gridSize]}
                  onValueChange={([v]) =>
                    useEditorStore.setState((s) => ({
                      canvas: { ...s.canvas, gridSize: v },
                    }))
                  }
                />
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* Canvas Info */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Canvas Info
          </h4>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Dimensions</span>
              <span className="font-mono">{canvas.width} × {canvas.height} px</span>
            </div>
            <div className="flex justify-between">
              <span>Aspect Ratio</span>
              <span className="font-mono">
                {(canvas.width / canvas.height).toFixed(2)}:1
              </span>
            </div>
            <div className="flex justify-between">
              <span>Background</span>
              <span className="font-mono">{canvas.background}</span>
            </div>
          </div>
        </section>

      </div>
    </ScrollArea>
  );
}

export default AppearancePanel;
