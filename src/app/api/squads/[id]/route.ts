import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("squads")
    .select("*, departments(name, color, emoji), agents(id, name, initials, status)")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Squad not found", 404, "NOT_FOUND");
    console.error("squads[id].GET:", error);
    return errorResponse("Failed to fetch squad", 500);
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

  const { name, department_id, description, status } = body as {
    name?: string; department_id?: string; description?: string; status?: string;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (department_id !== undefined) updates.department_id = department_id;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("squads")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Squad not found", 404, "NOT_FOUND");
    if (error.code === "23505") return errorResponse("Squad name already exists in this department", 409, "DUPLICATE");
    console.error("squads[id].PUT:", error);
    return errorResponse("Failed to update squad", 500);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("squads")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("squads[id].DELETE:", error);
    if (error.code === "23503") return errorResponse("Cannot delete squad with existing agents", 409, "FK_CONSTRAINT");
    return errorResponse("Failed to delete squad", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
