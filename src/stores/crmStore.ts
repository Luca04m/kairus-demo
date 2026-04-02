'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Client, ClientType, ClientStatus } from '@/types/crm';
import type { UUID } from '@/types/common';

// ─── Filters ─────────────────────────────────────────────
interface CrmFilters {
  tipo?: ClientType;
  status?: ClientStatus;
  search?: string;
  tags?: string[];
}

// ─── State ───────────────────────────────────────────────
interface CrmState {
  clients: Client[];
  selectedClient: Client | null;
  filters: CrmFilters;
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface CrmActions {
  fetchClients: (tenantId?: string) => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClient: (id: UUID, updates: Partial<Client>) => Promise<void>;
  selectClient: (client: Client | null) => void;
  setFilters: (filters: Partial<CrmFilters>) => void;
  clearFilters: () => void;
}

export type CrmStore = CrmState & CrmActions;

const initialState: CrmState = {
  clients: [],
  selectedClient: null,
  filters: {},
  loading: false,
  error: null,
};

export const useCrmStore = create<CrmStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchClients: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('clients').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { filters } = get();
        if (filters.tipo) {
          query = query.eq('tipo', filters.tipo);
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

        set({ clients: (data ?? []) as Client[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch clients.';
        set({ loading: false, error: message });
      }
    },

    createClient: async (clientData) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('clients')
          .insert(clientData)
          .select()
          .single();

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set((state) => {
          const newClient = data as Client;
          // Deduplicate by ID to prevent duplicates from concurrent insert + realtime
          const merged = new Map(state.clients.map((c) => [c.id, c]));
          merged.set(newClient.id, newClient);
          return {
            clients: [...merged.values()],
            loading: false,
          };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create client.';
        set({ loading: false, error: message });
      }
    },

    updateClient: async (id, updates) => {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('clients')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          set({ error: error.message });
          return;
        }

        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c,
          ),
          selectedClient:
            state.selectedClient?.id === id
              ? { ...state.selectedClient, ...updates, updated_at: new Date().toISOString() }
              : state.selectedClient,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update client.';
        set({ error: message });
      }
    },

    selectClient: (client) => set({ selectedClient: client }),

    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),

    clearFilters: () => set({ filters: {} }),
  })),
);
