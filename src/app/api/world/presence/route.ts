import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

export async function GET(_request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  // Get presence for all agents belonging to this tenant
  const { data, error } = await supabase
    .from("agent_presence")
    .select("*, agents!inner(id, name, initials, tenant_id), world_rooms(id, name)")
    .eq("agents.tenant_id", tenantId);

  if (error) {
    console.error("presence.GET:", error);
    return errorResponse("Failed to fetch presence", 500);
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { agent_id, room_id, status, current_task } = body as {
    agent_id?: string; room_id?: string; status?: string; current_task?: string;
  };

  if (!agent_id || !room_id) return errorResponse("agent_id and room_id are required", 400, "VALIDATION_ERROR");

  // Verify agent belongs to tenant
  const { data: agent, error: agentErr } = await supabase
    .from("agents")
    .select("id")
    .eq("id", agent_id)
    .eq("tenant_id", tenantId)
    .single();

  if (agentErr || !agent) return errorResponse("Agent not found", 404, "NOT_FOUND");

  const { data, error } = await supabase
    .from("agent_presence")
    .upsert(
      {
        agent_id, room_id,
        status: status ?? "online",
        current_task: current_task ?? null,
        last_seen: new Date().toISOString(),
      },
      { onConflict: "agent_id,room_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("presence.POST:", error);
    return errorResponse("Failed to update presence", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
