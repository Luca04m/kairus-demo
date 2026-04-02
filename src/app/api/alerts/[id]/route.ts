import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("alerts")
    .select("*, agents(name, initials)")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Alert not found", 404, "NOT_FOUND");
    console.error("alerts[id].GET:", error);
    return errorResponse("Failed to fetch alert", 500);
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

  const { title, message, severity, status, department, metadata } = body as {
    title?: string; message?: string; severity?: string;
    status?: string; department?: string; metadata?: Record<string, unknown>;
  };

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (message !== undefined) updates.message = message;
  if (severity !== undefined) updates.severity = severity;
  if (status !== undefined) {
    updates.status = status;
    if (status === "resolvido") updates.resolved_at = new Date().toISOString();
  }
  if (department !== undefined) updates.department = department;
  if (metadata !== undefined) updates.metadata = metadata;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("alerts")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Alert not found", 404, "NOT_FOUND");
    console.error("alerts[id].PUT:", error);
    return errorResponse("Failed to update alert", 500);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("alerts")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("alerts[id].DELETE:", error);
    return errorResponse("Failed to delete alert", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
