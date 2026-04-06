// src/stores/worldUiStore.ts
// Local UI state for the world view (zoom, pan, selections)
// Separate from worldStore.ts which handles Supabase data

import { create } from "zustand";

interface WorldUiState {
  /** Currently selected room ID (for detail panel) */
  selectedRoomId: string | null;
  /** Currently selected agent ID */
  selectedAgentId: string | null;
  /** Map zoom factor (0.4 - 2.0) */
  mapZoom: number;
  /** Map pan offset X */
  panX: number;
  /** Map pan offset Y */
  panY: number;
  /** Detail panel open */
  detailPanelOpen: boolean;
  /** Notification panel open */
  notificationPanelOpen: boolean;
  /** Highlighted room IDs (e.g., from workflow hover) */
  highlightedRoomIds: string[];
  /** World zoom level: map (isometric overview) or room (interior view) */
  worldZoom: 'map' | 'room';

  // Actions
  selectRoom: (roomId: string | null) => void;
  selectAgent: (agentId: string | null) => void;
  setMapZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleDetailPanel: (open?: boolean) => void;
  toggleNotificationPanel: (open?: boolean) => void;
  setHighlightedRooms: (ids: string[]) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  closeAll: () => void;
  /** Enter a room interior view */
  enterRoom: (roomId: string) => void;
  /** Exit back to map view */
  exitRoom: () => void;
}

export const useWorldUiStore = create<WorldUiState>((set) => ({
  selectedRoomId: null,
  selectedAgentId: null,
  mapZoom: 1,
  panX: 0,
  panY: 0,
  detailPanelOpen: false,
  notificationPanelOpen: false,
  highlightedRoomIds: [],
  worldZoom: 'map',

  selectRoom: (roomId) =>
    set({
      selectedRoomId: roomId,
      detailPanelOpen: roomId !== null,
      selectedAgentId: null,
    }),

  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  setMapZoom: (zoom) =>
    set({ mapZoom: Math.max(0.4, Math.min(2.0, zoom)) }),

  setPan: (x, y) => set({ panX: x, panY: y }),

  toggleDetailPanel: (open) =>
    set((s) => ({
      detailPanelOpen: open !== undefined ? open : !s.detailPanelOpen,
    })),

  toggleNotificationPanel: (open) =>
    set((s) => ({
      notificationPanelOpen: open !== undefined ? open : !s.notificationPanelOpen,
    })),

  setHighlightedRooms: (ids) => set({ highlightedRoomIds: ids }),

  zoomIn: () =>
    set((s) => ({ mapZoom: Math.min(2.0, +(s.mapZoom + 0.2).toFixed(1)) })),

  zoomOut: () =>
    set((s) => ({ mapZoom: Math.max(0.4, +(s.mapZoom - 0.2).toFixed(1)) })),

  resetZoom: () => set({ mapZoom: 1, panX: 0, panY: 0 }),

  closeAll: () =>
    set({
      selectedRoomId: null,
      selectedAgentId: null,
      detailPanelOpen: false,
      notificationPanelOpen: false,
      highlightedRoomIds: [],
    }),

  enterRoom: (roomId) =>
    set({
      selectedRoomId: roomId,
      worldZoom: 'room',
      selectedAgentId: null,
      detailPanelOpen: false,
    }),

  exitRoom: () =>
    set({
      selectedRoomId: null,
      worldZoom: 'map',
      selectedAgentId: null,
    }),
}));
