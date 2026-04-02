import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id } = await params;

  const { data, error } = await supabase
    .from("world_rooms")
    .select("*, agent_presence(*, agents(id, name, initials, status, type))")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) return errorResponse("Room not found", 404, "NOT_FOUND");
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id } = await params;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const allowed = ["name", "domain", "description", "x", "y", "width", "height", "status", "color", "icon", "metadata"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) { if (key in body) update[key] = body[key]; }
  if (Object.keys(update).length === 0) return errorResponse("No valid fields to update", 400);

  const { data, error } = await supabase
    .from("world_rooms")
    .update(update)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();

  if (error) {
    console.error("world_rooms.PATCH:", error);
    return errorResponse("Failed to update room", 500);
  }
  if (!data) return errorResponse("Room not found", 404, "NOT_FOUND");

  return NextResponse.json({ data });
}
