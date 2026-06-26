import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/store/editor-store";
import StylingPanel from "@/components/editor/StylingPanel";

export default function CanvaRightPanel() {
  const { rightPanelTab } = useEditorStore();

  return (
    <div className="h-full flex flex-col bg-[#0F1113] border-l border-black/20 text-slate-200">
      <div className="px-3 py-3 border-b border-black/20 bg-transparent">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-black uppercase tracking-widest text-slate-400">
              Inspector
            </div>
            <div className="text-[16px] font-black text-white">Design</div>
          </div>
          <div className="text-[12px] font-black text-slate-400" aria-hidden>
            {/* reserved */}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <StylingPanel />
        </div>
      </ScrollArea>
    </div>
  );
}
