// src/lib/squads/registry.ts

import type {
  CreateSquadInput,
  DepartmentRow,
  SquadRow,
  SquadStatus,
  SquadWithAgents,
  SquadWithCounts,
  SupabaseParam,
} from "./types";
import { SquadError, inferDepartmentFromSquadName } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assertOk<T>(
  data: T | null,
  error: { message: string } | null,
  context: string,
): asserts data is NonNullable<T> {
  if (error) {
    throw new SquadError(
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
 * Fetch all squads for a tenant, enriched with agent counts.
 */
export async function getSquads(
  supabase: SupabaseParam,
  tenantId: string,
): Promise<SquadWithCounts[]> {
  const { data, error } = await supabase
    .from("squads")
    .select(
      `
      *,
      department:departments(*),
      agents:agents(id, status)
    `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });

  assertOk(data, error, "getSquads");

  type RawSquadRow = SquadRow & {
    department?: DepartmentRow;
    agents?: { id: string; status: string }[];
  };

  return (data as RawSquadRow[]).map((row): SquadWithCounts => {
    const { agents: agentsList, ...rest } = row;
    const resolved = agentsList ?? [];
    return {
      ...rest,
      agent_count: resolved.length,
      active_agent_count: resolved.filter((a) => a.status === "ativo").length,
    };
  });
}

/**
 * Fetch a single squad by ID with its full agent list.
 */
export async function getSquad(
  supabase: SupabaseParam,
  squadId: string,
): Promise<SquadWithAgents> {
  const { data, error } = await supabase
    .from("squads")
    .select(
      `
      *,
      department:departments(*),
      agents:agents(*)
    `,
    )
    .eq("id", squadId)
    .single();

  assertOk(data, error, "getSquad");

  return data as unknown as SquadWithAgents;
}

/**
 * Fetch squads grouped by department for a tenant.
 */
export async function getSquadsByDepartment(
  supabase: SupabaseParam,
  departmentId: string,
): Promise<SquadWithCounts[]> {
  const { data, error } = await supabase
    .from("squads")
    .select(
      `
      *,
      department:departments(*),
      agents:agents(id, status)
    `,
    )
    .eq("department_id", departmentId)
    .order("name", { ascending: true });

  assertOk(data, error, "getSquadsByDepartment");

  type RawSquadRow = SquadRow & {
    department?: DepartmentRow;
    agents?: { id: string; status: string }[];
  };

  return (data as RawSquadRow[]).map((row): SquadWithCounts => {
    const { agents: agentsList, ...rest } = row;
    const resolved = agentsList ?? [];
    return {
      ...rest,
      agent_count: resolved.length,
      active_agent_count: resolved.filter((a) => a.status === "ativo").length,
    };
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Register a new squad. Auto-infers department from name if not provided.
 */
export async function registerSquad(
  supabase: SupabaseParam,
  input: CreateSquadInput,
): Promise<SquadRow> {
  // Validate required fields
  if (!input.name?.trim()) {
    throw new SquadError("Squad name is required", "VALIDATION_ERROR");
  }
  if (!input.tenant_id) {
    throw new SquadError("Tenant ID is required", "VALIDATION_ERROR");
  }

  // Auto-infer department if not set
  let departmentId = input.department_id;
  if (!departmentId) {
    const inferred = inferDepartmentFromSquadName(input.name);
    if (inferred) {
      const { data: dept } = await supabase
        .from("departments")
        .select("id")
        .ilike("name", inferred)
        .eq("tenant_id", input.tenant_id)
        .maybeSingle();
      if (dept) {
        departmentId = dept.id;
      }
    }
  }

  if (!departmentId) {
    throw new SquadError(
      "Department ID is required or could not be inferred from squad name",
      "VALIDATION_ERROR",
    );
  }

  const { data, error } = await supabase
    .from("squads")
    .insert({
      tenant_id: input.tenant_id,
      department_id: departmentId,
      name: input.name.trim(),
      description: input.description ?? null,
      status: input.status ?? "ativo",
    })
    .select()
    .single();

  assertOk(data, error, "registerSquad");

  return data as SquadRow;
}

/**
 * Transition a squad's status.
 */
export async function updateSquadStatus(
  supabase: SupabaseParam,
  squadId: string,
  status: SquadStatus,
): Promise<SquadRow> {
  const validTransitions: Record<SquadStatus, SquadStatus[]> = {
    ativo: ["pausado", "arquivado"],
    pausado: ["ativo", "arquivado"],
    arquivado: [],
  };

  // Fetch current status
  const { data: current, error: fetchErr } = await supabase
    .from("squads")
    .select("status")
    .eq("id", squadId)
    .single();

  assertOk(current, fetchErr, "updateSquadStatus:fetch");

  const currentStatus = (current as { status: SquadStatus }).status;
  const allowed = validTransitions[currentStatus] ?? [];

  if (!allowed.includes(status)) {
    throw new SquadError(
      `Cannot transition from '${currentStatus}' to '${status}'`,
      "INVALID_TRANSITION",
    );
  }

  const { data, error } = await supabase
    .from("squads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", squadId)
    .select()
    .single();

  assertOk(data, error, "updateSquadStatus:update");

  return data as SquadRow;
}
