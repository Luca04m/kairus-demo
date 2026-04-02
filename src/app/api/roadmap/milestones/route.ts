import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { limit, offset } = parsePagination(request.nextUrl.searchParams);

  const { data, error, count } = await supabase
    .from("roadmap_milestones")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("date", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("milestones.GET:", error);
    return errorResponse("Failed to fetch milestones", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { title, date, status, metadata } = body as {
    title?: string; date?: string; status?: string; metadata?: Record<string, unknown>;
  };

  if (!title || !date) return errorResponse("title and date are required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("roadmap_milestones")
    .insert({
      tenant_id: tenantId, title, date,
      status: status ?? "pendente", metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("milestones.POST:", error);
    return errorResponse("Failed to create milestone", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
