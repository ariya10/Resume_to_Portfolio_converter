import { useMemo, useState } from "react";
import { Undo2, Redo2, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditorStore } from "@/store/editor-store";
import CanvaLeftPanel from "@/components/editor/CanvaLeftPanel";
import CanvaRightPanel from "@/components/editor/CanvaRightPanel";
import { TemplateEditorCanvas } from "./TemplateEditorCanvas";
import { ResponsivePreviewToolbar } from "./ResponsivePreviewToolbar";

type PreviewMode = "desktop" | "tablet" | "mobile";

export function PortfolioTemplateEditor() {
  const { viewport, setViewport, undo, redo, editMode, setEditMode, fullscreenOpen } = useEditorStore();

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const previewMode = (viewport as PreviewMode) || "desktop";

  const frameWidth = useMemo(() => {
    switch (previewMode) {
      case "mobile":
        return 375;
      case "tablet":
        return 768;
      case "desktop":
      default:
        return 1040;
    }
  }, [previewMode]);

  const frameClass = useMemo(() => {
    switch (previewMode) {
      case "mobile":
        return "rounded-[28px] border border-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.30)]";
      case "tablet":
        return "rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.22)]";
      case "desktop":
      default:
        return "rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.16)]";
    }
  }, [previewMode]);

  const leftWidth = leftOpen ? 320 : 0;
  const rightWidth = rightOpen ? 320 : 0;

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Top editor bar */}
      <div className="h-14 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center font-black">
            ✦
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-white/60">Portfolio</div>
            <div className="text-sm font-black">Template Editor</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => undo()}
            className="h-9 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold disabled:opacity-40"
            title="Undo"
          >
            <Undo2 className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Undo
          </button>
          <button
            onClick={() => redo()}
            className="h-9 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold disabled:opacity-40"
            title="Redo"
          >
            <Redo2 className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Redo
          </button>

          <button
            onClick={() => setEditMode(!editMode)}
            className="h-9 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold"
            title="Toggle edit mode"
          >
            {editMode ? "Editing: ON" : "Editing: OFF"}
          </button>
        </div>
      </div>

      {/* Body (3-panel layout) */}
      <div className="h-[calc(100vh-3.5rem)] flex">
        {/* LEFT */}
        <div
          className="shrink-0 overflow-hidden"
          style={{ width: leftWidth }}
        >
          <div className="h-full border-r border-white/10 bg-black/10">
            {leftOpen ? <CanvaLeftPanel /> : null}
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col bg-slate-950">
            <div className="shrink-0 px-4 py-3 border-b border-white/10 bg-black/25">
              <ResponsivePreviewToolbar mode={previewMode} onModeChange={(m) => setViewport(m)} />
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-center">
                <motion.div
                  key={previewMode}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.18 }}
                  className={frameClass}
                  style={{ width: frameWidth }}
                >
                  <div className="relative bg-white overflow-y-auto max-h-[70vh]">
                    <TemplateEditorCanvas />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Collapse buttons (over center for usability) */}
          {!leftOpen && (
            <button
              onClick={() => setLeftOpen(true)}
              className="fixed left-2 top-[82px] z-[60] h-10 w-10 rounded-xl bg-black/40 border border-white/15 hover:bg-black/55 flex items-center justify-center"
              aria-label="Open left panel"
              title="Open left panel"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {!rightOpen && (
            <button
              onClick={() => setRightOpen(true)}
              className="fixed right-2 top-[82px] z-[60] h-10 w-10 rounded-xl bg-black/40 border border-white/15 hover:bg-black/55 flex items-center justify-center"
              aria-label="Open right panel"
              title="Open right panel"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div
          className="shrink-0 overflow-hidden"
          style={{ width: rightWidth }}
        >
          <div className="h-full border-l border-white/10 bg-black/10">
            {rightOpen ? <CanvaRightPanel /> : null}
          </div>
        </div>

        {/* Panel toggle arrows (when open) */}
        {leftOpen && (
          <button
            onClick={() => setLeftOpen(false)}
            className="fixed left-[320px] top-[82px] z-[60] -translate-x-1/2 h-10 w-10 rounded-xl bg-black/40 border border-white/15 hover:bg-black/55 flex items-center justify-center"
            aria-label="Close left panel"
            title="Close left panel"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {rightOpen && (
          <button
            onClick={() => setRightOpen(false)}
            className="fixed right-[320px] top-[82px] z-[60] -translate-x-1/2 h-10 w-10 rounded-xl bg-black/40 border border-white/15 hover:bg-black/55 flex items-center justify-center"
            aria-label="Close right panel"
            title="Close right panel"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {fullscreenOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default PortfolioTemplateEditor;
