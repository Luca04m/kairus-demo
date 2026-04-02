import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Campaign not found", 404, "NOT_FOUND");
    console.error("campaigns[id].GET:", error);
    return errorResponse("Failed to fetch campaign", 500);
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

  const { name, description, channel, status, budget, spent, start_date, end_date, metadata } = body as {
    name?: string; description?: string; channel?: string; status?: string;
    budget?: number; spent?: number; start_date?: string; end_date?: string;
    metadata?: Record<string, unknown>;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (channel !== undefined) updates.channel = channel;
  if (status !== undefined) updates.status = status;
  if (budget !== undefined) updates.budget = budget;
  if (spent !== undefined) updates.spent = spent;
  if (start_date !== undefined) updates.start_date = start_date;
  if (end_date !== undefined) updates.end_date = end_date;
  if (metadata !== undefined) updates.metadata = metadata;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("campaigns")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Campaign not found", 404, "NOT_FOUND");
    console.error("campaigns[id].PUT:", error);
    return errorResponse("Failed to update campaign", 500);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("campaigns[id].DELETE:", error);
    return errorResponse("Failed to delete campaign", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
