import React from "react";

export default function CanvasRulers({ width = 960, height = 600, zoom = 1 }: { width?: number; height?: number; zoom?: number }) {
  const scaled = Math.round(width * zoom);
  const tickStep = 50; // pixels between major ticks

  const ticks = [] as number[];
  for (let x = 0; x <= scaled; x += tickStep) ticks.push(x);

  return (
    <div className="absolute left-0 top-0 right-0 pointer-events-none">
      <div className="flex items-start">
        <div className="w-8 h-6 bg-transparent border-r border-black/10" />
        <div className="flex-1 h-6 relative bg-transparent">
          {ticks.map((t) => (
            <div key={t} style={{ left: t }} className="absolute top-0 h-6">
              <div className="h-2 border-l border-black/10 opacity-60" style={{ height: 6 }} />
              <div className="text-[10px] text-slate-400 ml-1 -mt-1" style={{ transform: "translateX(-50%)", position: "absolute", left: 0 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-0 top-6 bottom-0 flex">
        <div className="w-8 h-full bg-transparent border-r border-black/10">
          {/* vertical ticks can be added here */}
        </div>
      </div>
    </div>
  );
}
