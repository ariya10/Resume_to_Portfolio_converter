import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/store/editor-store";
import StylingPanel from "@/components/editor/StylingPanel";

export default function CanvaRightPanel() {
  const { rightPanelTab } = useEditorStore();

  return (
    <div className="h-full flex flex-col bg-[#F7F7F7] border-l border-black/10">
      <div className="px-3 py-3 border-b border-black/10 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-black uppercase tracking-widest text-black/60">
              Inspector
            </div>
            <div className="text-[16px] font-black text-black">Design</div>
          </div>
          <div className="text-[12px] font-black text-black/60" aria-hidden>
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
