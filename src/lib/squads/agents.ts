// src/lib/squads/agents.ts

import type {
  AgentFilters,
  AgentPresenceRow,
  AgentRow,
  AgentStatus,
  AgentWithRelations,
  PresenceStatus,
  SupabaseParam,
} from "./types";
import { AgentError } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assertOk<T>(
  data: T | null,
  error: { message: string } | null,
  context: string,
): asserts data is NonNullable<T> {
  if (error) {
    throw new AgentError(
      `${context}: ${error.message}`,
      "SUPABASE_ERROR",
      error,
    );
  }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch agents with optional filters.
 */
export async function getAgents(
  supabase: SupabaseParam,
  filters: AgentFilters = {},
): Promise<AgentRow[]> {
  let query = supabase
    .from("agents")
    .select("*")
    .order("name", { ascending: true });

  if (filters.tenant_id) {
    query = query.eq("tenant_id", filters.tenant_id);
  }
  if (filters.department_id) {
    query = query.eq("department_id", filters.department_id);
  }
  if (filters.squad_id) {
    query = query.eq("squad_id", filters.squad_id);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;

  assertOk(data, error, "getAgents");

  return data as AgentRow[];
}

/**
 * Fetch a single agent with squad, department, and presence relations.
 */
export async function getAgent(
  supabase: SupabaseParam,
  agentId: string,
): Promise<AgentWithRelations> {
  const { data, error } = await supabase
    .from("agents")
    .select(
      `
      *,
      squad:squads(*),
      department:departments(*),
      presence:agent_presence(*)
    `,
    )
    .eq("id", agentId)
    .single();

  assertOk(data, error, "getAgent");

  // Presence is an array from join; take the latest entry
  const raw = data as Record<string, unknown>;
  const presenceArr = raw.presence as AgentPresenceRow[] | null;

  return {
    ...raw,
    presence: presenceArr?.[0] ?? undefined,
  } as unknown as AgentWithRelations;
}

/**
 * Update an agent's status and broadcast the change via Supabase Realtime.
 */
export async function updateAgentStatus(
  supabase: SupabaseParam,
  agentId: string,
  status: AgentStatus,
): Promise<AgentRow> {
  const validStatuses: AgentStatus[] = ["ativo", "pausado", "idle", "desativado"];
  if (!validStatuses.includes(status)) {
    throw new AgentError(
      `Invalid agent status: '${status}'`,
      "VALIDATION_ERROR",
    );
  }

  const { data, error } = await supabase
    .from("agents")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", agentId)
    .select()
    .single();

  assertOk(data, error, "updateAgentStatus");

  // Broadcast status change through Realtime
  const channel = supabase.channel("agent-status");
  await channel.send({
    type: "broadcast",
    event: "agent_status_change",
    payload: {
      agent_id: agentId,
      new_status: status,
      timestamp: new Date().toISOString(),
    },
  });

  return data as AgentRow;
}

// ---------------------------------------------------------------------------
// Presence
// ---------------------------------------------------------------------------

/**
 * Get current presence data for an agent.
 */
export async function getAgentPresence(
  supabase: SupabaseParam,
  agentId: string,
): Promise<AgentPresenceRow | null> {
  const { data, error } = await supabase
    .from("agent_presence")
    .select("*")
    .eq("agent_id", agentId)
    .order("last_seen_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new AgentError(
      `getAgentPresence: ${error.message}`,
      "SUPABASE_ERROR",
      error,
    );
  }

  return (data as AgentPresenceRow) ?? null;
}

/**
 * Set/update presence for an agent: which room they are in and current task.
 */
export async function setAgentPresence(
  supabase: SupabaseParam,
  agentId: string,
  roomId: string | null,
  task: string | null,
  presenceStatus: PresenceStatus = "online",
): Promise<AgentPresenceRow> {
  const now = new Date().toISOString();

  // Upsert on agent_id
  const { data, error } = await supabase
    .from("agent_presence")
    .upsert(
      {
        agent_id: agentId,
        room_id: roomId,
        current_task: task,
        status: presenceStatus,
        last_seen_at: now,
        metadata: {},
      },
      { onConflict: "agent_id" },
    )
    .select()
    .single();

  assertOk(data, error, "setAgentPresence");

  // Broadcast presence update
  if (roomId) {
    const channel = supabase.channel(`presence:${roomId}`);
    await channel.send({
      type: "broadcast",
      event: "presence_update",
      payload: {
        agent_id: agentId,
        room_id: roomId,
        current_task: task,
        status: presenceStatus,
        timestamp: now,
      },
    });
  }

  return data as AgentPresenceRow;
}
