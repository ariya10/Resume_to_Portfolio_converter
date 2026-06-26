import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";

type PreviewMode = "desktop" | "tablet" | "mobile";

export function ResponsivePreviewToolbar({
  mode,
  onModeChange,
}: {
  mode: PreviewMode;
  onModeChange: (m: PreviewMode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1.5">Viewport</div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          className={`h-8 px-2.5 font-bold text-[11px] rounded-lg transition-all ${
            mode === "desktop"
              ? "border-slate-800 bg-slate-800 text-white shadow-sm hover:bg-slate-850 hover:text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-850"
          }`}
          onClick={() => onModeChange("desktop")}
        >
          <Monitor className="w-3.5 h-3.5 mr-1.5" />
          Desktop
        </Button>

        <Button
          variant="outline"
          className={`h-8 px-2.5 font-bold text-[11px] rounded-lg transition-all ${
            mode === "tablet"
              ? "border-slate-800 bg-slate-800 text-white shadow-sm hover:bg-slate-850 hover:text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-850"
          }`}
          onClick={() => onModeChange("tablet")}
        >
          <Tablet className="w-3.5 h-3.5 mr-1.5" />
          Tablet
        </Button>

        <Button
          variant="outline"
          className={`h-8 px-2.5 font-bold text-[11px] rounded-lg transition-all ${
            mode === "mobile"
              ? "border-slate-800 bg-slate-800 text-white shadow-sm hover:bg-slate-850 hover:text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-850"
          }`}
          onClick={() => onModeChange("mobile")}
        >
          <Smartphone className="w-3.5 h-3.5 mr-1.5" />
          Mobile
        </Button>
      </div>
    </div>
  );
}

