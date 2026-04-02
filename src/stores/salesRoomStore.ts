'use client';

import { create } from 'zustand';
import type {
  SalesRoomAgent,
  SalesRoomActivity,
  SalesRoomMetrics,
  SalesRoomMessage,
  WhatsAppStatus,
} from '@/components/sales-room/seed';

// ─── State ──────────────────────────────────────────────
interface SalesRoomState {
  agents: SalesRoomAgent[];
  activities: SalesRoomActivity[];
  metrics: SalesRoomMetrics;
  selectedAgentId: string | null;
  whatsappStatus: WhatsAppStatus;
  simulationEnabled: boolean;
}

// ─── Actions ────────────────────────────────────────────
interface SalesRoomActions {
  setAgents: (agents: SalesRoomAgent[]) => void;
  selectAgent: (agentId: string | null) => void;
  addMessage: (agentId: string, message: SalesRoomMessage) => void;
  addActivity: (activity: SalesRoomActivity) => void;
  updateAgentStatus: (agentId: string, status: SalesRoomAgent['status']) => void;
  updateAgentTyping: (agentId: string, isTyping: boolean) => void;
  updateMetrics: (metrics: Partial<SalesRoomMetrics>) => void;
  incrementMetric: (key: keyof SalesRoomMetrics, delta: number) => void;
  setWhatsappStatus: (status: WhatsAppStatus) => void;
  setSimulationEnabled: (enabled: boolean) => void;
}

export type SalesRoomStore = SalesRoomState & SalesRoomActions;

const ACTIVITY_CAP = 50;

export const useSalesRoomStore = create<SalesRoomStore>()((set) => ({
  // Initial state
  agents: [],
  activities: [],
  metrics: { conversas: 0, vendas: 0, conversao: 0, leads: 0 },
  selectedAgentId: null,
  whatsappStatus: 'simulating',
  simulationEnabled: true,

  // Actions
  setAgents: (agents) => {
    // Deduplicate agents by ID (last one wins)
    const map = new Map(agents.map((a) => [a.id, a]));
    set({ agents: Array.from(map.values()) });
  },

  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  addMessage: (agentId, message) =>
    set((state) => ({
      agents: state.agents.map((a) => {
        if (a.id !== agentId) return a;
        // Deduplicate: skip if message with same ID already exists
        if (a.messages.some((m) => m.id === message.id)) return a;
        return {
          ...a,
          messages: [...a.messages, message],
          lastMessageTime: message.timestamp,
        };
      }),
    })),

  addActivity: (activity) =>
    set((state) => {
      // Deduplicate: skip if activity with same ID already exists
      if (state.activities.some((a) => a.id === activity.id)) return state;
      return { activities: [activity, ...state.activities].slice(0, ACTIVITY_CAP) };
    }),

  updateAgentStatus: (agentId, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agentId ? { ...a, status } : a)),
    })),

  updateAgentTyping: (agentId, isTyping) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agentId ? { ...a, isTyping } : a)),
    })),

  updateMetrics: (partial) =>
    set((state) => ({ metrics: { ...state.metrics, ...partial } })),

  incrementMetric: (key, delta) =>
    set((state) => ({
      metrics: { ...state.metrics, [key]: state.metrics[key] + delta },
    })),

  setWhatsappStatus: (status) => set({ whatsappStatus: status }),

  setSimulationEnabled: (enabled) => set({ simulationEnabled: enabled }),
}));
