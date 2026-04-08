// src/data/marketing.ts — Real Casa Mr. Lion marketing data

// ─── Tab 1: Campanhas ───────────────────────────────────────────

export const CAMPANHAS_KPIS = [
  { label: "Spend Total", valor: "R$ 42.550", icon: "Banknote" },
  { label: "ROAS Geral", valor: "1,1x", icon: "TrendingUp" },
  { label: "CPM Medio", valor: "R$ 5,02", icon: "Eye" },
  { label: "Purchases", valor: "143", icon: "Target" },
];

export interface CampanhaRow {
  nome: string;
  spend: string;
  clicks: string;
  ctr: string;
  purchases: number;
  roas: string;
}

export const CAMPANHAS_TABLE: CampanhaRow[] = [
  { nome: "Remarketing R$150/dia", spend: "R$ 24.259", clicks: "121.736", ctr: "2,18%", purchases: 46, roas: "0,6x" },
  { nome: "Promocoes R$100/dia", spend: "R$ 9.491", clicks: "55.663", ctr: "3,59%", purchases: 12, roas: "0,5x" },
  { nome: "Vendas R$100/dia", spend: "R$ 3.920", clicks: "26.371", ctr: "4,06%", purchases: 85, roas: "6,6x" },
  { nome: "Mornos Redir. R$20/dia", spend: "R$ 1.958", clicks: "56.385", ctr: "9,86%", purchases: 0, roas: "0,0x" },
  { nome: "Lead WhatsApp Revendedor", spend: "R$ 1.837", clicks: "7.110", ctr: "2,32%", purchases: 0, roas: "0,0x" },
  { nome: "Seguidores R$20/dia", spend: "R$ 626", clicks: "8.210", ctr: "8,46%", purchases: 0, roas: "0,0x" },
];

// ─── Tab 2: Performance ─────────────────────────────────────────

export interface SpendRevenueRow {
  mes: string;
  spend: number;
  revenue: number;
}

export const SPEND_VS_REVENUE: SpendRevenueRow[] = [
  { mes: "Set/25", spend: 4396, revenue: 45173 },
  { mes: "Out/25", spend: 10800, revenue: 0 },
  { mes: "Nov/25", spend: 8709, revenue: 0 },
  { mes: "Dez/25", spend: 5052, revenue: 0 },
  { mes: "Jan/26", spend: 8216, revenue: 0 },
  { mes: "Fev/26", spend: 5378, revenue: 0 },
];

export interface CtrRow {
  nome: string;
  ctr: number;
}

export const CTR_POR_CAMPANHA: CtrRow[] = [
  { nome: "Mornos Redir.", ctr: 9.86 },
  { nome: "Seguidores", ctr: 8.46 },
  { nome: "Vendas", ctr: 4.06 },
  { nome: "Promocoes", ctr: 3.59 },
  { nome: "Lead WhatsApp", ctr: 2.32 },
  { nome: "Remarketing", ctr: 2.18 },
];

// ─── Tab 3: Canais ──────────────────────────────────────────────

export interface CanalRow {
  canal: string;
  revenue: number;
  color: string;
}

export const REVENUE_POR_CANAL: CanalRow[] = [
  { canal: "Desconhecido", revenue: 680926, color: "#a1a1aa" },
  { canal: "Instagram", revenue: 442228, color: "#01C461" },
  { canal: "Direto", revenue: 289145, color: "#f59e0b" },
  { canal: "Google Ads", revenue: 244338, color: "#10b981" },
  { canal: "Facebook", revenue: 221364, color: "#71717a" },
  { canal: "Google Organic", revenue: 199928, color: "#52525b" },
  { canal: "Meta Ads", revenue: 22560, color: "#ef4444" },
  { canal: "Referral", revenue: 17183, color: "#3f3f46" },
];

export interface PagamentoRow {
  tipo: string;
  valor: number;
  pct: string;
  color: string;
}

export const MIX_PAGAMENTO: PagamentoRow[] = [
  { tipo: "Pix", valor: 1362043, pct: "63,6%", color: "#10b981" },
  { tipo: "Cartao", valor: 780559, pct: "36,4%", color: "#71717a" },
];

export interface CupomRow {
  cupom: string;
  usos: number;
  revenue: string;
}

export const TOP_CUPONS: CupomRow[] = [
  { cupom: "MP Pix Auto", usos: 1937, revenue: "R$ 430.000" },
  { cupom: "falamafia", usos: 222, revenue: "R$ 54.000" },
  { cupom: "mrlion10", usos: 189, revenue: "R$ 41.000" },
  { cupom: "podcast15", usos: 134, revenue: "R$ 29.000" },
  { cupom: "revendedor20", usos: 97, revenue: "R$ 22.000" },
];

// ─── Tab 4: Audiencia ───────────────────────────────────────────

export const AUDIENCIA_STATS = {
  followers: 86423,
  brasilPct: "99,4%",
  genero: [
    { label: "Masculino", pct: "79,5%", value: 79.5 },
    { label: "Feminino", pct: "11,6%", value: 11.6 },
    { label: "Desconhecido", pct: "8,9%", value: 8.9 },
  ],
};

export interface IdadeRow {
  faixa: string;
  valor: number;
  genero: "M" | "F";
}

export const DISTRIBUICAO_IDADE: IdadeRow[] = [
  { faixa: "18-24", valor: 17803, genero: "M" },
  { faixa: "25-34", valor: 38067, genero: "M" },
  { faixa: "35-44", valor: 9834, genero: "M" },
  { faixa: "45-54", valor: 1476, genero: "M" },
  { faixa: "18-24", valor: 2519, genero: "F" },
  { faixa: "25-34", valor: 4956, genero: "F" },
  { faixa: "35-44", valor: 1636, genero: "F" },
  { faixa: "45-54", valor: 446, genero: "F" },
];

// Reshape for grouped bar chart
export const IDADE_CHART_DATA = [
  { faixa: "18-24", masculino: 17803, feminino: 2519 },
  { faixa: "25-34", masculino: 38067, feminino: 4956 },
  { faixa: "35-44", masculino: 9834, feminino: 1636 },
  { faixa: "45-54", masculino: 1476, feminino: 446 },
];

export const ENGAGEMENT_STATS = {
  reelsAvg: 5351,
  imageAvg: 813,
  totalPosts: 55,
  periodo: "Jan/25 - Mar/26",
};

export interface TopPostRow {
  tipo: string;
  descricao: string;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
}

export const TOP_POSTS: TopPostRow[] = [
  { tipo: "Reel", descricao: "Unboxing whisky colecionador", likes: 12430, comments: 891, shares: 2100, engagement: 15421 },
  { tipo: "Reel", descricao: "Tour pelo deposito", likes: 9870, comments: 645, shares: 1340, engagement: 11855 },
  { tipo: "Reel", descricao: "Degustacao gin artesanal", likes: 8200, comments: 520, shares: 980, engagement: 9700 },
  { tipo: "Reel", descricao: "Promo fim de semana", likes: 7650, comments: 412, shares: 870, engagement: 8932 },
  { tipo: "Reel", descricao: "Bastidores empacotamento", likes: 6340, comments: 389, shares: 720, engagement: 7449 },
  { tipo: "Imagem", descricao: "Lancamento vodka premium", likes: 2100, comments: 156, shares: 89, engagement: 2345 },
  { tipo: "Reel", descricao: "Top 5 cervejas artesanais", likes: 5890, comments: 310, shares: 650, engagement: 6850 },
  { tipo: "Imagem", descricao: "Kit presente dia dos pais", likes: 1850, comments: 134, shares: 76, engagement: 2060 },
  { tipo: "Reel", descricao: "Receita drink tropical", likes: 4500, comments: 278, shares: 540, engagement: 5318 },
  { tipo: "Reel", descricao: "Haul cerveja importada", likes: 4200, comments: 245, shares: 490, engagement: 4935 },
];

// ─── Legacy exports (backward compat with old MarketingContent) ─

export const MARKETING_KPIS = CAMPANHAS_KPIS.map((k) => ({
  ...k,
  sub: "Set/25 - Mar/26",
}));

export const CAMPANHAS_META = [
  { mes: "Set/25", spend: "R$ 4.395", impressoes: "645.838", clicks: "29.621", ctr: "4,59%", cpc: "R$ 0,15", roas: "2,6x" },
  { mes: "Nov/25", spend: "R$ 10.799", impressoes: "2.072.041", clicks: "90.072", ctr: "4,35%", cpc: "R$ 0,12", roas: "1,8x" },
  { mes: "Dez/25", spend: "R$ 8.708", impressoes: "1.827.700", clicks: "62.207", ctr: "3,40%", cpc: "R$ 0,14", roas: "1,2x" },
  { mes: "Jan/26", spend: "R$ 5.051", impressoes: "1.437.399", clicks: "46.155", ctr: "3,21%", cpc: "R$ 0,11", roas: "0,6x" },
  { mes: "Fev/26", spend: "R$ 8.216", impressoes: "1.814.193", clicks: "33.044", ctr: "1,82%", cpc: "R$ 0,25", roas: "0,2x" },
  { mes: "Mar/26", spend: "R$ 5.377", impressoes: "1.010.466", clicks: "16.610", ctr: "1,64%", cpc: "R$ 0,32", roas: "0,3x" },
];

export const TRAFEGO_MENSAL = [
  { mes: "Ago/25", sessoes: 17925, views: 26718 },
  { mes: "Set/25", sessoes: 33352, views: 52593 },
  { mes: "Out/25", sessoes: 69887, views: 103461 },
  { mes: "Nov/25", sessoes: 126674, views: 199356 },
  { mes: "Dez/25", sessoes: 83080, views: 130587 },
  { mes: "Jan/26", sessoes: 51249, views: 69002 },
  { mes: "Fev/26", sessoes: 27459, views: 42508 },
  { mes: "Mar/26", sessoes: 18661, views: 28249 },
];
