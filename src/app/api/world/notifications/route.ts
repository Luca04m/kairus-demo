import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const unread = searchParams.get("unread");

  let query = supabase
    .from("world_notifications")
    .select("*, world_rooms(name)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (unread === "true") query = query.is("read_at", null);

  const { data, error, count } = await query;

  if (error) {
    console.error("world_notifications.GET:", error);
    return errorResponse("Failed to fetch notifications", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { message, type, room_id, metadata } = body as {
    message?: string; type?: string; room_id?: string; metadata?: Record<string, unknown>;
  };

  if (!message) return errorResponse("message is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("world_notifications")
    .insert({
      tenant_id: tenantId, message,
      type: type ?? "sistema", room_id: room_id ?? null,
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("world_notifications.POST:", error);
    return errorResponse("Failed to create notification", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { ids } = body as { ids?: string[] };

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return errorResponse("ids array is required", 400, "VALIDATION_ERROR");
  }

  const { data, error } = await supabase
    .from("world_notifications")
    .update({ read_at: new Date().toISOString() })
    .in("id", ids)
    .eq("tenant_id", tenantId)
    .select();

  if (error) {
    console.error("world_notifications.PATCH:", error);
    return errorResponse("Failed to mark notifications as read", 500);
  }

  return NextResponse.json({ data });
}
