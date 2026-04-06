import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination, PRIVATE_CACHE_HEADERS } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const status = searchParams.get("status");
  const channel = searchParams.get("channel");

  let query = supabase
    .from("campaigns")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (channel) query = query.eq("channel", channel);

  const { data, error, count } = await query;

  if (error) {
    console.error("campaigns.GET:", error);
    return errorResponse("Failed to fetch campaigns", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset }, { headers: PRIVATE_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { name, description, channel, budget, start_date, end_date, metadata } = body as {
    name?: string; description?: string; channel?: string; budget?: number;
    start_date?: string; end_date?: string; metadata?: Record<string, unknown>;
  };

  if (!name) return errorResponse("name is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      tenant_id: tenantId, name, description: description ?? null,
      channel: channel ?? "meta_ads", budget: budget ?? 0,
      start_date: start_date ?? null, end_date: end_date ?? null,
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("campaigns.POST:", error);
    return errorResponse("Failed to create campaign", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
