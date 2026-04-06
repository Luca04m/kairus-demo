import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination, PRIVATE_CACHE_HEADERS } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const status = searchParams.get("status");
  const segment = searchParams.get("segment");
  const search = searchParams.get("search");

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (segment) query = query.eq("segment", segment);
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("clients.GET:", error);
    return errorResponse("Failed to fetch clients", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset }, { headers: PRIVATE_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { name, email, phone, company, segment, status, source, tags, metadata } = body as {
    name?: string; email?: string; phone?: string; company?: string;
    segment?: string; status?: string; source?: string;
    tags?: string[]; metadata?: Record<string, unknown>;
  };

  if (!name) return errorResponse("name is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("clients")
    .insert({
      tenant_id: tenantId, name, email: email ?? null,
      phone: phone ?? null, company: company ?? null,
      segment: segment ?? "b2c", status: status ?? "lead",
      source: source ?? null, tags: tags ?? [],
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("clients.POST:", error);
    return errorResponse("Failed to create client", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
