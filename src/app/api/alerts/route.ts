import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const department = searchParams.get("department");

  let query = supabase
    .from("alerts")
    .select("*, agents(name, initials)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (severity) query = query.eq("severity", severity);
  if (status) query = query.eq("status", status);
  if (department) query = query.eq("department", department);

  const { data, error, count } = await query;

  if (error) {
    console.error("alerts.GET:", error);
    return errorResponse("Failed to fetch alerts", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { title, message, severity, agent_id, department, metadata } = body as {
    title?: string; message?: string; severity?: string; agent_id?: string;
    department?: string; metadata?: Record<string, unknown>;
  };

  if (!title) return errorResponse("title is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("alerts")
    .insert({
      tenant_id: tenantId, title, message: message ?? null,
      severity: severity ?? "info", agent_id: agent_id ?? null,
      department: department ?? null, metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("alerts.POST:", error);
    return errorResponse("Failed to create alert", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
