import React, { useEffect, useState, useRef } from "react";
import useEditorStore from "@/store/editor-store";

function parseTranslate(transform: string | null) {
  if (!transform) return { x: 0, y: 0 };
  const m = transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
  if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  return { x: 0, y: 0 };
}

export default function TransformOverlay() {
  const selected = useEditorStore((s) => s.selectedElementId);
  const zoom = useEditorStore((s) => s.zoom);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const dragging = useRef(false);
  const resizing = useRef<null | { dir: string; startX: number; startY: number; startW: number; startH: number }>(null);
  const dragStart = useRef<{ x: number; y: number; baseX: number; baseY: number } | null>(null);

  useEffect(() => {
    const root = document.getElementById("editor-canvas-root");
    if (!root || !selected) {
      setRect(null);
      return;
    }

    const el = root.querySelector(`[data-field="${selected}"]`) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }

    const z = zoom || 1;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setRect({
      left: (elRect.left - rootRect.left) / z,
      top: (elRect.top - rootRect.top) / z,
      width: elRect.width / z,
      height: elRect.height / z,
    });
  }, [selected, zoom]);

  // Keyboard nudge
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return;
      const root = document.getElementById("editor-canvas-root");
      if (!root) return;
      const el = root.querySelector(`[data-field="${selected}"]`) as HTMLElement | null;
      if (!el) return;

      let dx = 0;
      let dy = 0;
      const step = e.shiftKey ? 10 : 1;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      if (dx === 0 && dy === 0) return;

      e.preventDefault();
      const prev = parseTranslate(el.style.transform);
      el.style.transform = `translate(${prev.x + dx}px, ${prev.y + dy}px)`;
      // update rect for overlay
      const rootRect = root.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const z = zoom || 1;
      setRect({
        left: (elRect.left - rootRect.left) / z,
        top: (elRect.top - rootRect.top) / z,
        width: elRect.width / z,
        height: elRect.height / z,
      });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, zoom]);

  // Pointer interactions
  useEffect(() => {
    const canvasRoot = document.getElementById("editor-canvas-root");
    if (!canvasRoot) return;

    let activeEl: HTMLElement | null = null;

    const onPointerDown = (ev: PointerEvent) => {
      if (!selected) return;
      
      const target = ev.target as HTMLElement | null;
      if (target && (target.closest("[data-resize-handle]") || target.closest("[data-transform-overlay]"))) {
        return;
      }

      const el = canvasRoot.querySelector(`[data-field="${selected}"]`) as HTMLElement | null;
      if (!el) return;

      const elRect = el.getBoundingClientRect();
      // if pointer inside element -> start move
      if (ev.clientX >= elRect.left && ev.clientX <= elRect.right && ev.clientY >= elRect.top && ev.clientY <= elRect.bottom) {
        activeEl = el;
        dragging.current = true;
        const prev = parseTranslate(el.style.transform);
        dragStart.current = { x: ev.clientX, y: ev.clientY, baseX: prev.x, baseY: prev.y };
        (ev.target as Element).setPointerCapture?.((ev as any).pointerId);
        ev.preventDefault();
      }
    };

    const onPointerMove = (ev: PointerEvent) => {
      const z = zoom || 1;
      if (dragging.current && activeEl && dragStart.current) {
        const dx = Math.round((ev.clientX - dragStart.current.x) / z);
        const dy = Math.round((ev.clientY - dragStart.current.y) / z);
        activeEl.style.transform = `translate(${dragStart.current.baseX + dx}px, ${dragStart.current.baseY + dy}px)`;
        const rootRect = canvasRoot.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        setRect({
          left: (elRect.left - rootRect.left) / z,
          top: (elRect.top - rootRect.top) / z,
          width: elRect.width / z,
          height: elRect.height / z,
        });
      }

      if (resizing.current) {
        const { dir, startX, startY, startW, startH } = resizing.current;
        const dx = Math.round((ev.clientX - startX) / z);
        const dy = Math.round((ev.clientY - startY) / z);
        const el = canvasRoot.querySelector(`[data-field="${selected}"]`) as HTMLElement | null;
        if (!el) return;

        let newW = startW;
        let newH = startH;
        if (dir.includes("right")) newW = Math.max(20, startW + dx);
        if (dir.includes("left")) newW = Math.max(20, startW - dx);
        if (dir.includes("bottom")) newH = Math.max(20, startH + dy);
        if (dir.includes("top")) newH = Math.max(20, startH - dy);

        el.style.width = `${newW}px`;
        el.style.height = `${newH}px`;

        const rootRect = canvasRoot.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setRect({
          left: (elRect.left - rootRect.left) / z,
          top: (elRect.top - rootRect.top) / z,
          width: elRect.width / z,
          height: elRect.height / z,
        });
      }
    };

    const onPointerUp = () => {
      dragging.current = false;
      dragStart.current = null;
      resizing.current = null;
      activeEl = null;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [selected, zoom]);

  const startResize = (dir: string) => (ev: React.PointerEvent) => {
    ev.stopPropagation();
    const canvasRoot = document.getElementById("editor-canvas-root");
    if (!canvasRoot || !selected) return;
    const el = canvasRoot.querySelector(`[data-field="${selected}"]`) as HTMLElement | null;
    if (!el) return;
    const z = zoom || 1;
    const r = el.getBoundingClientRect();
    resizing.current = {
      dir,
      startX: ev.clientX,
      startY: ev.clientY,
      startW: r.width / z,
      startH: r.height / z,
    };
    (ev.target as Element).setPointerCapture?.((ev as any).pointerId);
  };

  if (!rect || !selected) return null;

  return (
    <div
      style={{ position: "absolute", left: rect.left, top: rect.top, width: rect.width, height: rect.height, pointerEvents: "auto" }}
      className="z-50"
      aria-hidden
      data-transform-overlay
    >
      <div className="w-full h-full border-2 border-dashed border-sky-500/90 rounded-sm bg-transparent" />
      {/* corner handles */}
      <div style={{ position: "absolute", left: -6, top: -6 }} data-resize-handle>
        <div onPointerDown={startResize("left-top")} className="w-3 h-3 bg-white border rounded-full shadow cursor-nwse-resize" />
      </div>
      <div style={{ position: "absolute", right: -6, top: -6 }} data-resize-handle>
        <div onPointerDown={startResize("right-top")} className="w-3 h-3 bg-white border rounded-full shadow cursor-nesw-resize" />
      </div>
      <div style={{ position: "absolute", left: -6, bottom: -6 }} data-resize-handle>
        <div onPointerDown={startResize("left-bottom")} className="w-3 h-3 bg-white border rounded-full shadow cursor-nesw-resize" />
      </div>
      <div style={{ position: "absolute", right: -6, bottom: -6 }} data-resize-handle>
        <div onPointerDown={startResize("right-bottom")} className="w-3 h-3 bg-white border rounded-full shadow cursor-nwse-resize" />
      </div>
    </div>
  );
}
