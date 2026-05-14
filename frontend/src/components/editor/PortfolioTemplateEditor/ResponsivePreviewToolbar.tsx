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
      <div className="text-[11px] font-black uppercase tracking-widest text-white/60 mr-2">Preview</div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className={`h-9 px-3 border-2 font-black text-[12px] ${
            mode === "desktop"
              ? "border-white bg-white/10 text-white"
              : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
          onClick={() => onModeChange("desktop")}
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>

        <Button
          variant="outline"
          className={`h-9 px-3 border-2 font-black text-[12px] ${
            mode === "tablet"
              ? "border-white bg-white/10 text-white"
              : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
          onClick={() => onModeChange("tablet")}
        >
          <Tablet className="w-4 h-4 mr-2" />
          Tablet
        </Button>

        <Button
          variant="outline"
          className={`h-9 px-3 border-2 font-black text-[12px] ${
            mode === "mobile"
              ? "border-white bg-white/10 text-white"
              : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
          onClick={() => onModeChange("mobile")}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile
        </Button>
      </div>
    </div>
  );
}
