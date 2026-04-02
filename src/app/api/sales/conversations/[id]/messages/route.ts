import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse, parsePagination } from "@/lib/api/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id: conversationId } = await params;
  const { limit, offset } = parsePagination(request.nextUrl.searchParams);

  // Verify conversation belongs to tenant
  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("tenant_id", tenantId)
    .single();

  if (convError || !conv) return errorResponse("Conversation not found", 404, "NOT_FOUND");

  const { data, error, count } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("messages.GET:", error);
    return errorResponse("Failed to fetch messages", 500);
  }

  return NextResponse.json({ data, total: count, limit, offset });
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;
  const { id: conversationId } = await params;

  // Verify conversation belongs to tenant
  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("tenant_id", tenantId)
    .single();

  if (convError || !conv) return errorResponse("Conversation not found", 404, "NOT_FOUND");

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }

  const { content, direction, source, sentiment, metadata } = body as {
    content?: string; direction?: string; source?: string;
    sentiment?: string; metadata?: Record<string, unknown>;
  };

  if (!content || !direction) return errorResponse("content and direction are required", 400, "VALIDATION_ERROR");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId, content, direction,
      source: source ?? "cliente", sentiment: sentiment ?? null,
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("messages.POST:", error);
    return errorResponse("Failed to send message", 500);
  }

  // Update conversation last_message_at
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.json({ data }, { status: 201 });
}
