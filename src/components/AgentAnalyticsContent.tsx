"use client";
import { Calendar, Download, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, BarChart2, CheckSquare, TrendingUp, TrendingDown } from "lucide-react";

// 30-day mock data: [concluidas, falhadas]
const DAILY_DATA = [
  [1,0],[2,0],[1,1],[3,0],[2,0],[4,1],[2,0],[1,0],[3,0],[2,1],
  [3,0],[2,0],[1,0],[4,0],[2,1],[3,0],[1,0],[2,0],[3,0],[2,0],
  [4,0],[2,0],[1,1],[3,0],[2,0],[2,0],[3,1],[1,0],[2,0],[3,0],
];

const MAX_VAL = Math.max(...DAILY_DATA.map(([c, f]) => c + f));

// SVG arc helpers for semicircle gauge (radius 60, center 70,70)
function arcPath(pct: number) {
  // full arc is from (10,70) to (130,70) going up through (70,10)
  // angle 0 = left end = 180°, angle 180 = right end = 0°
  // pct 0→1 fills left-to-right across the top
  const angle = Math.PI - pct * Math.PI; // pct=0 → π (left), pct=1 → 0 (right)
  const x = 70 + 60 * Math.cos(angle);
  const y = 70 - 60 * Math.sin(angle);
  const largeArc = pct > 0.5 ? 1 : 0;
  return `M 10 70 A 60 60 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
}

export function AgentAnalyticsContent() {
  const stats = [
    {
      label: "Tarefas concluídas",
      value: "47",
      sub: "+12% em relação ao período anterior",
      icon: CheckCircle2,
      up: true,
    },
    {
      label: "Tarefas com falha",
      value: "2",
      sub: "-50% em relação ao período anterior",
      icon: XCircle,
      up: false,
      positive: true, // decrease in failures is good
    },
    {
      label: "Taxa de aprovação de tarefas",
      value: "96%",
      sub: "+4% em relação ao período anterior",
      icon: CheckSquare,
      up: true,
    },
    {
      label: "Duração média de execução",
      value: "12m",
      sub: "-8% em relação ao período anterior",
      icon: BarChart2,
      up: false,
      positive: true,
    },
    {
      label: "Duração total de execução",
      value: "9h 24m",
      sub: "+18% em relação ao período anterior",
      icon: BarChart2,
      up: true,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Análises</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">Métricas e tendências de desempenho do agente</p>
      </div>

      {/* Date range + quick filters */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-sm text-white hover:bg-[rgba(255,255,255,0.06)]">
          <Calendar size={14} className="text-[rgba(255,255,255,0.4)]" />
          March 2nd, 2026 - April 1st, 2026
        </button>
        <div className="ml-auto flex items-center gap-1">
          {["Últimos 3 meses", "Últimos 30 dias", "Últimos 7 dias"].map((label, i) => (
            <button
              key={label}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${i === 1 ? "bg-[rgba(255,255,255,0.08)] text-white" : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"}`}
            >
              {label}
            </button>
          ))}
          <button className="ml-1 rounded-lg border border-[rgba(255,255,255,0.08)] p-1.5 text-[rgba(255,255,255,0.4)] hover:text-white">
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, up, positive }) => {
          const isPositive = positive !== undefined ? positive : up;
          return (
            <div
              key={label}
              className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={13} className="text-[rgba(255,255,255,0.4)]" />
                <span className="text-xs text-[rgba(255,255,255,0.4)]">{label}</span>
              </div>
              <p className="text-2xl font-semibold text-white mb-1">{value}</p>
              <div className="flex items-center gap-1">
                {up ? (
                  <TrendingUp size={11} className={isPositive ? "text-emerald-400" : "text-red-400"} />
                ) : (
                  <TrendingDown size={11} className={isPositive ? "text-emerald-400" : "text-red-400"} />
                )}
                <p className={`text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts 2x2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Completion rate gauge */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Taxa de conclusão</span>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <svg width="140" height="80" viewBox="0 0 140 80">
                {/* Background track */}
                <path d="M 10 70 A 60 60 0 0 1 130 70" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" strokeLinecap="round" />
                {/* 96% fill in green */}
                <path
                  d={arcPath(0.96)}
                  stroke="#34d399"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <span className="text-2xl font-bold text-white">96%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback score */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Pontuação de avaliação</span>
          </div>
          <div className="flex flex-col items-center py-4 gap-2">
            <p className="text-3xl font-bold text-white">91%</p>
            <p className="text-sm text-[rgba(255,255,255,0.4)]">Avaliação positiva</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-emerald-400">
                <ThumbsUp size={14} /> <span>43</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-red-400">
                <ThumbsDown size={14} /> <span>4</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full mt-2 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: "91%" }} />
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-[rgba(255,255,255,0.4)]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />Avaliação positiva
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />Avaliação negativa
              </div>
            </div>
          </div>
        </div>

        {/* Avg evaluation score gauge */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[rgba(255,255,255,0.4)]" />
            <span className="text-sm font-medium text-white">Pontuação média de avaliação</span>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <svg width="140" height="80" viewBox="0 0 140 80">
                <path d="M 10 70 A 60 60 0 0 1 130 70" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path
                  d={arcPath(0.88)}
                  stroke="#818cf8"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <span className="text-2xl font-bold text-white">88%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks bar chart */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-[rgba(255,255,255,0.4)]" />
              <span className="text-sm font-medium text-white">Tarefas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.4)]">
                <span className="h-2 w-2 rounded-sm bg-emerald-400 inline-block" />Concluídas
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.4)]">
                <span className="h-2 w-2 rounded-sm bg-red-400 inline-block" />Falhadas
              </div>
            </div>
          </div>
          {/* SVG bar chart */}
          <svg width="100%" viewBox="0 0 300 80" preserveAspectRatio="none" className="overflow-visible">
            {DAILY_DATA.map(([c, f], i) => {
              const barW = 6;
              const gap = (300 - DAILY_DATA.length * barW) / (DAILY_DATA.length - 1);
              const x = i * (barW + gap);
              const maxH = 64;
              const cH = (c / MAX_VAL) * maxH;
              const fH = (f / MAX_VAL) * maxH;
              return (
                <g key={i}>
                  {f > 0 && (
                    <rect
                      x={x}
                      y={80 - fH}
                      width={barW}
                      height={fH}
                      rx={1}
                      fill="rgba(248,113,113,0.7)"
                    />
                  )}
                  <rect
                    x={x}
                    y={80 - cH - fH}
                    width={barW}
                    height={cH}
                    rx={1}
                    fill="rgba(52,211,153,0.8)"
                  />
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between mt-1 text-[10px] text-[rgba(255,255,255,0.25)]">
            <span>Mar 2</span>
            <span>Mar 16</span>
            <span>Apr 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
