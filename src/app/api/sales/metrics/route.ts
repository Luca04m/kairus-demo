import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period");
  const agent_id = searchParams.get("agent_id");

  let query = supabase
    .from("sales_metrics")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("period", { ascending: false });

  if (period) query = query.eq("period", period);
  if (agent_id) query = query.eq("agent_id", agent_id);

  const { data, error } = await query;

  if (error) {
    console.error("sales_metrics.GET:", error);
    return errorResponse("Failed to fetch sales metrics", 500);
  }

  // Aggregate totals
  const metrics = data ?? [];
  const aggregated = {
    conversations_total: metrics.reduce((s, m) => s + m.conversations_total, 0),
    resolved: metrics.reduce((s, m) => s + m.resolved, 0),
    avg_conversion_rate: metrics.length > 0
      ? metrics.reduce((s, m) => s + Number(m.conversion_rate), 0) / metrics.length
      : 0,
    total_revenue: metrics.reduce((s, m) => s + Number(m.revenue_generated), 0),
  };

  return NextResponse.json({ data: { metrics, aggregated } });
}
