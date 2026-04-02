'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Alert, AlertFilters, AlertSummary, AlertSeverity, AlertStatus } from '@/types/alerts';
import type { UUID } from '@/types/common';

// ─── State ───────────────────────────────────────────────
interface AlertState {
  alerts: Alert[];
  filters: AlertFilters;
  summary: AlertSummary | null;
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface AlertActions {
  fetchAlerts: (tenantId?: string) => Promise<void>;
  resolveAlert: (alertId: UUID) => Promise<void>;
  createAlert: (alert: Omit<Alert, 'id' | 'created_at'>) => Promise<void>;
  setFilters: (filters: Partial<AlertFilters>) => void;
  clearFilters: () => void;
  subscribeToAlerts: (tenantId: string) => () => void;
}

export type AlertStore = AlertState & AlertActions;

const initialState: AlertState = {
  alerts: [],
  filters: {},
  summary: null,
  loading: false,
  error: null,
};

function computeSummary(alerts: Alert[]): AlertSummary {
  const by_severity = {} as Record<AlertSeverity, number>;
  const by_department: Record<string, number> = {};
  let unresolved = 0;

  for (const alert of alerts) {
    by_severity[alert.severidade] = (by_severity[alert.severidade] ?? 0) + 1;
    by_department[alert.departamento] = (by_department[alert.departamento] ?? 0) + 1;
    if (alert.status !== 'resolvido' && alert.status !== 'ignorado') {
      unresolved++;
    }
  }

  return { total: alerts.length, by_severity, by_department, unresolved };
}

export const useAlertStore = create<AlertStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchAlerts: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('alerts').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { filters } = get();
        if (filters.severidade?.length) {
          query = query.in('severidade', filters.severidade);
        }
        if (filters.status?.length) {
          query = query.in('status', filters.status);
        }
        if (filters.departamento?.length) {
          query = query.in('departamento', filters.departamento);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        const alerts = (data ?? []) as Alert[];
        set({ alerts, summary: computeSummary(alerts), loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch alerts.';
        set({ loading: false, error: message });
      }
    },

    resolveAlert: async (alertId) => {
      try {
        const supabase = createClient();
        const now = new Date().toISOString();
        const { error } = await supabase
          .from('alerts')
          .update({ status: 'resolvido' as AlertStatus, resolved_at: now })
          .eq('id', alertId);

        if (error) {
          set({ error: error.message });
          return;
        }

        // Optimistic update
        set((state) => {
          const alerts = state.alerts.map((a) =>
            a.id === alertId ? { ...a, status: 'resolvido' as AlertStatus, resolved_at: now } : a,
          );
          return { alerts, summary: computeSummary(alerts) };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to resolve alert.';
        set({ error: message });
      }
    },

    createAlert: async (alertData) => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('alerts')
          .insert(alertData)
          .select()
          .single();

        if (error) {
          set({ error: error.message });
          return;
        }

        set((state) => {
          const newAlert = data as Alert;
          // Deduplicate: upsert by ID
          const merged = new Map(state.alerts.map((a) => [a.id, a]));
          merged.set(newAlert.id, newAlert);
          const alerts = [...merged.values()].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          );
          return { alerts, summary: computeSummary(alerts) };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create alert.';
        set({ error: message });
      }
    },

    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),

    clearFilters: () => set({ filters: {} }),

    subscribeToAlerts: (tenantId) => {
      const supabase = createClient();

      const channel = supabase
        .channel('alerts-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'alerts',
            filter: `tenant_id=eq.${tenantId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const newAlert = payload.new as unknown as Alert;
            set((state) => {
              // Deduplicate: upsert by ID to prevent duplicates from concurrent createAlert + realtime
              const merged = new Map(state.alerts.map((a) => [a.id, a]));
              merged.set(newAlert.id, newAlert);
              const alerts = [...merged.values()].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              );
              return { alerts, summary: computeSummary(alerts) };
            });
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'alerts',
            filter: `tenant_id=eq.${tenantId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const updated = payload.new as unknown as Alert;
            set((state) => {
              const alerts = state.alerts.map((a) =>
                a.id === updated.id ? { ...a, ...updated } : a,
              );
              return { alerts, summary: computeSummary(alerts) };
            });
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  })),
);
