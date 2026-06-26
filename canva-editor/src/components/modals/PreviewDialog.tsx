import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { useEditorStore, useSortedElements } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_SIZES: Record<DeviceMode, { width: number; height: number; label: string }> = {
  desktop: { width: 1920, height: 1080, label: '1920 × 1080' },
  tablet:  { width: 1024, height: 768,  label: '1024 × 768'  },
  mobile:  { width: 390,  height: 844,  label: '390 × 844'   },
};

export function PreviewDialog({ open, onOpenChange }: PreviewDialogProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const { canvas } = useEditorStore();
  const elements = useSortedElements();

  const deviceSize = DEVICE_SIZES[device];

  // Scale canvas to fit inside the dialog
  const MAX_PREVIEW_W = device === 'desktop' ? 900 : device === 'tablet' ? 600 : 280;
  const MAX_PREVIEW_H = 520;
  const scaleX = MAX_PREVIEW_W / canvas.width;
  const scaleY = MAX_PREVIEW_H / canvas.height;
  const previewScale = Math.min(scaleX, scaleY, 1);
  const previewW = canvas.width * previewScale;
  const previewH = canvas.height * previewScale;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-slate-50">
          <DialogTitle className="text-sm font-semibold">Preview</DialogTitle>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-white border rounded-lg p-1">
            {(
              [
                { mode: 'desktop' as DeviceMode, icon: Monitor  },
                { mode: 'tablet'  as DeviceMode, icon: Tablet   },
                { mode: 'mobile'  as DeviceMode, icon: Smartphone },
              ] as const
            ).map(({ mode, icon: Icon }) => (
              <Button
                key={mode}
                variant={device === mode ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setDevice(mode)}
                title={mode}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Device Label */}
        <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 border-b text-xs text-slate-500">
          <span className="font-medium capitalize">{device}</span>
          <span>·</span>
          <span>{deviceSize.label}</span>
          <span>·</span>
          <span>{Math.round(previewScale * 100)}% scale</span>
        </div>

        {/* Preview Area */}
        <div className="flex items-center justify-center bg-slate-200 p-8 min-h-[580px]">
          {/* Device frame for mobile/tablet */}
          <div
            className={cn(
              'relative shadow-2xl overflow-hidden',
              device === 'mobile'  && 'rounded-[2.5rem] ring-4 ring-slate-700',
              device === 'tablet'  && 'rounded-[1.5rem] ring-4 ring-slate-700',
              device === 'desktop' && 'rounded-lg ring-1 ring-slate-300'
            )}
            style={{ width: previewW, height: previewH }}
          >
            {/* Canvas rendered as scaled HTML */}
            <div
              style={{
                width: canvas.width,
                height: canvas.height,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
                backgroundColor: canvas.background,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Render elements as HTML for preview */}
              {elements.map((el) => {
                if (!el.visible) return null;

                if (el.type === 'text') {
                  const t = el as any;
                  return (
                    <div
                      key={el.id}
                      style={{
                        position: 'absolute',
                        left: t.x,
                        top: t.y,
                        width: t.width,
                        height: t.height,
                        transform: `rotate(${t.rotation}deg)`,
                        opacity: t.opacity,
                        fontFamily: t.fontFamily,
                        fontSize: t.fontSize,
                        fontWeight: t.fontWeight,
                        fontStyle: t.fontStyle,
                        textDecoration: t.textDecoration,
                        textAlign: t.textAlign,
                        lineHeight: t.lineHeight,
                        letterSpacing: t.letterSpacing,
                        color: t.fill,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        pointerEvents: 'none',
                        boxShadow: t.shadow?.enabled
                          ? `${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color}`
                          : undefined,
                      }}
                    >
                      {t.content}
                    </div>
                  );
                }

                if (el.type === 'image') {
                  const img = el as any;
                  return (
                    <img
                      key={el.id}
                      src={img.src}
                      alt={img.name}
                      style={{
                        position: 'absolute',
                        left: img.x,
                        top: img.y,
                        width: img.width,
                        height: img.height,
                        transform: `rotate(${img.rotation}deg)`,
                        opacity: img.opacity,
                        objectFit: 'fill',
                        pointerEvents: 'none',
                        boxShadow: img.shadow?.enabled
                          ? `${img.shadow.offsetX}px ${img.shadow.offsetY}px ${img.shadow.blur}px ${img.shadow.color}`
                          : undefined,
                        filter: img.filters
                          ? [
                              `brightness(${img.filters.brightness}%)`,
                              `contrast(${img.filters.contrast}%)`,
                              `saturate(${img.filters.saturation}%)`,
                              img.filters.blur > 0 ? `blur(${img.filters.blur}px)` : '',
                              img.filters.grayscale > 0 ? `grayscale(${img.filters.grayscale}%)` : '',
                              img.filters.sepia > 0 ? `sepia(${img.filters.sepia}%)` : '',
                              img.filters.hueRotate > 0 ? `hue-rotate(${img.filters.hueRotate}deg)` : '',
                            ]
                              .filter(Boolean)
                              .join(' ')
                          : undefined,
                      }}
                    />
                  );
                }

                if (el.type === 'shape') {
                  const s = el as any;
                  let shapeStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: s.x,
                    top: s.y,
                    width: s.width,
                    height: s.height,
                    transform: `rotate(${s.rotation}deg)`,
                    opacity: s.opacity,
                    backgroundColor: s.fill,
                    border: s.stroke ? `${s.strokeWidth || 1}px solid ${s.stroke}` : undefined,
                    boxSizing: 'border-box',
                    pointerEvents: 'none',
                    boxShadow: s.shadow?.enabled
                      ? `${s.shadow.offsetX}px ${s.shadow.offsetY}px ${s.shadow.blur}px ${s.shadow.color}`
                      : undefined,
                  };

                  if (s.shapeType === 'rectangle') {
                    shapeStyle.borderRadius = s.cornerRadius ? `${s.cornerRadius}px` : undefined;
                  } else if (s.shapeType === 'circle' || s.shapeType === 'ellipse') {
                    shapeStyle.borderRadius = '50%';
                  }

                  return <div key={el.id} style={shapeStyle} />;
                }

                return null;
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t bg-slate-50">
          <p className="text-xs text-slate-500">
            Canvas: {canvas.width} × {canvas.height} px
          </p>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialog;
