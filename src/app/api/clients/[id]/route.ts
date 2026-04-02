import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Client not found", 404, "NOT_FOUND");
    console.error("clients[id].GET:", error);
    return errorResponse("Failed to fetch client", 500);
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

  const { name, email, phone, company, segment, status, source, tags, metadata } = body as {
    name?: string; email?: string; phone?: string; company?: string;
    segment?: string; status?: string; source?: string;
    tags?: string[]; metadata?: Record<string, unknown>;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (company !== undefined) updates.company = company;
  if (segment !== undefined) updates.segment = segment;
  if (status !== undefined) updates.status = status;
  if (source !== undefined) updates.source = source;
  if (tags !== undefined) updates.tags = tags;
  if (metadata !== undefined) updates.metadata = metadata;

  if (Object.keys(updates).length === 0) {
    return errorResponse("No fields to update", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return errorResponse("Client not found", 404, "NOT_FOUND");
    console.error("clients[id].PUT:", error);
    return errorResponse("Failed to update client", 500);
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("clients[id].DELETE:", error);
    return errorResponse("Failed to delete client", 500);
  }

  return NextResponse.json({ data: null }, { status: 200 });
}
