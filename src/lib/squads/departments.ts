// src/lib/squads/departments.ts

import type {
  CreateDepartmentInput,
  DepartmentRow,
  DepartmentStats,
  DepartmentWithCounts,
  SupabaseParam,
} from "./types";
import { DepartmentError } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assertOk<T>(
  data: T | null,
  error: { message: string } | null,
  context: string,
): asserts data is NonNullable<T> {
  if (error) {
    throw new DepartmentError(
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
 * Fetch all departments for a tenant with squad and agent counts.
 */
export async function getDepartments(
  supabase: SupabaseParam,
  tenantId: string,
): Promise<DepartmentWithCounts[]> {
  const { data, error } = await supabase
    .from("departments")
    .select(
      `
      *,
      squads:squads(id),
      agents:agents(id, status)
    `,
    )
    .eq("tenant_id", tenantId)
    .order("name", { ascending: true });

  assertOk(data, error, "getDepartments");

  type RawDeptRow = DepartmentRow & {
    squads?: { id: string }[];
    agents?: { id: string; status: string }[];
  };

  return (data as RawDeptRow[]).map((row): DepartmentWithCounts => {
    const { squads: squadsList, agents: agentsList, ...rest } = row;
    const resolvedSquads = squadsList ?? [];
    const resolvedAgents = agentsList ?? [];
    return {
      ...rest,
      squad_count: resolvedSquads.length,
      agent_count: resolvedAgents.length,
      active_agent_count: resolvedAgents.filter((a) => a.status === "ativo").length,
    };
  });
}

/**
 * Get aggregated performance stats for a single department.
 */
export async function getDepartmentStats(
  supabase: SupabaseParam,
  departmentId: string,
): Promise<DepartmentStats> {
  // Fetch squads count
  const { data: squads, error: sqErr } = await supabase
    .from("squads")
    .select("id")
    .eq("department_id", departmentId);

  assertOk(squads, sqErr, "getDepartmentStats:squads");

  // Fetch agents with metrics (stored in performance_metrics JSONB)
  const { data: agents, error: agErr } = await supabase
    .from("agents")
    .select("id, status, performance_metrics")
    .eq("department_id", departmentId);

  assertOk(agents, agErr, "getDepartmentStats:agents");

  type AgentWithMetrics = {
    id: string;
    status: string;
    performance_metrics: {
      tasks_completed?: number;
      tasks_failed?: number;
      approval_rate?: number;
    } | null;
  };

  const typedAgents = agents as AgentWithMetrics[];

  const totalCompleted = typedAgents.reduce(
    (sum, a) => sum + (a.performance_metrics?.tasks_completed ?? 0),
    0,
  );
  const totalFailed = typedAgents.reduce(
    (sum, a) => sum + (a.performance_metrics?.tasks_failed ?? 0),
    0,
  );
  const activeAgents = typedAgents.filter((a) => a.status === "ativo").length;
  const avgApproval =
    typedAgents.length > 0
      ? typedAgents.reduce((sum, a) => sum + (a.performance_metrics?.approval_rate ?? 0), 0) /
        typedAgents.length
      : 0;

  return {
    department_id: departmentId,
    total_squads: (squads as { id: string }[]).length,
    total_agents: typedAgents.length,
    active_agents: activeAgents,
    total_tasks_completed: totalCompleted,
    total_tasks_failed: totalFailed,
    avg_approval_rate: Math.round(avgApproval * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Create a new department with validation.
 */
export async function createDepartment(
  supabase: SupabaseParam,
  input: CreateDepartmentInput,
): Promise<DepartmentRow> {
  if (!input.name?.trim()) {
    throw new DepartmentError(
      "Department name is required",
      "VALIDATION_ERROR",
    );
  }
  if (!input.tenant_id) {
    throw new DepartmentError("Tenant ID is required", "VALIDATION_ERROR");
  }
  // Check for duplicate name within tenant
  const { data: existing } = await supabase
    .from("departments")
    .select("id")
    .eq("tenant_id", input.tenant_id)
    .eq("name", input.name.trim())
    .maybeSingle();

  if (existing) {
    throw new DepartmentError(
      `Department with name '${input.name}' already exists for this tenant`,
      "DUPLICATE_ERROR",
    );
  }

  const { data, error } = await supabase
    .from("departments")
    .insert({
      tenant_id: input.tenant_id,
      name: input.name.trim(),
      description: input.description ?? null,
      color: input.color,
      icon: input.icon ?? "Building",
      emoji: input.emoji ?? null,
      order_index: input.order_index ?? 0,
    })
    .select()
    .single();

  assertOk(data, error, "createDepartment");

  return data as DepartmentRow;
}
