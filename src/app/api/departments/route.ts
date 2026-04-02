import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { limit, offset } = parsePagination(request.nextUrl.searchParams);

  const { data, error, count } = await supabase
    .from("departments")
    .select("*, squads(id)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("order_index", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("departments.GET:", error);
    return errorResponse("Failed to fetch departments", 500);
  }

  const result = (data ?? []).map((d) => ({
    ...d,
    squad_count: Array.isArray(d.squads) ? d.squads.length : 0,
    squads: undefined,
  }));

  return NextResponse.json({ data: result, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { name, description, color, icon, emoji, order_index } = body as {
    name?: string; description?: string; color?: string; icon?: string; emoji?: string; order_index?: number;
  };

  if (!name) return errorResponse("name is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("departments")
    .insert({
      tenant_id: tenantId, name,
      description: description ?? null,
      color: color ?? "#6366f1", icon: icon ?? "Building",
      emoji: emoji ?? null, order_index: order_index ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("departments.POST:", error);
    if (error.code === "23505") return errorResponse("Department name already exists", 409, "DUPLICATE");
    return errorResponse("Failed to create department", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
