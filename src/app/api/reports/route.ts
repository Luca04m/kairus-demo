import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  let query = supabase
    .from("reports")
    .select("*, agents:agent_id(name), departments:department_id(name)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;

  if (error) {
    console.error("reports.GET:", error);
    return errorResponse("Failed to fetch reports", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { title, type, period, agent_id, department_id, summary, data: reportData, metadata } = body as {
    title?: string; type?: string; period?: string; agent_id?: string;
    department_id?: string; summary?: string; data?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  };

  if (!title || !period) return errorResponse("title and period are required", 400, "VALIDATION_ERROR");

  const { data: created, error } = await supabase
    .from("reports")
    .insert({
      tenant_id: tenantId, title, type: type ?? "semanal",
      period, agent_id: agent_id ?? null,
      department_id: department_id ?? null,
      summary: summary ?? null, status: "gerando",
      data: reportData ?? {}, metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("reports.POST:", error);
    return errorResponse("Failed to create report", 500);
  }

  return NextResponse.json({ data: created }, { status: 201 });
}
