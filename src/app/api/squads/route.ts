import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const department_id = searchParams.get("department_id");

  let query = supabase
    .from("squads")
    .select("*, departments(name), agents(id, name, status)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (department_id) query = query.eq("department_id", department_id);

  const { data, error, count } = await query;

  if (error) {
    console.error("squads.GET:", error);
    return errorResponse("Failed to fetch squads", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { name, department_id, description, status } = body as {
    name?: string; department_id?: string; description?: string; status?: string;
  };

  if (!name || !department_id) return errorResponse("name and department_id are required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("squads")
    .insert({
      tenant_id: tenantId, name, department_id,
      description: description ?? null, status: status ?? "ativo",
    })
    .select()
    .single();

  if (error) {
    console.error("squads.POST:", error);
    if (error.code === "23505") return errorResponse("Squad name already exists in this department", 409, "DUPLICATE");
    return errorResponse("Failed to create squad", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
