"use client";
import { useState } from "react";
import {
  Banknote, TrendingUp, Eye, Target, AlertTriangle,
  Megaphone, BarChart3, Globe, Users,
  Heart, MessageCircle, Share2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "@/components/charts";
import {
  CAMPANHAS_KPIS, CAMPANHAS_TABLE,
  SPEND_VS_REVENUE, CTR_POR_CAMPANHA,
  REVENUE_POR_CANAL, MIX_PAGAMENTO, TOP_CUPONS,
  AUDIENCIA_STATS, IDADE_CHART_DATA, ENGAGEMENT_STATS, TOP_POSTS,
} from "@/data/marketing";

/* ─── Theme ───────────────────────────────────────────────────── */

const CHART_THEME = {
  grid: { stroke: "rgba(255,255,255,0.06)", strokeDasharray: "3 3" },
  axis: { stroke: "rgba(255,255,255,0.08)", tick: { fill: "rgba(255,255,255,0.4)", fontSize: 11 } },
  tooltip: {
    contentStyle: {
      backgroundColor: "#0d0d0d",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      color: "white",
      fontSize: "12px",
      padding: "10px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    },
    labelStyle: { color: "rgba(255,255,255,0.6)", marginBottom: "6px", fontSize: "11px" },
  },
};

const ICON_MAP: Record<string, React.ElementType> = { Banknote, TrendingUp, Eye, Target };

const TABS = [
  { id: "campanhas", label: "Campanhas", icon: Megaphone },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "canais", label: "Canais", icon: Globe },
  { id: "audiencia", label: "Audiencia", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Helpers ─────────────────────────────────────────────────── */

function getRoasColor(roas: string): string {
  const num = parseFloat(roas.replace(",", ".").replace("x", ""));
  if (num >= 5) return "text-emerald-400 font-medium";
  if (num >= 2) return "text-amber-400 font-medium";
  if (num > 0) return "text-red-400 font-medium";
  return "text-[rgba(255,255,255,0.4)]";
}

function getCtrColor(ctr: string): string {
  const num = parseFloat(ctr.replace(",", ".").replace("%", ""));
  if (num >= 4) return "text-emerald-400";
  if (num >= 2.5) return "text-amber-400";
  return "text-red-400";
}

function fmtBRL(v: number): string {
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

/* ─── Custom Tooltip ──────────────────────────────────────────── */

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_THEME.tooltip.contentStyle}>
      <p style={CHART_THEME.tooltip.labelStyle}>{label}</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-[rgba(255,255,255,0.5)] text-xs">{e.name}:</span>
          <span className="text-white text-xs font-medium">
            {typeof e.value === "number" ? e.value.toLocaleString("pt-BR") : e.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Tab: Campanhas ──────────────────────────────────────────── */

function TabCampanhas() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CAMPANHAS_KPIS.map((kpi) => {
          const Icon = ICON_MAP[kpi.icon];
          return (
            <div
              key={kpi.label}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={14} className="text-[rgba(255,255,255,0.4)]" />
                <span className="text-xs text-[rgba(255,255,255,0.4)]">{kpi.label}</span>
              </div>
              <div className="text-2xl font-semibold text-white">{kpi.valor}</div>
            </div>
          );
        })}
      </div>

      {/* Pixel warning */}
      <div className="glass-card rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[rgba(255,255,255,0.65)] leading-relaxed">
          <span className="text-amber-400 font-medium">Pixel Meta quebrado desde 15/Mar/2026.</span>{" "}
          Purchases rastreados apenas em Set/2025.
        </p>
      </div>

      {/* Campaigns table */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={14} className="text-[rgba(255,255,255,0.4)]" />
          <span className="text-sm font-medium text-white">Campanhas Meta Ads</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                {["#", "Campanha", "Spend", "Clicks", "CTR", "Purchases", "ROAS"].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAMPANHAS_TABLE.map((c, idx) => (
                <tr
                  key={c.nome}
                  className={`border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  <td className="px-3 py-3 text-xs text-[rgba(255,255,255,0.5)]">{idx + 1}</td>
                  <td className="px-3 py-3 text-sm text-white font-medium">{c.nome}</td>
                  <td className="px-3 py-3 text-sm text-[rgba(255,255,255,0.8)]">{c.spend}</td>
                  <td className="px-3 py-3 text-sm text-[rgba(255,255,255,0.7)]">{c.clicks}</td>
                  <td className={`px-3 py-3 text-sm ${getCtrColor(c.ctr)}`}>{c.ctr}</td>
                  <td className="px-3 py-3 text-sm text-white font-medium">{c.purchases}</td>
                  <td className={`px-3 py-3 text-sm ${getRoasColor(c.roas)}`}>{c.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Performance ────────────────────────────────────────── */

function TabPerformance() {
  return (
    <div className="space-y-6">
      {/* KPI highlights */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Melhor Campanha</span>
          <div className="text-lg font-semibold text-emerald-400 mt-1">Vendas R$100/dia</div>
          <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1">ROAS 6,6x</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Total Clicks</span>
          <div className="text-lg font-semibold text-white mt-1">275.475+</div>
          <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1">6 campanhas ativas</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Revenue Rastreado</span>
          <div className="text-lg font-semibold text-white mt-1">R$ 45.173</div>
          <div className="text-xs text-amber-400/70 mt-1">Somente Set/25 (pixel ativo)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend vs Revenue */}
        <div className="glass-card rounded-xl p-5">
          <span className="text-sm font-medium text-white mb-4 block">Spend vs Revenue por Mes</span>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SPEND_VS_REVENUE}>
              <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
              <XAxis dataKey="mes" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} />
              <YAxis stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} formatter={(v: string) => <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{v === "spend" ? "Spend" : "Revenue"}</span>} wrapperStyle={{ paddingBottom: "12px" }} />
              <Bar dataKey="spend" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CTR por campanha */}
        <div className="glass-card rounded-xl p-5">
          <span className="text-sm font-medium text-white mb-4 block">CTR por Campanha (%)</span>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={CTR_POR_CAMPANHA} layout="vertical">
              <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
              <XAxis type="number" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
              <YAxis dataKey="nome" type="category" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="ctr" fill="#01C461" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Canais ─────────────────────────────────────────────── */

function TabCanais() {
  const totalRevenue = REVENUE_POR_CANAL.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue por canal - donut */}
        <div className="glass-card rounded-xl p-5">
          <span className="text-sm font-medium text-white mb-4 block">Revenue por Canal</span>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={REVENUE_POR_CANAL}
                dataKey="revenue"
                nameKey="canal"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={2}
              >
                {REVENUE_POR_CANAL.map((entry) => (
                  <Cell key={entry.canal} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }: { active?: boolean; payload?: Array<{ name?: string; value?: number }> }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  const pct = ((Number(d.value) / totalRevenue) * 100).toFixed(1);
                  return (
                    <div style={CHART_THEME.tooltip.contentStyle}>
                      <p className="text-white text-xs font-medium">{d.name}</p>
                      <p className="text-[rgba(255,255,255,0.6)] text-xs">{fmtBRL(Number(d.value))} ({pct}%)</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {REVENUE_POR_CANAL.map((c) => (
              <div key={c.canal} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-[rgba(255,255,255,0.5)] truncate">{c.canal}</span>
                <span className="text-white font-medium ml-auto">{fmtBRL(c.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mix de Pagamento + Top Cupons */}
        <div className="space-y-6">
          {/* Payment mix */}
          <div className="glass-card rounded-xl p-5">
            <span className="text-sm font-medium text-white mb-4 block">Mix de Pagamento</span>
            <div className="flex items-center gap-4">
              <div className="w-full h-6 rounded-full overflow-hidden bg-[rgba(255,255,255,0.08)] flex">
                {MIX_PAGAMENTO.map((p) => (
                  <div
                    key={p.tipo}
                    className="h-full transition-all"
                    style={{ width: `${p.valor / (MIX_PAGAMENTO[0].valor + MIX_PAGAMENTO[1].valor) * 100}%`, backgroundColor: p.color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-6 mt-3">
              {MIX_PAGAMENTO.map((p) => (
                <div key={p.tipo} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs text-[rgba(255,255,255,0.5)]">{p.tipo}</span>
                  <span className="text-xs text-white font-medium">{fmtBRL(p.valor)} ({p.pct})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cupons */}
          <div className="glass-card rounded-xl p-5">
            <span className="text-sm font-medium text-white mb-4 block">Top Cupons</span>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.1)]">
                    {["Cupom", "Usos", "Revenue"].map((col) => (
                      <th key={col} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_CUPONS.map((c) => (
                    <tr key={c.cupom} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                      <td className="px-3 py-2.5 text-sm text-white font-medium">{c.cupom}</td>
                      <td className="px-3 py-2.5 text-sm text-[rgba(255,255,255,0.7)]">{c.usos.toLocaleString("pt-BR")}</td>
                      <td className="px-3 py-2.5 text-sm text-emerald-400 font-medium">{c.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Audiencia ──────────────────────────────────────────── */

function TabAudiencia() {
  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={14} className="text-[#01C461]/70" />
            <span className="text-xs text-[rgba(255,255,255,0.4)]">Seguidores</span>
          </div>
          <div className="text-2xl font-semibold text-white">{AUDIENCIA_STATS.followers.toLocaleString("pt-BR")}</div>
          <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1">{AUDIENCIA_STATS.brasilPct} Brasil</div>
        </div>
        {AUDIENCIA_STATS.genero.map((g) => (
          <div key={g.label} className="glass-card rounded-xl p-4">
            <span className="text-xs text-[rgba(255,255,255,0.4)]">{g.label}</span>
            <div className="text-2xl font-semibold text-white mt-1">{g.pct}</div>
          </div>
        ))}
      </div>

      {/* Engagement comparison */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Engagement Medio - Reels</span>
          <div className="text-xl font-semibold text-emerald-400 mt-1">{ENGAGEMENT_STATS.reelsAvg.toLocaleString("pt-BR")}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Engagement Medio - Imagens</span>
          <div className="text-xl font-semibold text-white mt-1">{ENGAGEMENT_STATS.imageAvg.toLocaleString("pt-BR")}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Total Posts</span>
          <div className="text-xl font-semibold text-white mt-1">{ENGAGEMENT_STATS.totalPosts}</div>
          <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1">{ENGAGEMENT_STATS.periodo}</div>
        </div>
      </div>

      {/* Age distribution chart */}
      <div className="glass-card rounded-xl p-5">
        <span className="text-sm font-medium text-white mb-4 block">Distribuicao por Idade e Genero</span>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={IDADE_CHART_DATA}>
            <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray={CHART_THEME.grid.strokeDasharray} />
            <XAxis dataKey="faixa" stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} />
            <YAxis stroke={CHART_THEME.axis.stroke} tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} formatter={(v: string) => <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{v === "masculino" ? "Masculino" : "Feminino"}</span>} wrapperStyle={{ paddingBottom: "12px" }} />
            <Bar dataKey="masculino" fill="#01C461" radius={[4, 4, 0, 0]} />
            <Bar dataKey="feminino" fill="rgba(1,196,97,0.5)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 10 posts */}
      <div className="glass-card rounded-xl p-5">
        <span className="text-sm font-medium text-white mb-4 block">Top 10 Posts</span>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)]">
                {["#", "Tipo", "Descricao", "Likes", "Comentarios", "Shares", "Engagement"].map((col) => (
                  <th key={col} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)]">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_POSTS.map((p, idx) => (
                <tr
                  key={`${p.descricao}`}
                  className={`border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  <td className="px-3 py-2.5 text-xs text-[rgba(255,255,255,0.5)]">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.tipo === "Reel"
                        ? "bg-[rgba(1,196,97,0.15)] text-[#01C461]"
                        : "bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)]"
                    }`}>
                      {p.tipo}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-white">{p.descricao}</td>
                  <td className="px-3 py-2.5 text-sm text-[rgba(255,255,255,0.7)]">
                    <span className="inline-flex items-center gap-1"><Heart size={11} className="text-red-400" />{p.likes.toLocaleString("pt-BR")}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[rgba(255,255,255,0.7)]">
                    <span className="inline-flex items-center gap-1"><MessageCircle size={11} className="text-[rgba(255,255,255,0.4)]" />{p.comments.toLocaleString("pt-BR")}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[rgba(255,255,255,0.7)]">
                    <span className="inline-flex items-center gap-1"><Share2 size={11} className="text-green-400" />{p.shares.toLocaleString("pt-BR")}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-white font-medium">{p.engagement.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */

export function MarketingContent() {
  const [activeTab, setActiveTab] = useState<TabId>("campanhas");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Marketing</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Campanhas, performance, canais e audiencia — dados reais Casa Mr. Lion
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-1 w-fit">
        {TABS.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${
              id === activeTab
                ? "bg-[rgba(255,255,255,0.12)] text-white shadow-sm"
                : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.7)]"
            }`}
          >
            <TabIcon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "campanhas" && <TabCampanhas />}
      {activeTab === "performance" && <TabPerformance />}
      {activeTab === "canais" && <TabCanais />}
      {activeTab === "audiencia" && <TabAudiencia />}
    </div>
  );
}
