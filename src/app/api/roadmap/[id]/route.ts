import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id } = await params;

  const { data, error } = await supabase
    .from("roadmap_items")
    .select("*, roadmap_comments(*, profiles:user_id(name), agents:agent_id(name))")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) return errorResponse("Roadmap item not found", 404, "NOT_FOUND");
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id } = await params;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const allowed = ["title", "description", "status", "priority", "category", "owner_department_id", "owner_squad_id", "owner_agent_id", "start_date", "end_date", "progress", "tags", "metadata"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) { if (key in body) update[key] = body[key]; }
  if (Object.keys(update).length === 0) return errorResponse("No valid fields to update", 400);

  const { data, error } = await supabase
    .from("roadmap_items")
    .update(update)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    console.error("roadmap.PATCH:", error);
    return errorResponse("Failed to update roadmap item", 500);
  }
  if (!data) return errorResponse("Roadmap item not found", 404, "NOT_FOUND");

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id } = await params;

  const { error } = await supabase.from("roadmap_items").delete().eq("id", id).eq("tenant_id", tenantId);
  if (error) {
    console.error("roadmap.DELETE:", error);
    return errorResponse("Failed to delete roadmap item", 500);
  }

  return NextResponse.json({ data: { id } });
}
