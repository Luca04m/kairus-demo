import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination, PRIVATE_CACHE_HEADERS } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const category = searchParams.get("category");

  let query = supabase
    .from("roadmap_items")
    .select("*, departments:owner_department_id(name), squads:owner_squad_id(name), agents:owner_agent_id(name)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (category) query = query.eq("category", category);

  const { data, error, count } = await query;

  if (error) {
    console.error("roadmap.GET:", error);
    return errorResponse("Failed to fetch roadmap items", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset }, { headers: PRIVATE_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { title, description, status, priority, category, owner_department_id, owner_squad_id, owner_agent_id, start_date, end_date, tags, metadata } = body as {
    title?: string; description?: string; status?: string; priority?: string;
    category?: string; owner_department_id?: string; owner_squad_id?: string;
    owner_agent_id?: string; start_date?: string; end_date?: string;
    tags?: string[]; metadata?: Record<string, unknown>;
  };

  if (!title) return errorResponse("title is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("roadmap_items")
    .insert({
      tenant_id: tenantId, title, description: description ?? null,
      status: status ?? "backlog", priority: priority ?? "media",
      category: category ?? null, owner_department_id: owner_department_id ?? null,
      owner_squad_id: owner_squad_id ?? null, owner_agent_id: owner_agent_id ?? null,
      start_date: start_date ?? null, end_date: end_date ?? null,
      tags: tags ?? [], metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("roadmap.POST:", error);
    return errorResponse("Failed to create roadmap item", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
