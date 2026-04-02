'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Room, Domain, Presence, WorldGraph, WorldZoom } from '@/types/world';

// ─── Notification ────────────────────────────────────────
export interface WorldNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'agent_moved' | 'task_completed' | 'alert' | 'presence';
  title?: string;
  message: string;
  timestamp: string;
  room_id?: string;
  agent_id?: string;
  read_at?: string | null;
}

// ─── State ───────────────────────────────────────────────
interface WorldState {
  domains: Domain[];
  rooms: Room[];
  presences: Presence[];
  graph: WorldGraph | null;
  notifications: WorldNotification[];
  selectedRoom: Room | null;
  zoom: WorldZoom;
  loading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────
interface WorldActions {
  fetchRooms: (tenantId?: string) => Promise<void>;
  fetchDomains: (tenantId?: string) => Promise<void>;
  fetchGraph: (tenantId?: string) => Promise<void>;
  updatePresence: (presence: Omit<Presence, 'last_heartbeat'>) => Promise<void>;
  fetchNotifications: (tenantId?: string) => Promise<void>;
  selectRoom: (room: Room | null) => void;
  setZoom: (zoom: WorldZoom) => void;
  subscribeToPresence: (tenantId: string) => () => void;
}

export type WorldStore = WorldState & WorldActions;

const initialState: WorldState = {
  domains: [],
  rooms: [],
  presences: [],
  graph: null,
  notifications: [],
  selectedRoom: null,
  zoom: 'map',
  loading: false,
  error: null,
};

export const useWorldStore = create<WorldStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    fetchRooms: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('world_rooms').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query.order('nome');

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        // Deduplicate by id using Map
        const roomMap = new Map<string, Room>();
        for (const r of (data ?? []) as Room[]) {
          if (r.id) roomMap.set(r.id, r);
        }
        set({ rooms: Array.from(roomMap.values()), loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch rooms.';
        set({ loading: false, error: message });
      }
    },

    fetchDomains: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        let query = supabase.from('domains').select('*');

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query.order('nome');

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        // Deduplicate by id using Map
        const domainMap = new Map<string, Domain>();
        for (const d of (data ?? []) as Domain[]) {
          if (d.id) domainMap.set(d.id, d);
        }
        set({ domains: Array.from(domainMap.values()), loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch domains.';
        set({ loading: false, error: message });
      }
    },

    fetchGraph: async (tenantId) => {
      set({ loading: true, error: null });
      try {
        const supabase = createClient();
        // Assumes an RPC that builds the world graph
        const { data, error } = await supabase.rpc('get_world_graph', {
          p_tenant_id: tenantId,
        });

        if (error) {
          set({ loading: false, error: error.message });
          return;
        }

        set({ graph: data as WorldGraph, loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch world graph.';
        set({ loading: false, error: message });
      }
    },

    updatePresence: async (presence) => {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('agent_presence').upsert({
          ...presence,
          last_heartbeat: new Date().toISOString(),
        });

        if (error) {
          set({ error: error.message });
          return;
        }

        // Optimistic update using Map-based dedup
        set((state) => {
          const updated: Presence = {
            ...presence,
            last_heartbeat: new Date().toISOString(),
          };
          const presenceMap = new Map(
            state.presences.map((p) => [`${p.agent_id}:${p.room_id}`, p]),
          );
          presenceMap.set(`${updated.agent_id}:${updated.room_id}`, updated);
          return { presences: Array.from(presenceMap.values()) };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update presence.';
        set({ error: message });
      }
    },

    fetchNotifications: async (tenantId) => {
      try {
        const supabase = createClient();
        let query = supabase
          .from('world_notifications')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query;

        if (error) {
          // Non-blocking
          return;
        }

        // Deduplicate by id using Map
        const notifMap = new Map<string, WorldNotification>();
        for (const n of (data ?? []) as WorldNotification[]) {
          if (n.id) notifMap.set(n.id, n);
        }
        set({ notifications: Array.from(notifMap.values()) });
      } catch {
        // Silently fail for notifications
      }
    },

    selectRoom: (room) => set({ selectedRoom: room }),

    setZoom: (zoom) => set({ zoom }),

    subscribeToPresence: (tenantId) => {
      const supabase = createClient();
      // Use unique channel name to prevent duplicate subscriptions
      const channelName = `agent-presence-${tenantId}`;

      // Remove any existing channel with the same name first
      const existing = supabase.channel(channelName);
      supabase.removeChannel(existing);

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'agent_presence',
            filter: `tenant_id=eq.${tenantId}`,
          },
          (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
            if (payload.eventType === 'DELETE') {
              const deleted = payload.old as unknown as Presence;
              set((state) => ({
                presences: state.presences.filter(
                  (p) => !(p.agent_id === deleted.agent_id && p.room_id === deleted.room_id),
                ),
              }));
            } else {
              const updated = payload.new as unknown as Presence;
              set((state) => {
                // Deduplicate by composite key: agent_id + room_id
                const presenceMap = new Map(
                  state.presences.map((p) => [`${p.agent_id}:${p.room_id}`, p]),
                );
                presenceMap.set(`${updated.agent_id}:${updated.room_id}`, updated);
                return { presences: Array.from(presenceMap.values()) };
              });
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  })),
);
