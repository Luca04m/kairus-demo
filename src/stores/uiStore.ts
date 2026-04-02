'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// ─── Active View ─────────────────────────────────────────
export type ActiveView =
  | 'overview'
  | 'agents'
  | 'departments'
  | 'alerts'
  | 'financial'
  | 'marketing'
  | 'approvals'
  | 'roadmap'
  | 'sales'
  | 'world'
  | 'crm'
  | 'reports'
  | 'roi'
  | 'settings'
  | 'integrations';

// ─── Modal ───────────────────────────────────────────────
interface ModalState {
  id: string;
  props?: Record<string, unknown>;
}

// ─── State ───────────────────────────────────────────────
interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeView: ActiveView;
  modals: ModalState[];
  isMobile: boolean;
  commandPaletteOpen: boolean;
}

// ─── Actions ─────────────────────────────────────────────
interface UiActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveView: (view: ActiveView) => void;
  openModal: (id: string, props?: Record<string, unknown>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleCommandPalette: () => void;
}

export type UiStore = UiState & UiActions;

const initialState: UiState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeView: 'overview',
  modals: [],
  isMobile: false,
  commandPaletteOpen: false,
};

export const useUiStore = create<UiStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    toggleSidebar: () =>
      set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    setActiveView: (view) => set({ activeView: view }),

    openModal: (id, props) =>
      set((state) => ({
        modals: [...state.modals.filter((m) => m.id !== id), { id, props }],
      })),

    closeModal: (id) =>
      set((state) => ({
        modals: state.modals.filter((m) => m.id !== id),
      })),

    closeAllModals: () => set({ modals: [] }),

    setIsMobile: (isMobile) =>
      set({
        isMobile,
        sidebarOpen: !isMobile,
        sidebarCollapsed: isMobile,
      }),

    toggleCommandPalette: () =>
      set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  })),
);
