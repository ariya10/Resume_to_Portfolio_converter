import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Zap, ChevronDown, MoveRight, RotateCw, Maximize2, Eye } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { cn } from '@/lib/utils';
import type { CanvasElement, AnimationType } from '@/types/canvas';

const ENTRANCE_ANIMATIONS: { type: AnimationType; label: string; icon: React.ElementType }[] = [
  { type: 'fadeIn',   label: 'Fade In',    icon: Eye },
  { type: 'slideIn',  label: 'Slide In',   icon: MoveRight },
  { type: 'scaleIn',  label: 'Scale In',   icon: Maximize2 },
  { type: 'rotateIn', label: 'Rotate In',  icon: RotateCw },
];

const EXIT_ANIMATIONS: { type: AnimationType; label: string; icon: React.ElementType }[] = [
  { type: 'fadeOut',   label: 'Fade Out',   icon: Eye },
  { type: 'slideOut',  label: 'Slide Out',  icon: MoveRight },
  { type: 'scaleOut',  label: 'Scale Out',  icon: Maximize2 },
  { type: 'rotateOut', label: 'Rotate Out', icon: RotateCw },
];

const EASINGS = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'spring'] as const;

interface AnimationsPanelProps {
  selectedElements: CanvasElement[];
}

export function AnimationsPanel({ selectedElements }: AnimationsPanelProps) {
  const { updateElement } = useEditorStore();

  if (selectedElements.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <Zap className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-600 mb-1">No element selected</p>
        <p className="text-xs text-slate-400">Select an element to add animations.</p>
      </div>
    );
  }

  const element = selectedElements[0];
  const anim = element.animation ?? {
    type: 'fadeIn' as AnimationType,
    duration: 500,
    delay: 0,
    easing: 'easeOut' as const,
    direction: 'up' as const,
    playOnLoad: true,
  };

  const setAnim = (updates: Partial<typeof anim>) => {
    updateElement(element.id, { animation: { ...anim, ...updates } });
  };

  const clearAnimation = () => {
    updateElement(element.id, { animation: undefined });
  };

  const currentEntrance = ENTRANCE_ANIMATIONS.find((a) => a.type === anim.type);
  const currentExit = EXIT_ANIMATIONS.find((a) => a.type === anim.type);
  const isEntranceSelected = !!currentEntrance;
  const isExitSelected = !!currentExit;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">

        {/* Entrance Animations */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Entrance
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {ENTRANCE_ANIMATIONS.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={anim.type === type ? 'default' : 'outline'}
                className="h-16 flex flex-col items-center justify-center gap-1.5 text-xs"
                onClick={() => setAnim({ type })}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        {/* Exit Animations */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Exit
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {EXIT_ANIMATIONS.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={anim.type === type ? 'default' : 'outline'}
                className="h-16 flex flex-col items-center justify-center gap-1.5 text-xs"
                onClick={() => setAnim({ type })}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        {/* Timing Controls */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Timing
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-slate-600">Duration</Label>
                <span className="text-xs text-slate-500">{anim.duration}ms</span>
              </div>
              <Slider
                min={100}
                max={3000}
                step={50}
                value={[anim.duration]}
                onValueChange={([v]) => setAnim({ duration: v })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-slate-600">Delay</Label>
                <span className="text-xs text-slate-500">{anim.delay}ms</span>
              </div>
              <Slider
                min={0}
                max={2000}
                step={50}
                value={[anim.delay]}
                onValueChange={([v]) => setAnim({ delay: v })}
              />
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Easing</Label>
              <Select value={anim.easing} onValueChange={(v) => setAnim({ easing: v as any })}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EASINGS.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e.replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Direction (for slide) */}
            {(anim.type === 'slideIn' || anim.type === 'slideOut') && (
              <div>
                <Label className="text-xs text-slate-600 mb-1 block">Direction</Label>
                <div className="grid grid-cols-4 gap-1">
                  {(['up', 'down', 'left', 'right'] as const).map((dir) => (
                    <Button
                      key={dir}
                      variant={anim.direction === dir ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 text-xs capitalize"
                      onClick={() => setAnim({ direction: dir })}
                    >
                      {dir}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Preview & Clear */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Play className="w-3.5 h-3.5" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={clearAnimation}
          >
            Remove
          </Button>
        </div>

      </div>
    </ScrollArea>
  );
}

export default AnimationsPanel;
