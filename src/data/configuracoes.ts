// src/data/configuracoes.ts

export interface ConfigItem {
  label: string;
  tipo: "toggle" | "select" | "input";
  valor: string | boolean;
  opcoes?: string[];
}

export interface ConfiguracaoSecao {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  items: ConfigItem[];
}

export const CONFIGURACOES_SECOES: ConfiguracaoSecao[] = [
  {
    id: "notificacoes",
    titulo: "Notificacoes",
    descricao: "Controle quais alertas e mensagens voce deseja receber dos agentes",
    icone: "Bell",
    items: [
      { label: "Alertas criticos por email", tipo: "toggle", valor: true },
      { label: "Resumo diario por WhatsApp", tipo: "toggle", valor: true },
      { label: "Notificacoes de tarefas concluidas", tipo: "toggle", valor: false },
      { label: "Alertas de estoque critico", tipo: "toggle", valor: true },
      { label: "Frequencia do resumo diario", tipo: "select", valor: "08:00", opcoes: ["06:00", "07:00", "08:00", "09:00", "10:00"] },
    ],
  },
  {
    id: "inteligencia",
    titulo: "Inteligencia dos Agentes",
    descricao: "Ajuste o comportamento autonomo e nivel de intervencao dos agentes",
    icone: "Brain",
    items: [
      { label: "Modo de aprovacao automatica", tipo: "select", valor: "semi-auto", opcoes: ["manual", "semi-auto", "automatico"] },
      { label: "Agentes podem executar acoes sem aprovacao abaixo de", tipo: "select", valor: "R$ 500", opcoes: ["R$ 100", "R$ 500", "R$ 1.000", "R$ 5.000"] },
      { label: "Aprendizado continuo habilitado", tipo: "toggle", valor: true },
      { label: "Compartilhar dados anonimos para melhoria do modelo", tipo: "toggle", valor: false },
      { label: "Nivel de detalhe nos relatorios", tipo: "select", valor: "detalhado", opcoes: ["resumido", "padrao", "detalhado"] },
    ],
  },
  {
    id: "seguranca",
    titulo: "Seguranca e Acesso",
    descricao: "Gerencie permissoes, autenticacao e auditoria de acesso",
    icone: "Shield",
    items: [
      { label: "Autenticacao de dois fatores (2FA)", tipo: "toggle", valor: true },
      { label: "Timeout de sessao inativa", tipo: "select", valor: "30 minutos", opcoes: ["15 minutos", "30 minutos", "1 hora", "4 horas"] },
      { label: "Log de auditoria de acoes dos agentes", tipo: "toggle", valor: true },
      { label: "Restringir acesso por IP", tipo: "toggle", valor: false },
      { label: "Email de recuperacao", tipo: "input", valor: "carlos@mrlion.com.br" },
    ],
  },
  {
    id: "integrações",
    titulo: "Integracoes",
    descricao: "Conecte plataformas externas para ampliar as capacidades dos agentes",
    icone: "Plug",
    items: [
      { label: "Meta Business Suite", tipo: "toggle", valor: true },
      { label: "WhatsApp Business API", tipo: "toggle", valor: true },
      { label: "Google Analytics 4", tipo: "toggle", valor: false },
      { label: "Shopee Seller Center", tipo: "toggle", valor: true },
      { label: "Mercado Livre API", tipo: "toggle", valor: false },
      { label: "Webhook para sistema ERP", tipo: "input", valor: "" },
    ],
  },
  {
    id: "plano",
    titulo: "Plano e Faturamento",
    descricao: "Informacoes sobre sua assinatura, uso e proxima fatura",
    icone: "CreditCard",
    items: [
      { label: "Plano atual", tipo: "select", valor: "Profissional", opcoes: ["Starter", "Profissional", "Enterprise"] },
      { label: "Ciclo de cobranca", tipo: "select", valor: "Mensal", opcoes: ["Mensal", "Anual"] },
      { label: "Renovacao automatica", tipo: "toggle", valor: true },
      { label: "Email para nota fiscal", tipo: "input", valor: "financeiro@mrlion.com.br" },
    ],
  },
];
