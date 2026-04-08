// Shared chart theme and helpers for Financeiro module

export const BRAND = "#01C461";
export const BRAND_DIM = "rgba(1,196,97,0.18)";

export const CHART_THEME = {
  grid: { stroke: "rgba(255,255,255,0.06)", strokeDasharray: "3 3" },
  axis: { stroke: "rgba(255,255,255,0.08)", tick: { fill: "rgba(255,255,255,0.35)", fontSize: 11 } },
};

export const BAR_COLORS = [
  "#01C461", "rgba(1,196,97,0.7)", "rgba(1,196,97,0.45)",
  "#ef4444", "#f59e0b", "#f97316", "#14b8a6", "#a1a1aa", "#22c55e",
];

export function parsePercent(str: string): number {
  return parseFloat(str.replace(",", "."));
}

export function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

// Custom tooltip for area/line charts
export function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[rgba(1,196,97,0.25)] bg-[#0d0d14] px-4 py-3 shadow-xl">
      <p className="text-xs text-[rgba(255,255,255,0.4)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        R$ {payload[0].value.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}
