// src/data/relatorios.ts

export const RELATORIOS = [
  {
    id: "rel-001",
    tipo: "Semanal",
    titulo: "Relatorio Semanal — Semana 13/2026",
    periodo: "24/03 a 30/03/2026",
    agente: "Leo",
    criadoEm: "31/03/2026",
    resumo: "Receita semanal R$ 8.200 (-12% vs semana anterior). Ticket medio R$ 218. Estoque Honey Garrafa critico (< 50 un). 2 chargebacks resolvidos.",
    status: "pronto" as const,
  },
  {
    id: "rel-002",
    tipo: "Mensal",
    titulo: "Relatorio Mensal — Fevereiro 2026",
    periodo: "01/02 a 28/02/2026",
    agente: "Leo",
    criadoEm: "01/03/2026",
    resumo: "Receita R$ 54.412 (231 pedidos). PREJUIZO de R$ -2.329. CMV 45,3%. Marketing R$ 12.000 (Meta+Google). Chargebacks R$ 4.300 (7,9% — CRITICO).",
    status: "pronto" as const,
  },
  {
    id: "rel-003",
    tipo: "Mensal",
    titulo: "Relatorio Mensal — Janeiro 2026",
    periodo: "01/01 a 31/01/2026",
    agente: "Leo",
    criadoEm: "01/02/2026",
    resumo: "Receita R$ 67.067 (324 pedidos). Lucro R$ 1.130. CMV 53,4%. Marketing R$ 16.708. Margem bruta 46,6%.",
    status: "pronto" as const,
  },
  {
    id: "rel-004",
    tipo: "Semanal",
    titulo: "Relatorio Marketing — Semana 13/2026",
    periodo: "24/03 a 30/03/2026",
    agente: "Mia",
    criadoEm: "31/03/2026",
    resumo: "Meta Ads: R$ 1.200 investidos, CTR 1,64%, CPC R$ 0,32. Instagram: 3 posts publicados, alcance 12.400. Sessoes site: 4.800.",
    status: "pronto" as const,
  },
];
