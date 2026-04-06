import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination, PRIVATE_CACHE_HEADERS } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const department_id = searchParams.get("department_id");
  const squad_id = searchParams.get("squad_id");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let query = supabase
    .from("agents")
    .select("*, departments(name, color, icon, emoji), squads(name)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (department_id) query = query.eq("department_id", department_id);
  if (squad_id) query = query.eq("squad_id", squad_id);
  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query;

  if (error) {
    console.error("agents.GET:", error);
    return errorResponse("Failed to fetch agents", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset }, { headers: PRIVATE_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400, "INVALID_BODY");
  }

  const { name, initials, type, department_id, squad_id, description, skills, config } = body as {
    name?: string; initials?: string; type?: string; department_id?: string;
    squad_id?: string; description?: string; skills?: string[]; config?: Record<string, unknown>;
  };

  if (!name || !initials || !department_id) {
    return errorResponse("name, initials, and department_id are required", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("agents")
    .insert({
      tenant_id: tenantId,
      name, initials, type: type ?? "ai",
      department_id, squad_id: squad_id ?? null,
      description: description ?? null,
      skills: skills ?? [],
      config: config ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("agents.POST:", error);
    return errorResponse("Failed to create agent", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
