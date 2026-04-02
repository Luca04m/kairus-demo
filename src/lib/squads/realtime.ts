// src/lib/squads/realtime.ts

import type { RealtimeChannel } from "@supabase/supabase-js";

import type {
  AgentStatusEvent,
  PresenceEvent,
  SquadActivityEvent,
  SupabaseParam,
} from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Subscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

// ---------------------------------------------------------------------------
// Agent Status
// ---------------------------------------------------------------------------

/**
 * Subscribe to agent status changes across all agents.
 * Returns a cleanup handle — call `unsubscribe()` on unmount.
 */
export function subscribeToAgentStatus(
  supabase: SupabaseParam,
  callback: (event: AgentStatusEvent) => void,
): Subscription {
  const channel = supabase
    .channel("agent-status")
    .on("broadcast", { event: "agent_status_change" }, (payload) => {
      callback(payload.payload as AgentStatusEvent);
    })
    .subscribe();

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

// ---------------------------------------------------------------------------
// Presence
// ---------------------------------------------------------------------------

/**
 * Subscribe to presence events in a specific room (world area).
 */
export function subscribeToPresence(
  supabase: SupabaseParam,
  roomId: string,
  callback: (event: PresenceEvent) => void,
): Subscription {
  const channel = supabase
    .channel(`presence:${roomId}`)
    .on("broadcast", { event: "presence_update" }, (payload) => {
      callback(payload.payload as PresenceEvent);
    })
    .subscribe();

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

// ---------------------------------------------------------------------------
// Squad Activity
// ---------------------------------------------------------------------------

/**
 * Subscribe to activity events for a specific squad.
 */
export function subscribeToSquadActivity(
  supabase: SupabaseParam,
  squadId: string,
  callback: (event: SquadActivityEvent) => void,
): Subscription {
  const channel = supabase
    .channel(`squad-activity:${squadId}`)
    .on("broadcast", { event: "squad_activity" }, (payload) => {
      callback(payload.payload as SquadActivityEvent);
    })
    .subscribe();

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

// ---------------------------------------------------------------------------
// Broadcast
// ---------------------------------------------------------------------------

/**
 * Send a broadcast event to any channel.
 */
export async function broadcastEvent(
  supabase: SupabaseParam,
  channelName: string,
  event: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const channel = supabase.channel(channelName);

  await channel.send({
    type: "broadcast",
    event,
    payload,
  });

  // Clean up the temporary channel after sending
  supabase.removeChannel(channel);
}

// ---------------------------------------------------------------------------
// Postgres Changes (DB-level subscriptions)
// ---------------------------------------------------------------------------

/**
 * Subscribe to INSERT/UPDATE/DELETE on agents table.
 * Useful for keeping UI in sync with DB mutations from other sources.
 */
export function subscribeToAgentTableChanges(
  supabase: SupabaseParam,
  callback: (payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Record<string, unknown>;
    old: Record<string, unknown>;
  }) => void,
): Subscription {
  const channel = supabase
    .channel("agents-db-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "agents" },
      (payload) => {
        callback({
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          new: (payload.new as Record<string, unknown>) ?? {},
          old: (payload.old as Record<string, unknown>) ?? {},
        });
      },
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Subscribe to squad table changes.
 */
export function subscribeToSquadTableChanges(
  supabase: SupabaseParam,
  callback: (payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Record<string, unknown>;
    old: Record<string, unknown>;
  }) => void,
): Subscription {
  const channel = supabase
    .channel("squads-db-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "squads" },
      (payload) => {
        callback({
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          new: (payload.new as Record<string, unknown>) ?? {},
          old: (payload.old as Record<string, unknown>) ?? {},
        });
      },
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
