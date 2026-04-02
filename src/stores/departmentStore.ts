'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Department, Squad, DepartmentStats } from '@/types/departments';

// ─── State ───────────────────────────────────────────────
interface DepartmentState {
  departments: Department[];
  squads: Squad[];
  stats: DepartmentStats[];
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface DepartmentActions {
  fetchDepartments: (tenantId?: string) => Promise<void>;
  fetchSquads: (tenantId?: string, departmentId?: string) => Promise<void>;
  fetchStats: (tenantId?: string) => Promise<void>;
}

export type DepartmentStore = DepartmentState & DepartmentActions;

const initialState: DepartmentState = {
  departments: [],
  squads: [],
  stats: [],
  loading: false,
  error: null,
};

export const useDepartmentStore = create<DepartmentStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    fetchDepartments: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('departments').select('*').eq('is_active', true);

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query.order('nome');

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ departments: (data ?? []) as Department[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch departments.';
        set({ loading: false, error: message });
      }
    },

    fetchSquads: async (tenantId, departmentId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('squads').select('*').eq('is_active', true);

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
        if (departmentId) {
          query = query.eq('department_id', departmentId);
        }

        const { data, error } = await query.order('nome');

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ squads: (data ?? []) as Squad[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch squads.';
        set({ loading: false, error: message });
      }
    },

    fetchStats: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        // This assumes a view or RPC that returns department stats
        let query = supabase.from('department_stats').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query;

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ stats: (data ?? []) as DepartmentStats[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch department stats.';
        set({ loading: false, error: message });
      }
    },
  })),
);
