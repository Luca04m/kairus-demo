'use client';

import { useEffect, useCallback } from 'react';
import { useAgentStore } from '@/stores/agentStore';
import { useAuthStore } from '@/stores/authStore';
import type { AgentStatus } from '@/types/agents';
import type { DepartmentId } from '@/types/departments';
import type { UUID } from '@/types/common';

/**
 * Hook for agent queries with loading/error states and realtime subscription.
 */
export function useAgents() {
  const tenantId = useAuthStore((s) => s.tenant?.id);

  const agents = useAgentStore((s) => s.agents);
  const selectedAgent = useAgentStore((s) => s.selectedAgent);
  const filters = useAgentStore((s) => s.filters);
  const loading = useAgentStore((s) => s.loading);
  const error = useAgentStore((s) => s.error);

  const fetchAgents = useAgentStore((s) => s.fetchAgents);
  const selectAgent = useAgentStore((s) => s.selectAgent);
  const updateAgentStatus = useAgentStore((s) => s.updateAgentStatus);
  const setFilters = useAgentStore((s) => s.setFilters);
  const clearFilters = useAgentStore((s) => s.clearFilters);
  const subscribeToRealtimeStatus = useAgentStore((s) => s.subscribeToRealtimeStatus);

  useEffect(() => {
    if (tenantId) {
      fetchAgents(tenantId);
    }
  }, [tenantId, fetchAgents]);

  // Realtime subscription
  useEffect(() => {
    if (!tenantId) return;
    const unsubscribe = subscribeToRealtimeStatus(tenantId);
    return unsubscribe;
  }, [tenantId, subscribeToRealtimeStatus]);

  const refetch = useCallback(() => {
    if (tenantId) fetchAgents(tenantId);
  }, [tenantId, fetchAgents]);

  return {
    // State
    agents,
    selectedAgent,
    filters,
    loading,
    error,

    // Derived
    isEmpty: !loading && agents.length === 0,
    activeCount: agents.filter((a) => a.status === 'ativo').length,

    // Actions
    refetch,
    selectAgent,
    updateStatus: (agentId: UUID, status: AgentStatus) =>
      updateAgentStatus(agentId, status),
    setFilters,
    clearFilters,

    // Filter helpers
    filterByDepartment: (dept: DepartmentId) =>
      setFilters({ departamento: dept }),
    filterByStatus: (status: AgentStatus) =>
      setFilters({ status }),
    search: (query: string) =>
      setFilters({ search: query }),
  };
}
