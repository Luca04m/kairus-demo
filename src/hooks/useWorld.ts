'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useWorldStore } from '@/stores/worldStore';
import { useAuthStore } from '@/stores/authStore';
import type { Room } from '@/types/world';
import type { WorldZoom } from '@/types/world';
import type { Presence } from '@/types/world';

/**
 * Hook for the world screen with presence subscription.
 * Uses stable selectors to prevent unnecessary re-renders.
 */
export function useWorld() {
  const tenant = useAuthStore((s) => s.tenant);
  const tenantId = tenant?.id;

  // Use individual selectors for stable references
  const domains = useWorldStore((s) => s.domains);
  const rooms = useWorldStore((s) => s.rooms);
  const presences = useWorldStore((s) => s.presences);
  const graph = useWorldStore((s) => s.graph);
  const notifications = useWorldStore((s) => s.notifications);
  const selectedRoom = useWorldStore((s) => s.selectedRoom);
  const zoom = useWorldStore((s) => s.zoom);
  const loading = useWorldStore((s) => s.loading);
  const error = useWorldStore((s) => s.error);

  // Get stable action references directly from the store
  const fetchDomains = useWorldStore((s) => s.fetchDomains);
  const fetchRooms = useWorldStore((s) => s.fetchRooms);
  const fetchNotifications = useWorldStore((s) => s.fetchNotifications);
  const subscribeToPresence = useWorldStore((s) => s.subscribeToPresence);
  const selectRoomAction = useWorldStore((s) => s.selectRoom);
  const setZoomAction = useWorldStore((s) => s.setZoom);
  const updatePresenceAction = useWorldStore((s) => s.updatePresence);
  const fetchGraphAction = useWorldStore((s) => s.fetchGraph);

  // Fetch rooms and domains on mount
  useEffect(() => {
    if (tenantId) {
      fetchDomains(tenantId);
      fetchRooms(tenantId);
      fetchNotifications(tenantId);
    }
  }, [tenantId, fetchDomains, fetchRooms, fetchNotifications]);

  // Realtime presence subscription
  useEffect(() => {
    if (!tenantId) return;
    const unsubscribe = subscribeToPresence(tenantId);
    return unsubscribe;
  }, [tenantId, subscribeToPresence]);

  // Derived values
  const isEmpty = !loading && rooms.length === 0;
  const activeAgentCount = useMemo(
    () => presences.filter((p) => p.status === 'ativo').length,
    [presences],
  );
  const roomCount = rooms.length;

  // Stable action callbacks
  const refetch = useCallback(() => {
    if (tenantId) {
      fetchRooms(tenantId);
      fetchDomains(tenantId);
    }
  }, [tenantId, fetchRooms, fetchDomains]);

  const selectRoom = useCallback(
    (room: Room | null) => selectRoomAction(room),
    [selectRoomAction],
  );

  const setZoom = useCallback(
    (z: WorldZoom) => setZoomAction(z),
    [setZoomAction],
  );

  const updatePresence = useCallback(
    (presence: Omit<Presence, 'last_heartbeat'>) => updatePresenceAction(presence),
    [updatePresenceAction],
  );

  const fetchGraph = useCallback(
    () => fetchGraphAction(tenantId),
    [tenantId, fetchGraphAction],
  );

  return {
    // State
    domains,
    rooms,
    presences,
    graph,
    notifications,
    selectedRoom,
    zoom,
    loading,
    error,

    // Derived
    isEmpty,
    activeAgentCount,
    roomCount,

    // Actions
    refetch,
    selectRoom,
    setZoom,
    updatePresence,
    fetchGraph,
  };
}
