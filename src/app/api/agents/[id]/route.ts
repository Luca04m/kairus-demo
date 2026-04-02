import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("agents")
    .select("*, departments(name, color, icon, emoji), squads(name)")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Agent not found", 404, "NOT_FOUND");
    console.error("agents[id].GET:", error);
    return errorResponse("Failed to fetch agent", 500);
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400, "INVALID_BODY");
  }

  const { name, initials, type, department_id, squad_id, description, skills, config, status } = body as {
    name?: string; initials?: string; type?: string; department_id?: string;
    squad_id?: string; description?: string; skills?: string[];
    config?: Record<string, unknown>; status?: string;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (initials !== undefined) updates.initials = initials;
  if (type !== undefined) updates.type = type;
  if (department_id !== undefined) updates.department_id = department_id;
  if (squad_id !== undefined) updates.squad_id = squad_id;
  if (description !== undefined) updates.description = description;
  if (skills !== undefined) updates.skills = skills;
  if (config !== undefined) updates.config = config;
  if (status !== undefined) updates.status = status;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("agents")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Agent not found", 404, "NOT_FOUND");
    console.error("agents[id].PUT:", error);
    return errorResponse("Failed to update agent", 500);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("agents")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("agents[id].DELETE:", error);
    return errorResponse("Failed to delete agent", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
