import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { limit, offset } = parsePagination(request.nextUrl.searchParams);

  const [roomsResult, connectionsResult] = await Promise.all([
    supabase
      .from("world_rooms")
      .select("*, agent_presence(agent_id, status, current_task)", { count: "exact" })
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1),
    supabase
      .from("world_connections")
      .select("*"),
  ]);

  if (roomsResult.error) {
    console.error("world_rooms.GET:", roomsResult.error);
    return errorResponse("Failed to fetch rooms", 500);
  }

  // Filter connections to only include those for fetched rooms
  const roomIds = new Set((roomsResult.data ?? []).map((r) => r.id));
  const connections = (connectionsResult.data ?? []).filter(
    (c) => roomIds.has(c.room_a_id) || roomIds.has(c.room_b_id),
  );

  return NextResponse.json({
    data: { rooms: roomsResult.data, connections },
    total: roomsResult.count,
    limit,
    offset,
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { name, domain, description, x, y, width, height, status, color, icon, metadata } = body as {
    name?: string; domain?: string; description?: string;
    x?: number; y?: number; width?: number; height?: number;
    status?: string; color?: string; icon?: string; metadata?: Record<string, unknown>;
  };

  if (!name) return errorResponse("name is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("world_rooms")
    .insert({
      tenant_id: tenantId, name, domain: domain ?? null,
      description: description ?? null, x: x ?? 0, y: y ?? 0,
      width: width ?? 200, height: height ?? 150,
      status: status ?? "ativo", color: color ?? null,
      icon: icon ?? null, metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("world_rooms.POST:", error);
    return errorResponse("Failed to create room", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
