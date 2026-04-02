'use client';

import { useEffect, useCallback } from 'react';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import type { AlertFilters } from '@/types/alerts';
import type { UUID } from '@/types/common';

/**
 * Hook for alert queries with realtime subscription.
 */
export function useAlerts() {
  const tenantId = useAuthStore((s) => s.tenant?.id);

  const alerts = useAlertStore((s) => s.alerts);
  const filters = useAlertStore((s) => s.filters);
  const summary = useAlertStore((s) => s.summary);
  const loading = useAlertStore((s) => s.loading);
  const error = useAlertStore((s) => s.error);

  const fetchAlerts = useAlertStore((s) => s.fetchAlerts);
  const resolveAlert = useAlertStore((s) => s.resolveAlert);
  const createAlert = useAlertStore((s) => s.createAlert);
  const setFilters = useAlertStore((s) => s.setFilters);
  const clearFilters = useAlertStore((s) => s.clearFilters);
  const subscribeToAlerts = useAlertStore((s) => s.subscribeToAlerts);

  useEffect(() => {
    if (tenantId) {
      fetchAlerts(tenantId);
    }
  }, [tenantId, fetchAlerts]);

  // Realtime subscription
  useEffect(() => {
    if (!tenantId) return;
    const unsubscribe = subscribeToAlerts(tenantId);
    return unsubscribe;
  }, [tenantId, subscribeToAlerts]);

  const refetch = useCallback(() => {
    if (tenantId) fetchAlerts(tenantId);
  }, [tenantId, fetchAlerts]);

  return {
    // State
    alerts,
    filters,
    summary,
    loading,
    error,

    // Derived
    isEmpty: !loading && alerts.length === 0,
    unresolvedCount: summary?.unresolved ?? 0,
    criticalCount: summary?.by_severity?.critico ?? 0,

    // Actions
    refetch,
    resolve: (alertId: UUID) => resolveAlert(alertId),
    create: createAlert,
    setFilters: (f: Partial<AlertFilters>) => setFilters(f),
    clearFilters,
  };
}
