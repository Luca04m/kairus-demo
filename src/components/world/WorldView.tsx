"use client";

import { useState, useCallback, useEffect } from "react";
import { WorldHeader } from "./WorldHeader";
import { DomainLegend } from "./DomainLegend";
import { WorldCanvas } from "./WorldCanvas";
import { RoomDetailPanel } from "./RoomDetailPanel";
import { WorldNotifications } from "./WorldNotifications";
import { Minimap } from "./Minimap";
import { ZoomControls } from "./ZoomControls";
import { useWorldUiStore } from "@/stores/worldUiStore";
import type { DepartmentId } from "@/types/departments";

export function WorldView() {
  const [activeDomains, setActiveDomains] = useState<DepartmentId[]>([]);
  const { detailPanelOpen, closeAll } = useWorldUiStore();

  const handleToggleDomain = useCallback((domain: DepartmentId) => {
    setActiveDomains((prev) => {
      if (prev.includes(domain)) {
        return prev.filter((d) => d !== domain);
      }
      return [...prev, domain];
    });
  }, []);

  // ESC handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeAll]);

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <WorldHeader />

      {/* Domain filter bar */}
      <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.04)]">
        <DomainLegend
          activeDomains={activeDomains}
          onToggleDomain={handleToggleDomain}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Canvas */}
        <div
          className="flex-1 min-w-0 transition-all duration-300"
          style={{
            marginRight: detailPanelOpen ? 340 : 0,
          }}
        >
          <WorldCanvas activeDomains={activeDomains} />
        </div>

        {/* Detail Panel (slide-in from right) */}
        <RoomDetailPanel />

        {/* Overlays */}
        {/* Zoom controls — bottom-left */}
        <div className="absolute bottom-4 left-4 z-30">
          <ZoomControls />
        </div>

        {/* Minimap — bottom-right */}
        <div
          className="absolute bottom-4 z-30 transition-all duration-300"
          style={{
            right: detailPanelOpen ? 356 : 16,
          }}
        >
          <Minimap />
        </div>

        {/* Notifications — top-right */}
        <WorldNotifications />
      </div>
    </div>
  );
}
