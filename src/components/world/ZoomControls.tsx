"use client";

import { Plus, Minus, Maximize2 } from "lucide-react";
import { useWorldUiStore } from "@/stores/worldUiStore";

export function ZoomControls() {
  const { mapZoom, zoomIn, zoomOut, resetZoom } = useWorldUiStore();
  const pct = Math.round(mapZoom * 100);

  const btn =
    "flex items-center justify-center h-8 w-8 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all duration-150 cursor-pointer";

  return (
    <div className="glass-card flex flex-col items-center rounded-xl overflow-hidden">
      <button onClick={zoomIn} className={btn} aria-label="Aumentar zoom">
        <Plus size={14} />
      </button>

      <button
        onClick={resetZoom}
        className="flex items-center justify-center h-7 w-full text-[10px] font-medium text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all duration-150 cursor-pointer"
        aria-label="Resetar zoom"
      >
        {pct}%
      </button>

      <button onClick={zoomOut} className={btn} aria-label="Diminuir zoom">
        <Minus size={14} />
      </button>

      <div className="w-5 h-px bg-[rgba(255,255,255,0.06)] my-0.5" />

      <button onClick={resetZoom} className={btn} aria-label="Ajustar tudo">
        <Maximize2 size={13} />
      </button>
    </div>
  );
}
