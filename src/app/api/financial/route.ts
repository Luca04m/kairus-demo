import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAuthError, errorResponse } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthContext();
  if (isAuthError(auth)) return auth;
  const { supabase, tenantId } = auth;

  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period");
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  // Fetch financial records
  let recordsQuery = supabase
    .from("financial_records")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("reference_date", { ascending: false });

  if (period) recordsQuery = recordsQuery.eq("period", period);
  if (category) recordsQuery = recordsQuery.eq("category", category);
  if (type) recordsQuery = recordsQuery.eq("type", type);

  // Fetch margins
  let marginsQuery = supabase
    .from("financial_margins")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("period", { ascending: false });

  if (period) marginsQuery = marginsQuery.eq("period", period);

  const [recordsResult, marginsResult] = await Promise.all([recordsQuery, marginsQuery]);

  if (recordsResult.error) {
    console.error("financial.GET records:", recordsResult.error);
    return errorResponse("Failed to fetch financial records", 500);
  }
  if (marginsResult.error) {
    console.error("financial.GET margins:", marginsResult.error);
    return errorResponse("Failed to fetch financial margins", 500);
  }

  const records = recordsResult.data ?? [];

  // Compute summary metrics
  const receita = records.filter((r) => r.type === "receita").reduce((s, r) => s + Number(r.amount), 0);
  const despesa = records.filter((r) => r.type === "despesa").reduce((s, r) => s + Number(r.amount), 0);
  const custo = records.filter((r) => r.type === "custo").reduce((s, r) => s + Number(r.amount), 0);

  return NextResponse.json({
    data: {
      records,
      margins: marginsResult.data ?? [],
      summary: {
        receita_total: receita,
        despesa_total: despesa,
        custo_total: custo,
        resultado_liquido: receita - despesa - custo,
      },
    },
  });
}
