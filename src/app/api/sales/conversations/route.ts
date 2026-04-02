import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const { limit, offset } = parsePagination(searchParams);
  const status = searchParams.get("status");
  const channel = searchParams.get("channel");
  const agent_id = searchParams.get("agent_id");

  let query = supabase
    .from("conversations")
    .select("*, clients(name, email, segment), agents(name, initials)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (channel) query = query.eq("channel", channel);
  if (agent_id) query = query.eq("agent_id", agent_id);

  const { data, error, count } = await query;

  if (error) {
    console.error("conversations.GET:", error);
    return errorResponse("Failed to fetch conversations", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { client_id, agent_id, channel, subject, metadata } = body as {
    client_id?: string; agent_id?: string; channel?: string;
    subject?: string; metadata?: Record<string, unknown>;
  };

  if (!client_id) return errorResponse("client_id is required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      tenant_id: tenantId, client_id, agent_id: agent_id ?? null,
      channel: channel ?? "whatsapp", subject: subject ?? null,
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("conversations.POST:", error);
    return errorResponse("Failed to create conversation", 500);
  }

  return NextResponse.json({ data }, { status: 201 });
}
