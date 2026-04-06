// src/data/roi.ts

export const ROI_DADOS = {
  investimentoSetup: 12000,
  mensalidade: 7500,
  mesesContratado: 6,
  investimentoTotal: 57000,
  valorGerado: 142000,
  roiPercentual: "149%",
  breakEvenMes: 3,
};

export const ROI_TIMELINE = [
  { mes: "Out/25", investimento: 19500, valor: 8000, label: "Setup + 1o mes" },
  { mes: "Nov/25", investimento: 27000, valor: 32000, label: "Black Friday otimizada" },
  { mes: "Dez/25", investimento: 34500, valor: 58000, label: "Natal + automacoes" },
  { mes: "Jan/26", investimento: 42000, valor: 82000, label: "Break-even atingido" },
  { mes: "Fev/26", investimento: 49500, valor: 112000, label: "ROI 126%" },
  { mes: "Mar/26", investimento: 57000, valor: 142000, label: "ROI 149%" },
];

export const ROI_CATEGORIAS = [
  { categoria: "Otimizacao de campanhas", valor: "R$ 45.000", verificado: true },
  { categoria: "Reducao de chargebacks", valor: "R$ 18.000", verificado: true },
  { categoria: "Automacao operacional", valor: "R$ 32.000", verificado: false },
  { categoria: "Recompra B2B automatizada", valor: "R$ 27.000", verificado: false },
  { categoria: "Economia tempo gestao", valor: "R$ 20.000", verificado: false },
];
