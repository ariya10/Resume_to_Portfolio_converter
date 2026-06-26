import { Plus, Minus, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";

export default function ZoomToolbar() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);

  const dec = () => setZoom(Math.max(0.25, Math.round((zoom - 0.25) * 100) / 100));
  const inc = () => setZoom(Math.min(3, Math.round((zoom + 0.25) * 100) / 100));
  const fit = () => setZoom(1);
  const pct = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={dec} className="h-8 px-2">
        <Minus className="w-3 h-3" />
      </Button>
      <div className="text-[13px] font-medium px-2">{pct}%</div>
      <Button variant="outline" size="sm" onClick={inc} className="h-8 px-2">
        <Plus className="w-3 h-3" />
      </Button>
      <Button variant="outline" size="sm" onClick={fit} className="h-8 px-2 ml-2">
        Fit
      </Button>
    </div>
  );
}
