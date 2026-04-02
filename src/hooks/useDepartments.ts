'use client';

import { useEffect, useCallback } from 'react';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for department and squad queries with loading/error states.
 */
export function useDepartments() {
  const tenantId = useAuthStore((s) => s.tenant?.id);

  const departments = useDepartmentStore((s) => s.departments);
  const squads = useDepartmentStore((s) => s.squads);
  const stats = useDepartmentStore((s) => s.stats);
  const loading = useDepartmentStore((s) => s.loading);
  const error = useDepartmentStore((s) => s.error);

  const fetchDepartments = useDepartmentStore((s) => s.fetchDepartments);
  const fetchSquadsAction = useDepartmentStore((s) => s.fetchSquads);
  const fetchStatsAction = useDepartmentStore((s) => s.fetchStats);

  useEffect(() => {
    if (tenantId) {
      fetchDepartments(tenantId);
    }
  }, [tenantId, fetchDepartments]);

  const refetch = useCallback(() => {
    if (tenantId) fetchDepartments(tenantId);
  }, [tenantId, fetchDepartments]);

  const fetchSquads = useCallback(
    (departmentId?: string) => fetchSquadsAction(tenantId, departmentId),
    [tenantId, fetchSquadsAction],
  );

  const fetchStats = useCallback(
    () => fetchStatsAction(tenantId),
    [tenantId, fetchStatsAction],
  );

  return {
    // State
    departments,
    squads,
    stats,
    loading,
    error,

    // Derived
    isEmpty: !loading && departments.length === 0,

    // Actions
    refetch,
    fetchSquads,
    fetchStats,
  };
}
