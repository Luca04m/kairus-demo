'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type {
  FinancialKpi,
  MonthlySales,
  ProductRevenue,
  MarginData,
  Dre,
  ChargebackData,
  FinancialSummary,
} from '@/types/financial';

// ─── State ───────────────────────────────────────────────
interface FinancialState {
  kpis: FinancialKpi[];
  monthlySales: MonthlySales[];
  topProducts: ProductRevenue[];
  margins: MarginData[];
  dre: Dre | null;
  chargebacks: ChargebackData[];
  summary: FinancialSummary | null;
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface FinancialActions {
  fetchFinancialData: (tenantId?: string) => Promise<void>;
  fetchMargins: (tenantId?: string, periodo?: string) => Promise<void>;
  fetchDre: (tenantId?: string, periodo?: string) => Promise<void>;
  fetchChargebacks: (tenantId?: string) => Promise<void>;
}

export type FinancialStore = FinancialState & FinancialActions;

const initialState: FinancialState = {
  kpis: [],
  monthlySales: [],
  topProducts: [],
  margins: [],
  dre: null,
  chargebacks: [],
  summary: null,
  loading: false,
  error: null,
};

export const useFinancialStore = create<FinancialStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    fetchFinancialData: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();

        // Fetch financial records (monthly sales)
        let salesQuery = supabase
          .from('financial_records')
          .select('*')
          .order('periodo', { ascending: true });

        if (tenantId) {
          salesQuery = salesQuery.eq('tenant_id', tenantId);
        }

        const [salesResult, productsResult] = await Promise.all([
          salesQuery,
          supabase
            .from('product_revenue')
            .select('*')
            .order('receita', { ascending: false })
            .limit(10),
        ]);

        if (salesResult.error) {
          set({ loading: false, error: salesResult.error.message });
          return;
        }

        set({
          monthlySales: (salesResult.data ?? []) as MonthlySales[],
          topProducts: (productsResult.data ?? []) as ProductRevenue[],
          loading: false,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch financial data.';
        set({ loading: false, error: message });
      }
    },

    fetchMargins: async (tenantId, periodo) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('margins').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
        if (periodo) {
          query = query.eq('periodo', periodo);
        }

        const { data, error } = await query.order('margem_percentual', { ascending: true });

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ margins: (data ?? []) as MarginData[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch margin data.';
        set({ loading: false, error: message });
      }
    },

    fetchDre: async (tenantId, periodo) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('dre').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
        if (periodo) {
          query = query.eq('periodo', periodo);
        }

        const { data, error } = await query.single();

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ dre: data as Dre, loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch DRE.';
        set({ loading: false, error: message });
      }
    },

    fetchChargebacks: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('chargebacks').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query.order('periodo', { ascending: false });

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ chargebacks: (data ?? []) as ChargebackData[], loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch chargeback data.';
        set({ loading: false, error: message });
      }
    },
  })),
);
