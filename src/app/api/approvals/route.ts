import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const status = searchParams.get("status");
  const urgency = searchParams.get("urgency");
  const type = searchParams.get("type");

  let query = supabase
    .from("approvals")
    .select("*, agents:requester_id(name, initials), profiles:approver_id(name)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (urgency) query = query.eq("urgency", urgency);
  if (type) query = query.eq("type", type);

  const { data, error, count } = await query;

  if (error) {
    console.error("approvals.GET:", error);
    return errorResponse("Failed to fetch approvals", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { title, description, type, requester_id, approver_id, amount, urgency, metadata, expires_at } = body as {
    title?: string; description?: string; type?: string; requester_id?: string;
    approver_id?: string; amount?: number; urgency?: string;
    metadata?: Record<string, unknown>; expires_at?: string;
  };

  if (!title) return errorResponse("title is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("approvals")
    .insert({
      tenant_id: tenantId, title, description: description ?? null,
      type: type ?? "geral", requester_id: requester_id ?? null,
      approver_id: approver_id ?? null, amount: amount ?? null,
      urgency: urgency ?? "media", metadata: metadata ?? {},
      expires_at: expires_at ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("approvals.POST:", error);
    return errorResponse("Failed to create approval", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
