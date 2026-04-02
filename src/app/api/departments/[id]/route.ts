import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("departments")
    .select("*, squads(id, name, status), agents(id, name, status)")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Department not found", 404, "NOT_FOUND");
    console.error("departments[id].GET:", error);
    return errorResponse("Failed to fetch department", 500);
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

  const { name, description, color, icon, emoji, order_index } = body as {
    name?: string; description?: string; color?: string;
    icon?: string; emoji?: string; order_index?: number;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (color !== undefined) updates.color = color;
  if (icon !== undefined) updates.icon = icon;
  if (emoji !== undefined) updates.emoji = emoji;
  if (order_index !== undefined) updates.order_index = order_index;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("departments")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Department not found", 404, "NOT_FOUND");
    if (error.code === "23505") return errorResponse("Department name already exists", 409, "DUPLICATE");
    console.error("departments[id].PUT:", error);
    return errorResponse("Failed to update department", 500);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("departments[id].DELETE:", error);
    if (error.code === "23503") return errorResponse("Cannot delete department with existing squads or agents", 409, "FK_CONSTRAINT");
    return errorResponse("Failed to delete department", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
