import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination, PRIVATE_CACHE_HEADERS } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { limit, offset } = parsePagination(request.nextUrl.searchParams);
  const status = request.nextUrl.searchParams.get("status");

  let query = supabase
    .from("integrations")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("provider", { ascending: true })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;

  if (error) {
    console.error("integrations.GET:", error);
    return errorResponse("Failed to fetch integrations", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset }, { headers: PRIVATE_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { provider, type, display_name, config, status, metadata } = body as {
    provider?: string; type?: string; display_name?: string;
    config?: Record<string, unknown>; status?: string;
    metadata?: Record<string, unknown>;
  };

  if (!provider || !type) return errorResponse("provider and type are required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("integrations")
    .insert({
      tenant_id: tenantId,
      provider,
      type,
      display_name: display_name ?? null,
      config: config ?? {},
      status: status ?? "configurando",
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("integrations.POST:", error);
    return errorResponse("Failed to create integration", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
