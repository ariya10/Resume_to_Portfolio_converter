import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2, FileImage, FileText, Code2 } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { exportToPNG } from '@/lib/export/exportPNG';
import { exportToPDF } from '@/lib/export/exportPDF';
import { exportToHTML } from '@/lib/export/exportHTML';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (blob: Blob, format: string) => void;
}

type ExportFormat = 'png' | 'jpg' | 'pdf' | 'html';

export function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
  const { canvas, elements, elementOrder } = useEditorStore();

  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(90);
  const [transparent, setTransparent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sortedElements = elementOrder.map((id) => elements[id]).filter(Boolean);

  const handleExport = async () => {
    setLoading(true);
    try {
      let blob: Blob;

      if (format === 'png' || format === 'jpg') {
        blob = await exportToPNG({
          elements: sortedElements,
          canvas,
          scale,
          quality: format === 'jpg' ? quality / 100 : 1,
          format: format === 'jpg' ? 'jpeg' : 'png',
          transparentBackground: transparent && format === 'png',
        });
      } else if (format === 'pdf') {
        blob = await exportToPDF({ elements: sortedElements, canvas, scale });
      } else {
        blob = await exportToHTML({ elements: sortedElements, canvas });
      }

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `design.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onExport(blob, format);
      onOpenChange(false);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const outputW = Math.round(canvas.width * scale);
  const outputH = Math.round(canvas.height * scale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Choose format and settings for your export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Format</Label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { value: 'png',  label: 'PNG',  icon: FileImage, desc: 'Lossless' },
                  { value: 'jpg',  label: 'JPG',  icon: FileImage, desc: 'Smaller' },
                  { value: 'pdf',  label: 'PDF',  icon: FileText,  desc: 'Print-ready' },
                  { value: 'html', label: 'HTML', icon: Code2,     desc: 'Web-ready' },
                ] as const
              ).map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    format === value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${format === value ? 'text-blue-600' : 'text-slate-500'}`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      format === value ? 'text-blue-600' : 'text-slate-700'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[10px] text-slate-400">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scale (PNG / JPG / PDF) */}
          {(format === 'png' || format === 'jpg' || format === 'pdf') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Resolution</Label>
                <span className="text-xs text-slate-500">
                  {outputW} × {outputH} px
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <Button
                    key={s}
                    variant={scale === s ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setScale(s)}
                  >
                    {s}×
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* JPG Quality */}
          {format === 'jpg' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Quality</Label>
                <span className="text-xs text-slate-500">{quality}%</span>
              </div>
              <Slider
                min={10}
                max={100}
                step={5}
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
              />
            </div>
          )}

          {/* Transparent Background (PNG only) */}
          {format === 'png' && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Transparent Background</Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Remove canvas background color
                </p>
              </div>
              <Switch checked={transparent} onCheckedChange={setTransparent} />
            </div>
          )}

          {/* File Size Estimate */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <div className="flex justify-between mb-1">
              <span>Output size</span>
              <span className="font-mono font-medium">{outputW} × {outputH}</span>
            </div>
            <div className="flex justify-between">
              <span>Elements</span>
              <span className="font-medium">{elementOrder.length}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button className="flex-1 gap-2" onClick={handleExport} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {loading ? 'Exporting…' : `Export ${format.toUpperCase()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExportDialog;
