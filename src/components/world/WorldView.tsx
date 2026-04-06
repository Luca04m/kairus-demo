"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WorldHeader } from "./WorldHeader";
import { DomainLegend } from "./DomainLegend";
import { WorldMap } from "./WorldMap";
import { RoomView } from "./RoomView";
import { RoomDetailPanel } from "./RoomDetailPanel";
import { WorldNotifications } from "./WorldNotifications";
import { Minimap } from "./Minimap";
import { ZoomControls } from "./ZoomControls";
import { DomainProvider } from "./DomainContext";
import { useWorldUiStore } from "@/stores/worldUiStore";
import { useWorldSimulation } from "@/hooks/useWorldSimulation";
import { ROOMS, DOMAINS } from "@/data/world-layout";
import type { DepartmentId } from "@/types/departments";

export function WorldView() {
  return (
    <DomainProvider>
      <WorldViewInner />
    </DomainProvider>
  );
}

function WorldViewInner() {
  const [activeDomains, setActiveDomains] = useState<DepartmentId[]>([]);
  const {
    worldZoom,
    selectedRoomId,
    enterRoom,
    exitRoom,
    closeAll,
  } = useWorldUiStore();

  // Initialize mock presences and simulate agent movement
  useWorldSimulation();

  // Zoom levels for map and room independently
  const [mapZoom, setMapZoom] = useState(1);
  const [roomZoom, setRoomZoom] = useState(1);
  const [doorTransition, setDoorTransition] = useState<'entering' | 'exiting' | null>(null);
  const [transitionRoomId, setTransitionRoomId] = useState<string | null>(null);

  const handleToggleDomain = useCallback((domain: DepartmentId) => {
    setActiveDomains((prev) => {
      if (prev.includes(domain)) {
        return prev.filter((d) => d !== domain);
      }
      return [...prev, domain];
    });
  }, []);

  const handleRoomClick = useCallback((roomId: string) => {
    setTransitionRoomId(roomId);
    setDoorTransition('entering');
    setTimeout(() => {
      enterRoom(roomId);
      setRoomZoom(1);
      setTimeout(() => setDoorTransition(null), 400);
    }, 300);
  }, [enterRoom]);

  const handleBack = useCallback(() => {
    setDoorTransition('exiting');
    setTimeout(() => {
      exitRoom();
      setTimeout(() => {
        setDoorTransition(null);
        setTransitionRoomId(null);
      }, 300);
    }, 250);
  }, [exitRoom]);

  // ESC handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (worldZoom === 'room') {
          handleBack();
        } else {
          closeAll();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeAll, worldZoom, handleBack]);

  const filterDomain = activeDomains.length === 1 ? activeDomains[0] : null;

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Header — only on map view */}
      {worldZoom === 'map' && <WorldHeader />}

      {/* Domain filter bar — only on map view */}
      {worldZoom === 'map' && (
        <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.04)]">
          <DomainLegend
            activeDomains={activeDomains}
            onToggleDomain={handleToggleDomain}
          />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 min-w-0 h-full">
          <AnimatePresence mode="wait">
            {worldZoom === 'map' ? (
              <motion.div
                key="world-map"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="h-full"
              >
                <WorldMap
                  onRoomClick={handleRoomClick}
                  zoom={mapZoom}
                  onZoomChange={setMapZoom}
                  highlightedRooms={useWorldUiStore.getState().highlightedRoomIds}
                  filterDomain={filterDomain}
                />
              </motion.div>
            ) : (
              <motion.div
                key="room-view"
                initial={{ opacity: 0, scale: 1.3, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full"
              >
                {selectedRoomId && (
                  <RoomView
                    roomId={selectedRoomId}
                    onBack={handleBack}
                    zoom={roomZoom}
                    onZoomChange={setRoomZoom}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Door transition overlay */}
          <AnimatePresence>
            {doorTransition && (
              <motion.div
                className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: doorTransition === 'entering' ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                />
                {doorTransition === 'entering' && transitionRoomId && (() => {
                  const roomCfg = ROOMS.find((r) => r.id === transitionRoomId);
                  const domainCfg = roomCfg ? DOMAINS[roomCfg.domain] : null;
                  return (
                    <motion.div
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        border: `3px solid ${domainCfg?.tileColor || '#fff'}88`,
                        boxShadow: `0 0 60px ${domainCfg?.tileColor || '#fff'}44`,
                      }}
                      initial={{ width: 40, height: 60, opacity: 0.8 }}
                      animate={{ width: '100vw', height: '100vh', opacity: 0, borderRadius: 0 }}
                      transition={{ duration: 0.5, ease: 'easeIn' }}
                    >
                      <div className="w-full h-full" style={{ background: domainCfg?.floorColor || '#09090b' }} />
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Detail Panel — only on map view */}
        {worldZoom === 'map' && <RoomDetailPanel />}

        {/* Zoom controls — bottom-left, only on map view */}
        {worldZoom === 'map' && (
          <div className="absolute bottom-4 left-4 z-30">
            <ZoomControls />
          </div>
        )}

        {/* Minimap — bottom-right, only on map view */}
        {worldZoom === 'map' && (
          <div className="absolute bottom-4 right-4 z-30">
            <Minimap />
          </div>
        )}

        {/* Notifications — top-right */}
        <WorldNotifications />
      </div>
    </div>
  );
}
