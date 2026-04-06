// src/data/financeiro.ts — Real data from Casa Mr. Lion

// ─── Tab 1: Visao Geral ───────────────────────────────────────────────

export const FINANCEIRO_KPIS = [
  { label: "Receita Total", valor: "R$ 2.756.310", sub: "Abr/24 – Mar/26", icon: "DollarSign" },
  { label: "Receita 2025", valor: "R$ 1.839.359", sub: "+161% YoY", icon: "TrendingUp" },
  { label: "Receita 2026", valor: "R$ 212.248", sub: "Jan–Mar/26 (parcial)", icon: "ShoppingCart" },
  { label: "Margem Bruta", valor: "54,7%", sub: "Fev/26 (46,6% Jan/26)", icon: "TrendingUp" },
  { label: "COGS", valor: "64%", sub: "R$ 504K de R$ 787K", icon: "Package" },
];

export const CHARGEBACK_ALERT = {
  mes: "Fev/26",
  percentual: "7,9%",
  valor: "R$ 4.300",
  status: "CRITICO" as const,
};

export const DRE_TABLE = [
  {
    label: "Receita Bruta",
    jan: 95175,
    fev: 74081,
  },
  {
    label: "CMV",
    jan: 50794,
    fev: 33581,
  },
  {
    label: "Lucro Bruto",
    jan: 44381,
    fev: 40500,
  },
  {
    label: "Margem %",
    jan: "46,6%",
    fev: "54,7%",
  },
  {
    label: "Despesas Op.",
    jan: 43251,
    fev: 42830,
  },
  {
    label: "Resultado",
    jan: 1130,
    fev: -2330,
  },
];

export const GASTOS_POR_CATEGORIA = [
  { categoria: "COGS", valor: 504000 },
  { categoria: "Outros", valor: 108000 },
  { categoria: "Impostos", valor: 78000 },
  { categoria: "Marketing", valor: 51500 },
  { categoria: "Pessoal", valor: 22000 },
  { categoria: "Comissoes", valor: 8700 },
  { categoria: "Reembolsos", valor: 5700 },
  { categoria: "Frete", valor: 5500 },
  { categoria: "Software", valor: 3600 },
];

export const VENDAS_MENSAIS = [
  { mes: "Abr/25", receita: 59680, pedidos: 257 },
  { mes: "Mai/25", receita: 78440, pedidos: 315 },
  { mes: "Jun/25", receita: 149426, pedidos: 770 },
  { mes: "Jul/25", receita: 91620, pedidos: 386 },
  { mes: "Ago/25", receita: 93360, pedidos: 418 },
  { mes: "Set/25", receita: 57254, pedidos: 219 },
  { mes: "Out/25", receita: 56566, pedidos: 218 },
  { mes: "Nov/25", receita: 491372, pedidos: 2588 },
  { mes: "Dez/25", receita: 199412, pedidos: 963 },
  { mes: "Jan/26", receita: 95175, pedidos: 324 },
  { mes: "Fev/26", receita: 74081, pedidos: 231 },
  { mes: "Mar/26", receita: 33755, pedidos: 155 },
];

export const TOP_PRODUTOS = [
  { nome: "Mr. Lion Honey Garrafa", receita: "R$ 291.083", percentual: "20,3%", unidades: 6052 },
  { nome: "Mr. Lion Honey Completo", receita: "R$ 287.539", percentual: "20,1%", unidades: 3367 },
  { nome: "Mr. Lion Capuccino Garrafa", receita: "R$ 255.485", percentual: "17,8%", unidades: 2566 },
  { nome: "Mr. Lion Honey", receita: "R$ 143.439", percentual: "10,0%", unidades: 2117 },
  { nome: "Mr. Lion Honey Pingente", receita: "R$ 74.977", percentual: "5,2%", unidades: 834 },
  { nome: "Mr. Lion Capuccino Completo", receita: "R$ 60.739", percentual: "4,2%", unidades: 836 },
  { nome: "Mr. Lion Black Honey", receita: "R$ 57.505", percentual: "4,0%", unidades: 503 },
  { nome: "Blended Mr. Lion Completo", receita: "R$ 46.821", percentual: "3,3%", unidades: 630 },
];

// Margem por produto (estimativas baseadas na operacao)
export const MARGEM_POR_PRODUTO = [
  { nome: "Honey Garrafa", margem: 52 },
  { nome: "Honey Completo", margem: 48 },
  { nome: "Capuccino Garrafa", margem: 55 },
  { nome: "Honey Avulso", margem: 42 },
  { nome: "Honey Pingente", margem: 38 },
  { nome: "Capuccino Completo", margem: 50 },
  { nome: "Black Honey", margem: 45 },
  { nome: "Blended Completo", margem: 44 },
];

// ─── Tab 2: ROI / Impacto ─────────────────────────────────────────────

export const META_ADS_DATA = {
  totalSpend: 42550,
  periodo: "Set/25 – Mar/26",
  roasPixel: "1,1x",
  roasTriangulado: "4,27x",
  purchaseValue: 45173,
  purchaseNote: "Apenas Set/25 trackeado",
  pixelNote: "Pixel Meta quebrado desde 15/Mar/2026. ROAS real estimado: ~4,27x (Fev/26)",
};

export const CAMPANHAS_META_ROI = [
  { nome: "Remarketing", orcDia: 150, roas: 0.6, status: "pausada" as const },
  { nome: "Vendas", orcDia: 100, roas: 6.6, status: "ativa" as const },
  { nome: "Promocoes", orcDia: 100, roas: 0.5, status: "ativa" as const },
];

// ─── Tab 3: Relatorios ────────────────────────────────────────────────

export const METRICAS_ECOMMERCE = {
  conversionRate: "2,38%",
  revenuePerSession: "R$ 5,00",
  revenuePerVisitor: "R$ 5,43",
  repeatRate: "11,1%",
  ltvMedio: "R$ 243,33",
  ltvRepeat: "R$ 541,93",
  pixTotal: "R$ 1.362K",
  pixPercent: "63,6%",
  cartaoTotal: "R$ 780K",
  cartaoPercent: "36,4%",
};
