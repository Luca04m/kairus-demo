'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Approval, ApprovalFilters, ApprovalStats, ApprovalStatus } from '@/types/approvals';
import type { UUID } from '@/types/common';

// ─── State ───────────────────────────────────────────────
interface ApprovalState {
  approvals: Approval[];
  filters: ApprovalFilters;
  stats: ApprovalStats | null;
  pendingCount: number;
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface ApprovalActions {
  fetchApprovals: (tenantId?: string) => Promise<void>;
  approveAction: (approvalId: UUID, reason?: string) => Promise<void>;
  rejectAction: (approvalId: UUID, reason?: string) => Promise<void>;
  setFilters: (filters: Partial<ApprovalFilters>) => void;
  clearFilters: () => void;
}

export type ApprovalStore = ApprovalState & ApprovalActions;

const initialState: ApprovalState = {
  approvals: [],
  filters: {},
  stats: null,
  pendingCount: 0,
  loading: false,
  error: null,
};

function computeStats(approvals: Approval[]): ApprovalStats {
  const by_department: Record<string, number> = {};
  let pendentes = 0;
  let aprovados = 0;
  let rejeitados = 0;

  for (const a of approvals) {
    by_department[a.departamento] = (by_department[a.departamento] ?? 0) + 1;
    if (a.status === 'pendente') pendentes++;
    if (a.status === 'aprovado') aprovados++;
    if (a.status === 'rejeitado') rejeitados++;
  }

  return {
    total: approvals.length,
    pendentes,
    aprovados,
    rejeitados,
    tempo_medio_decisao_horas: 0, // Computed server-side
    by_department,
  };
}

export const useApprovalStore = create<ApprovalStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchApprovals: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('approvals').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { filters } = get();
        if (filters.status?.length) {
          query = query.in('status', filters.status);
        }
        if (filters.prioridade?.length) {
          query = query.in('prioridade', filters.prioridade);
        }
        if (filters.departamento?.length) {
          query = query.in('departamento', filters.departamento);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        const approvals = (data ?? []) as Approval[];
        const stats = computeStats(approvals);

        set({
          approvals,
          stats,
          pendingCount: stats.pendentes,
          loading: false,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch approvals.';
        set({ loading: false, error: message });
      }
    },

    approveAction: async (approvalId, reason) => {
      const now = new Date().toISOString();
      const newStatus: ApprovalStatus = 'aprovado';

      // Optimistic update
      set((state) => {
        const approvals = state.approvals.map((a) =>
          a.id === approvalId ? { ...a, status: newStatus, decided_at: now } : a,
        );
        const stats = computeStats(approvals);
        return { approvals, stats, pendingCount: stats.pendentes };
      });

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('approvals')
          .update({
            status: newStatus,
            decided_at: now,
            rejection_reason: reason ?? null,
          })
          .eq('id', approvalId);

        if (error) {
          // Revert on failure
          await get().fetchApprovals();
          set({ error: error.message });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to approve action.';
        await get().fetchApprovals();
        set({ error: message });
      }
    },

    rejectAction: async (approvalId, reason) => {
      const now = new Date().toISOString();
      const newStatus: ApprovalStatus = 'rejeitado';

      // Optimistic update
      set((state) => {
        const approvals = state.approvals.map((a) =>
          a.id === approvalId
            ? { ...a, status: newStatus, decided_at: now, rejection_reason: reason }
            : a,
        );
        const stats = computeStats(approvals);
        return { approvals, stats, pendingCount: stats.pendentes };
      });

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('approvals')
          .update({
            status: newStatus,
            decided_at: now,
            rejection_reason: reason ?? null,
          })
          .eq('id', approvalId);

        if (error) {
          await get().fetchApprovals();
          set({ error: error.message });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reject action.';
        await get().fetchApprovals();
        set({ error: message });
      }
    },

    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),

    clearFilters: () => set({ filters: {} }),
  })),
);
