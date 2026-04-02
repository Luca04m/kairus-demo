'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Agent, AgentStatus } from '@/types/agents';
import type { DepartmentId } from '@/types/departments';
import type { UUID } from '@/types/common';

// ─── Filters ─────────────────────────────────────────────
interface AgentFilters {
  departamento?: DepartmentId;
  status?: AgentStatus;
  search?: string;
}

// ─── State ───────────────────────────────────────────────
interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  filters: AgentFilters;
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface AgentActions {
  fetchAgents: (tenantId?: string) => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
  updateAgentStatus: (agentId: UUID, status: AgentStatus) => Promise<void>;
  setFilters: (filters: Partial<AgentFilters>) => void;
  clearFilters: () => void;
  subscribeToRealtimeStatus: (tenantId: string) => () => void;
}

export type AgentStore = AgentState & AgentActions;

const initialState: AgentState = {
  agents: [],
  selectedAgent: null,
  filters: {},
  loading: false,
  error: null,
};

export const useAgentStore = create<AgentStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchAgents: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('agents').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { filters } = get();
        if (filters.departamento) {
          query = query.eq('departamento', filters.departamento);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.search) {
          query = query.ilike('nome', `%${filters.search}%`);
        }

        const { data, error } = await query.order('nome');

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ agents: (data ?? []) as Agent[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch agents.';
        set({ loading: false, error: message });
      }
    },

    selectAgent: (agent) => set({ selectedAgent: agent }),

    updateAgentStatus: async (agentId, status) => {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('agents')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', agentId);

        if (error) {
          set({ error: error.message });
          return;
        }

        // Optimistic update
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, status } : a,
          ),
          selectedAgent:
            state.selectedAgent?.id === agentId
              ? { ...state.selectedAgent, status }
              : state.selectedAgent,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update agent status.';
        set({ error: message });
      }
    },

    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),

    clearFilters: () => set({ filters: {} }),

    subscribeToRealtimeStatus: (tenantId) => {
      const supabase = createClient();

      const channel = supabase
        .channel('agents-status')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'agents',
            filter: `tenant_id=eq.${tenantId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const newAgent = payload.new as unknown as Agent;
            set((state) => {
              // Deduplicate by ID
              const merged = new Map(state.agents.map((a) => [a.id, a]));
              merged.set(newAgent.id, newAgent);
              return { agents: [...merged.values()] };
            });
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'agents',
            filter: `tenant_id=eq.${tenantId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const updated = payload.new as unknown as Agent;
            set((state) => ({
              agents: state.agents.map((a) =>
                a.id === updated.id ? { ...a, ...updated } : a,
              ),
              selectedAgent:
                state.selectedAgent?.id === updated.id
                  ? { ...state.selectedAgent, ...updated }
                  : state.selectedAgent,
            }));
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  })),
);
