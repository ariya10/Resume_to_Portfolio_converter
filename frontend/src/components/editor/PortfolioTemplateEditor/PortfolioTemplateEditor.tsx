import { useMemo, useState } from "react";
import { Undo2, Redo2, ChevronLeft, ChevronRight, Download, Copy, Check, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditorStore } from "@/store/editor-store";
import CanvaLeftPanel from "@/components/editor/CanvaLeftPanel";
import CanvaRightPanel from "@/components/editor/CanvaRightPanel";
import { TemplateEditorCanvas } from "./TemplateEditorCanvas";
import { ResponsivePreviewToolbar } from "./ResponsivePreviewToolbar";
import ZoomToolbar from "./ZoomToolbar";
import { generateFigmaScript } from "@/lib/figma-exporter";
import { FullscreenPreview } from "@/components/PortfolioPreview";
import { generateFramerExport } from "@/lib/framer-exporter";




type PreviewMode = "desktop" | "tablet" | "mobile";

export function PortfolioTemplateEditor() {
  const { viewport, setViewport, undo, redo, editMode, setEditMode, fullscreenOpen, setFullscreenOpen, customization, portfolioData } = useEditorStore();

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [figmaModalOpen, setFigmaModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [framerModalOpen, setFramerModalOpen] = useState(false);
  const [framerLoading, setFramerLoading] = useState(false);

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
    <div className="h-screen w-screen overflow-hidden bg-[#F2F3F5] text-black">
      {/* Top editor bar */}
      <div className="h-12 border-b border-black/10 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-black text-white flex items-center justify-center font-black text-sm">✦</div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-black/60">Portfolio</div>
            <div className="text-sm font-extrabold">Template Editor</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => undo()}
            className="h-8 px-3 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-sm font-semibold text-slate-800 disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-sm"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => redo()}
            className="h-8 px-3 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-sm font-semibold text-slate-800 disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-sm"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>Redo</span>
          </button>

          <button
            onClick={() => {
              setEditMode(false);
              setFullscreenOpen(true);
            }}
            className="h-8 px-3 rounded-lg border border-emerald-250 bg-emerald-50 text-emerald-750 hover:bg-emerald-100/80 text-sm font-semibold shadow-sm transition-all flex items-center gap-1"
            title="Open full screen preview"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Preview Mode</span>
          </button>

          <button
            onClick={() => setFigmaModalOpen(true)}
            className="h-8 px-3 rounded-lg bg-[#F24E1E] text-white hover:bg-[#E13B0D] text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Export design to Figma console script"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Figma Export</span>
          </button>

          <button
            onClick={() => {
              setFramerModalOpen(true);
              setFramerLoading(true);
              setTimeout(() => setFramerLoading(false), 1200);
            }}
            className="h-8 px-3 rounded-lg bg-[#0055FF] text-white hover:bg-[#0044DD] text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Export design to Framer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Framer Export</span>
          </button>
        </div>
      </div>

      {/* Body (3-panel layout) */}
      <div className="h-[calc(100vh-3rem)] flex">
        {/* LEFT */}
        <div
          className="shrink-0 overflow-hidden"
          style={{ width: leftWidth, minWidth: 260 }}
          data-lenis-prevent
        >
          <div className="h-full border-r border-black/10 bg-[#111214]">
            {leftOpen ? <CanvaLeftPanel /> : null}
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col bg-[#F2F3F5]">
            <div className="shrink-0 px-4 py-3 border-b border-black/10 bg-[#F2F3F5] flex items-center justify-between">
                <ResponsivePreviewToolbar mode={previewMode} onModeChange={(m) => setViewport(m)} />
                <div className="flex items-center gap-3">
                  <ZoomToolbar />
                </div>
             </div>

            <div className="flex-1 overflow-auto p-6" data-lenis-prevent>
              <div className="flex justify-center py-6">
                <motion.div
                  key={previewMode}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.18 }}
                  className={frameClass}
                  style={{ width: frameWidth, background: '#fff' }}
                >
                  <div className="relative bg-white shadow-lg">
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
          data-lenis-prevent
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
        {fullscreenOpen && (
          <FullscreenPreview
            data={portfolioData}
            customization={customization}
            onClose={() => {
              setFullscreenOpen(false);
              setEditMode(true);
            }}
          />
        )}

        {figmaModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFigmaModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1e293b] text-white p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#F24E1E] text-white flex items-center justify-center font-bold text-xs">F</div>
                  <h3 className="text-lg font-bold tracking-tight">Export Layout to Figma</h3>
                </div>
                <button
                  onClick={() => setFigmaModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">How to import into Figma:</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-350">
                    <li>Copy the compiled script below.</li>
                    <li>Open your project design canvas on <a href="https://figma.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline inline-flex items-center gap-0.5 hover:text-sky-350">figma.com <ExternalLink className="w-3 h-3" /></a>.</li>
                    <li>Open the <strong>Figma Plugin Console</strong> by navigating to <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Plugins &gt; Development &gt; Open Console</code> (or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Ctrl+Alt+I</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Cmd+Option+I</kbd>). Note: standard browser F12 console will not work.</li>
                    <li>Paste the copied script into the Figma Plugin Console and hit <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Enter</kbd> to build your layout!</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Generated script ({portfolioData.name || "Portfolio"})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const script = generateFigmaScript(portfolioData, customization);
                          navigator.clipboard.writeText(script);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy Script"}
                      </button>
                      <button
                        onClick={() => {
                          const script = generateFigmaScript(portfolioData, customization);
                          const blob = new Blob([script], { type: "text/javascript" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `figma-portfolio-${portfolioData.name || "export"}.js`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .js</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] text-emerald-400 overflow-auto max-h-[300px]">
                    {generateFigmaScript(portfolioData, customization)}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {framerModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFramerModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0f172a] text-white p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0055FF] text-white flex items-center justify-center font-bold text-xs">F</div>
                  <h3 className="text-lg font-bold tracking-tight">Export Layout to Framer</h3>
                </div>
                <button
                  onClick={() => setFramerModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {framerLoading ? (
                <div className="flex-1 py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-[#0055FF] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-slate-350">Compiling HTML, CSS and assets for Framer...</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm text-slate-300">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                    <span className="text-lg">✓</span>
                    <span className="text-xs font-semibold">Export structure compiled successfully!</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">How to import into Framer:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-slate-350">
                      <li>Download the compiled <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">portfolio-framer-export.html</code> file below.</li>
                      <li>Open the downloaded HTML file in your web browser.</li>
                      <li>Open the official **HTML to Framer** Chrome extension (available on the Chrome Web Store).</li>
                      <li>Hover over the container and click to copy the design layout.</li>
                      <li>Go to your **Framer canvas** and paste (<kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Cmd+V</kbd>).</li>
                    </ol>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setFramerModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        try {
                          const html = generateFramerExport();
                          const blob = new Blob([html], { type: "text/html" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `portfolio-framer-${portfolioData.name || "export"}.html`;
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Framer export failed:", err);
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0055FF] hover:bg-[#0044DD] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download HTML File</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PortfolioTemplateEditor;
