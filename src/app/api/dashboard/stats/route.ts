import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, PRIVATE_CACHE_HEADERS } from "@/lib/api/auth";
import { getVaultDashboardData } from "@/lib/vault-data";

export async function GET(_request: NextRequest) {
  // 1. Try vault data first (server-side, no auth needed)
  const vaultData = getVaultDashboardData();
  if (vaultData) {
    const stats = {
      total_agents: 5,
      active_agents: 5,
      active_alerts: 7,
      pending_approvals: 2,
      open_conversations: 3,
      total_revenue: parseFloat(vaultData.receitaTotal.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.')) || 0,
      vault_source: true,
      kpis: vaultData,
    };
    return NextResponse.json({ data: stats }, { headers: PRIVATE_CACHE_HEADERS });
  }

  // 2. Fallback to Supabase when vault not configured
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  // Run all KPI queries in parallel
  const [
    agentsResult,
    activeAgentsResult,
    alertsResult,
    pendingApprovalsResult,
    conversationsResult,
    revenueResult,
  ] = await Promise.all([
    supabase.from("agents").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase.from("agents").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("status", "ativo"),
    supabase.from("alerts").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("status", "ativo"),
    supabase.from("approvals").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("status", "pendente"),
    supabase.from("conversations").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).in("status", ["aberta", "em_andamento"]),
    supabase.from("financial_records").select("amount").eq("tenant_id", tenantId).eq("type", "receita"),
  ]);

  const totalRevenue = (revenueResult.data ?? []).reduce((s, r) => s + Number(r.amount), 0);

  const stats = {
    total_agents: agentsResult.count ?? 0,
    active_agents: activeAgentsResult.count ?? 0,
    active_alerts: alertsResult.count ?? 0,
    pending_approvals: pendingApprovalsResult.count ?? 0,
    open_conversations: conversationsResult.count ?? 0,
    total_revenue: totalRevenue,
  };

  return NextResponse.json({ data: stats }, { headers: PRIVATE_CACHE_HEADERS });
}
