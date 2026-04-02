import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("approvals")
    .select("*, agents:requester_id(name, initials), profiles:approver_id(name)")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Approval not found", 404, "NOT_FOUND");
    console.error("approvals[id].GET:", error);
    return errorResponse("Failed to fetch approval", 500);
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId, userId } = auth;

  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400, "INVALID_BODY");
  }

  const { status, metadata } = body as {
    status?: string; metadata?: Record<string, unknown>;
  };

  const updates: Record<string, unknown> = {};
  if (status !== undefined) {
    updates.status = status;
    if (status === "aprovado" || status === "rejeitado") {
      updates.resolved_at = new Date().toISOString();
    }
  }
  if (metadata !== undefined) updates.metadata = metadata;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("approvals")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Approval not found", 404, "NOT_FOUND");
    console.error("approvals[id].PUT:", error);
    return errorResponse("Failed to update approval", 500);
  }

  // Record approval action in audit trail
  if (status === "aprovado" || status === "rejeitado") {
    await supabase.from("approval_actions").insert({
      approval_id: id,
      user_id: userId,
      action: status,
      metadata: {},
    });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("approvals")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("approvals[id].DELETE:", error);
    return errorResponse("Failed to delete approval", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
