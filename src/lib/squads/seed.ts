// src/lib/squads/seed.ts

import type { SupabaseParam } from "./types";

// ---------------------------------------------------------------------------
// Department Templates
// ---------------------------------------------------------------------------

interface DepartmentTemplate {
  slug: string;
  name: string;
  emoji: string;
  color: string;
}

const DEPARTMENT_TEMPLATES: DepartmentTemplate[] = [
  { slug: "financeiro", name: "Financeiro", emoji: "\u{1F4B0}", color: "#22c55e" },
  { slug: "marketing", name: "Marketing", emoji: "\u{1F4E2}", color: "#6366f1" },
  { slug: "vendas", name: "Vendas", emoji: "\u{1F6D2}", color: "#ec4899" },
  { slug: "operacoes", name: "Operacoes", emoji: "\u2699\uFE0F", color: "#f59e0b" },
  { slug: "atendimento", name: "Atendimento", emoji: "\u{1F4AC}", color: "#06b6d4" },
];

// ---------------------------------------------------------------------------
// Squad Templates (2-3 per department)
// ---------------------------------------------------------------------------

interface SquadTemplate {
  slug: string;
  name: string;
  description: string;
  department_slug: string;
}

const SQUAD_TEMPLATES: SquadTemplate[] = [
  // Financeiro
  {
    slug: "fin-dre-fluxo",
    name: "DRE & Fluxo de Caixa",
    description: "Monitora demonstrativo de resultados e fluxo de caixa",
    department_slug: "financeiro",
  },
  {
    slug: "fin-chargebacks",
    name: "Chargebacks & Fraudes",
    description: "Deteccao e resolucao de chargebacks e fraudes",
    department_slug: "financeiro",
  },
  // Marketing
  {
    slug: "mkt-meta-ads",
    name: "Meta Ads & Performance",
    description: "Gestao de campanhas Meta Ads, ROAS e otimizacao",
    department_slug: "marketing",
  },
  {
    slug: "mkt-conteudo",
    name: "Conteudo & Social",
    description: "Criacao de conteudo Instagram, stories e engagement",
    department_slug: "marketing",
  },
  {
    slug: "mkt-analytics",
    name: "Analytics & Trafego",
    description: "Monitoramento de trafego, sessoes e conversoes",
    department_slug: "marketing",
  },
  // Vendas
  {
    slug: "vnd-b2b",
    name: "Vendas B2B",
    description: "Pipeline B2B, recompra automatizada e follow-up",
    department_slug: "vendas",
  },
  {
    slug: "vnd-ecommerce",
    name: "E-commerce & B2C",
    description: "Vendas diretas, ticket medio e conversao",
    department_slug: "vendas",
  },
  // Operacoes
  {
    slug: "ops-estoque",
    name: "Estoque & Logistica",
    description: "Controle de estoque, alertas de reposicao e entregas",
    department_slug: "operacoes",
  },
  {
    slug: "ops-entregas",
    name: "Entregas & Reenvios",
    description: "Rastreio de entregas, reenvios e ocorrencias",
    department_slug: "operacoes",
  },
  // Atendimento
  {
    slug: "atd-whatsapp",
    name: "WhatsApp Automatico",
    description: "Respostas automaticas, pos-venda via WhatsApp",
    department_slug: "atendimento",
  },
  {
    slug: "atd-trocas",
    name: "Trocas & Devolucoes",
    description: "Gestao de trocas, devolucoes e reembolsos",
    department_slug: "atendimento",
  },
];

// ---------------------------------------------------------------------------
// Agent Templates (matching mrlion.ts)
// ---------------------------------------------------------------------------

interface AgentTemplate {
  slug: string;
  name: string;
  initials: string;
  department_slug: string;
  squad_slug: string;
  status: "ativo" | "pausado" | "idle";
  description: string;
  skills: string[];
  config: Record<string, unknown>;
  last_action: string;
  tasks_completed: number;
  tasks_failed: number;
  approval_rate: number;
}

const AGENT_TEMPLATES: AgentTemplate[] = [
  // ---- Financeiro ----
  {
    slug: "leo",
    name: "Leo",
    initials: "LE",
    department_slug: "financeiro",
    squad_slug: "fin-dre-fluxo",
    status: "ativo",
    description: "Monitora DRE, alertas de margem, fluxo de caixa e chargebacks",
    skills: ["analise-dre", "fluxo-caixa", "deteccao-chargebacks", "margem-lucro"],
    config: { report_frequency: "weekly", alert_threshold: 0.05 },
    last_action: "Detectou margem negativa no Honey Pingente",
    tasks_completed: 47,
    tasks_failed: 2,
    approval_rate: 96,
  },
  {
    slug: "fin-analyst-01",
    name: "Caio",
    initials: "CA",
    department_slug: "financeiro",
    squad_slug: "fin-dre-fluxo",
    status: "ativo",
    description: "Analisa custos operacionais e CMV por produto",
    skills: ["analise-custos", "cmv-produto", "margem-lucro"],
    config: { report_frequency: "daily" },
    last_action: "Calculou CMV Mar/2026: ~R$ 16.800",
    tasks_completed: 31,
    tasks_failed: 1,
    approval_rate: 97,
  },
  {
    slug: "fin-chargeback-01",
    name: "Nina",
    initials: "NI",
    department_slug: "financeiro",
    squad_slug: "fin-chargebacks",
    status: "ativo",
    description: "Detecta e resolve chargebacks automaticamente",
    skills: ["deteccao-chargebacks", "disputa-automatica", "relatorio-fraudes"],
    config: { auto_dispute: true, threshold_amount: 500 },
    last_action: "Resolveu 2 chargebacks (R$ 1.340)",
    tasks_completed: 28,
    tasks_failed: 4,
    approval_rate: 88,
  },
  {
    slug: "fin-chargeback-02",
    name: "Davi",
    initials: "DA",
    department_slug: "financeiro",
    squad_slug: "fin-chargebacks",
    status: "idle",
    description: "Monitora padroes de fraude e prevencao",
    skills: ["pattern-detection", "fraude-prevencao", "risk-scoring"],
    config: { scan_interval: "hourly" },
    last_action: "Identificou padrao suspeito em 3 transacoes",
    tasks_completed: 19,
    tasks_failed: 1,
    approval_rate: 95,
  },

  // ---- Marketing ----
  {
    slug: "mia",
    name: "Mia",
    initials: "MI",
    department_slug: "marketing",
    squad_slug: "mkt-meta-ads",
    status: "ativo",
    description: "Gerencia campanhas Meta Ads, conteudo Instagram, ROAS",
    skills: ["meta-ads", "conteudo-social", "analytics", "roas-otimizacao"],
    config: { auto_optimize: true, budget_limit: 500 },
    last_action: "Otimizou campanha 'Verao 2026' — CPC reduzido 18%",
    tasks_completed: 83,
    tasks_failed: 5,
    approval_rate: 94,
  },
  {
    slug: "mkt-content-01",
    name: "Lara",
    initials: "LA",
    department_slug: "marketing",
    squad_slug: "mkt-conteudo",
    status: "ativo",
    description: "Cria conteudo para Instagram e redes sociais",
    skills: ["copywriting", "design-social", "calendario-editorial"],
    config: { posts_per_week: 5 },
    last_action: "Publicou 3 posts Instagram (alcance 12.400)",
    tasks_completed: 64,
    tasks_failed: 3,
    approval_rate: 95,
  },
  {
    slug: "mkt-analytics-01",
    name: "Theo",
    initials: "TH",
    department_slug: "marketing",
    squad_slug: "mkt-analytics",
    status: "ativo",
    description: "Monitora trafego, sessoes e funil de conversao",
    skills: ["google-analytics", "funil-conversao", "sessoes-tracking"],
    config: { report_frequency: "daily" },
    last_action: "Sessoes Mar/26: 18.661 (queda de 32%)",
    tasks_completed: 41,
    tasks_failed: 2,
    approval_rate: 95,
  },
  {
    slug: "mkt-meta-02",
    name: "Bia",
    initials: "BI",
    department_slug: "marketing",
    squad_slug: "mkt-meta-ads",
    status: "idle",
    description: "Testa criativos A/B e otimiza audiencias",
    skills: ["ab-testing", "audiencia-lookalike", "creative-testing"],
    config: { test_budget: 200 },
    last_action: "Teste A/B: criativo video +23% CTR vs imagem",
    tasks_completed: 36,
    tasks_failed: 4,
    approval_rate: 90,
  },
  {
    slug: "mkt-seo-01",
    name: "Hugo",
    initials: "HU",
    department_slug: "marketing",
    squad_slug: "mkt-analytics",
    status: "idle",
    description: "Otimizacao SEO e keywords organicas",
    skills: ["seo-audit", "keyword-research", "link-building"],
    config: { audit_frequency: "weekly" },
    last_action: "Auditoria SEO: 12 paginas com meta faltando",
    tasks_completed: 22,
    tasks_failed: 1,
    approval_rate: 96,
  },

  // ---- Vendas ----
  {
    slug: "rex",
    name: "Rex",
    initials: "RE",
    department_slug: "vendas",
    squad_slug: "vnd-b2b",
    status: "ativo",
    description: "Acompanha vendas B2B, reorder alerts, ticket medio",
    skills: ["crm-pipeline", "recompra-b2b", "ticket-medio", "follow-up"],
    config: { reorder_days: 30, min_ticket: 500 },
    last_action: "Enviou lembrete de recompra para 12 clientes B2B",
    tasks_completed: 61,
    tasks_failed: 3,
    approval_rate: 95,
  },
  {
    slug: "vnd-inside-01",
    name: "Toni",
    initials: "TO",
    department_slug: "vendas",
    squad_slug: "vnd-b2b",
    status: "ativo",
    description: "Inside sales e prospecao de novos clientes B2B",
    skills: ["prospecao", "qualificacao-lead", "proposta-comercial"],
    config: { outreach_daily: 20 },
    last_action: "Qualificou 5 leads novos para B2B",
    tasks_completed: 44,
    tasks_failed: 6,
    approval_rate: 88,
  },
  {
    slug: "vnd-ecom-01",
    name: "Luna",
    initials: "LU",
    department_slug: "vendas",
    squad_slug: "vnd-ecommerce",
    status: "ativo",
    description: "Monitora vendas e-commerce, conversao e abandono de carrinho",
    skills: ["abandono-carrinho", "upsell", "conversao-checkout"],
    config: { recovery_delay_min: 30 },
    last_action: "Recuperou 8 carrinhos abandonados (R$ 1.740)",
    tasks_completed: 52,
    tasks_failed: 7,
    approval_rate: 88,
  },
  {
    slug: "vnd-ecom-02",
    name: "Ravi",
    initials: "RA",
    department_slug: "vendas",
    squad_slug: "vnd-ecommerce",
    status: "idle",
    description: "Analisa ticket medio e sugere bundles",
    skills: ["ticket-medio", "bundle-sugestao", "pricing"],
    config: { bundle_min_margin: 0.3 },
    last_action: "Sugeriu bundle Honey + Capuccino (margem 52%)",
    tasks_completed: 27,
    tasks_failed: 2,
    approval_rate: 93,
  },
  {
    slug: "vnd-b2b-02",
    name: "Gael",
    initials: "GA",
    department_slug: "vendas",
    squad_slug: "vnd-b2b",
    status: "idle",
    description: "Gerencia contratos B2B e renovacoes",
    skills: ["contratos", "renovacao", "negociacao"],
    config: { renewal_alert_days: 15 },
    last_action: "Renovacao contrato distribuidora ABC aprovada",
    tasks_completed: 18,
    tasks_failed: 1,
    approval_rate: 95,
  },

  // ---- Operacoes ----
  {
    slug: "sol",
    name: "Sol",
    initials: "SO",
    department_slug: "operacoes",
    squad_slug: "ops-estoque",
    status: "ativo",
    description: "Logistica, controle de estoque, entregas, reenvios",
    skills: ["gestao-estoque", "rastreio-entregas", "reenvios", "fornecedores"],
    config: { stock_alert_threshold: 50, reorder_auto: false },
    last_action: "Alerta: estoque Honey Garrafa abaixo de 50 un.",
    tasks_completed: 52,
    tasks_failed: 1,
    approval_rate: 98,
  },
  {
    slug: "ops-estoque-02",
    name: "Enzo",
    initials: "EN",
    department_slug: "operacoes",
    squad_slug: "ops-estoque",
    status: "ativo",
    description: "Monitora niveis de estoque e emite pedidos de reposicao",
    skills: ["reposicao-auto", "previsao-demanda", "fornecedores"],
    config: { forecast_days: 14 },
    last_action: "Previu demanda Honey Garrafa: 120 un. proximos 14 dias",
    tasks_completed: 33,
    tasks_failed: 2,
    approval_rate: 94,
  },
  {
    slug: "ops-entrega-01",
    name: "Zara",
    initials: "ZA",
    department_slug: "operacoes",
    squad_slug: "ops-entregas",
    status: "ativo",
    description: "Rastreia entregas e gerencia ocorrencias",
    skills: ["rastreio-correios", "ocorrencias", "reenvio-automatico"],
    config: { sla_days: 7 },
    last_action: "Resolveu 4 ocorrencias de entrega atrasada",
    tasks_completed: 45,
    tasks_failed: 3,
    approval_rate: 94,
  },
  {
    slug: "ops-entrega-02",
    name: "Kael",
    initials: "KA",
    department_slug: "operacoes",
    squad_slug: "ops-entregas",
    status: "idle",
    description: "Otimiza rotas e custos de frete",
    skills: ["otimizacao-frete", "rotas", "negociacao-transportadora"],
    config: { optimize_threshold: 1000 },
    last_action: "Negociou reducao de 8% no frete com transportadora",
    tasks_completed: 21,
    tasks_failed: 1,
    approval_rate: 95,
  },
  {
    slug: "ops-fornecedor-01",
    name: "Yuri",
    initials: "YU",
    department_slug: "operacoes",
    squad_slug: "ops-estoque",
    status: "idle",
    description: "Gestao de fornecedores e pedidos de compra",
    skills: ["gestao-fornecedores", "pedido-compra", "cotacao"],
    config: { min_suppliers: 2 },
    last_action: "Cotacao recebida: insumo Honey -12% vs ultimo pedido",
    tasks_completed: 15,
    tasks_failed: 0,
    approval_rate: 100,
  },

  // ---- Atendimento ----
  {
    slug: "iris",
    name: "Iris",
    initials: "IR",
    department_slug: "atendimento",
    squad_slug: "atd-whatsapp",
    status: "pausado",
    description: "WhatsApp automatico, pos-venda, trocas e devolucoes",
    skills: ["whatsapp-auto", "pos-venda", "trocas-devolucoes", "nps"],
    config: { auto_reply: true, response_time_sla: 60 },
    last_action: "Respondeu 23 mensagens WhatsApp automaticamente",
    tasks_completed: 156,
    tasks_failed: 8,
    approval_rate: 95,
  },
  {
    slug: "atd-whatsapp-02",
    name: "Liz",
    initials: "LZ",
    department_slug: "atendimento",
    squad_slug: "atd-whatsapp",
    status: "ativo",
    description: "Triagem de mensagens e escalacao para humanos",
    skills: ["triagem", "escalacao", "sentimento-analise"],
    config: { escalation_keywords: ["urgente", "reclamacao", "juridico"] },
    last_action: "Triou 45 mensagens, escalou 3 para humano",
    tasks_completed: 89,
    tasks_failed: 5,
    approval_rate: 94,
  },
  {
    slug: "atd-trocas-01",
    name: "Max",
    initials: "MX",
    department_slug: "atendimento",
    squad_slug: "atd-trocas",
    status: "ativo",
    description: "Processa trocas e devolucoes automaticamente",
    skills: ["trocas-automaticas", "reembolso", "logistica-reversa"],
    config: { auto_approve_under: 200 },
    last_action: "Processou 6 devolucoes (R$ 890 em reembolsos)",
    tasks_completed: 67,
    tasks_failed: 4,
    approval_rate: 94,
  },
  {
    slug: "atd-nps-01",
    name: "Mel",
    initials: "ME",
    department_slug: "atendimento",
    squad_slug: "atd-trocas",
    status: "idle",
    description: "Coleta e analisa NPS pos-compra",
    skills: ["nps-coleta", "sentimento-analise", "feedback-loop"],
    config: { survey_delay_days: 7 },
    last_action: "NPS Mar/26: 72 (detratores: entregas atrasadas)",
    tasks_completed: 34,
    tasks_failed: 2,
    approval_rate: 94,
  },
  {
    slug: "atd-whatsapp-03",
    name: "Cleo",
    initials: "CL",
    department_slug: "atendimento",
    squad_slug: "atd-whatsapp",
    status: "idle",
    description: "Respostas pos-venda e acompanhamento de entrega",
    skills: ["pos-venda", "tracking-update", "satisfacao"],
    config: { follow_up_days: [3, 7, 14] },
    last_action: "Enviou follow-up pos-venda para 18 clientes",
    tasks_completed: 42,
    tasks_failed: 3,
    approval_rate: 93,
  },
  {
    slug: "atd-sac-01",
    name: "Nilo",
    initials: "NL",
    department_slug: "atendimento",
    squad_slug: "atd-trocas",
    status: "idle",
    description: "SAC geral e resolucao de problemas complexos",
    skills: ["resolucao-problemas", "compensacao", "retencao-cliente"],
    config: { escalation_timeout_min: 120 },
    last_action: "Resolveu caso complexo: cliente VIP com 3 ocorrencias",
    tasks_completed: 38,
    tasks_failed: 6,
    approval_rate: 86,
  },
];

// ---------------------------------------------------------------------------
// Seed Function
// ---------------------------------------------------------------------------

/**
 * Seeds the database with department, squad, and agent templates.
 * Idempotent: checks for existing records by slug before inserting.
 */
export async function seedSquadData(
  supabase: SupabaseParam,
  tenantId: string,
): Promise<{
  departments: number;
  squads: number;
  agents: number;
}> {
  let departmentsCreated = 0;
  let squadsCreated = 0;
  let agentsCreated = 0;

  // 1. Seed departments
  const deptIdMap = new Map<string, string>();

  for (const dept of DEPARTMENT_TEMPLATES) {
    const { data: existing } = await supabase
      .from("departments")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("name", dept.name)
      .maybeSingle();

    if (existing) {
      deptIdMap.set(dept.slug, (existing as { id: string }).id);
      continue;
    }

    const { data, error } = await supabase
      .from("departments")
      .insert({
        tenant_id: tenantId,
        name: dept.name,
        emoji: dept.emoji,
        color: dept.color,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to seed department '${dept.slug}':`, error.message);
      continue;
    }

    deptIdMap.set(dept.slug, (data as { id: string }).id);
    departmentsCreated++;
  }

  // 2. Seed squads
  const squadIdMap = new Map<string, string>();

  for (const squad of SQUAD_TEMPLATES) {
    const deptId = deptIdMap.get(squad.department_slug);
    if (!deptId) continue;

    const { data: existing } = await supabase
      .from("squads")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("department_id", deptId)
      .eq("name", squad.name)
      .maybeSingle();

    if (existing) {
      squadIdMap.set(squad.slug, (existing as { id: string }).id);
      continue;
    }

    const { data, error } = await supabase
      .from("squads")
      .insert({
        tenant_id: tenantId,
        department_id: deptId,
        name: squad.name,
        description: squad.description,
        status: "ativo",
      })
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to seed squad '${squad.slug}':`, error.message);
      continue;
    }

    squadIdMap.set(squad.slug, (data as { id: string }).id);
    squadsCreated++;
  }

  // 3. Seed agents
  for (const agent of AGENT_TEMPLATES) {
    const deptId = deptIdMap.get(agent.department_slug);
    const squadId = squadIdMap.get(agent.squad_slug);
    if (!deptId || !squadId) continue;

    const { data: existing } = await supabase
      .from("agents")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("name", agent.name)
      .eq("department_id", deptId)
      .maybeSingle();

    if (existing) continue;

    const { error } = await supabase.from("agents").insert({
      tenant_id: tenantId,
      squad_id: squadId,
      department_id: deptId,
      name: agent.name,
      initials: agent.initials,
      status: agent.status,
      description: agent.description,
      skills: agent.skills,
      config: agent.config,
      last_action: agent.last_action,
      performance_metrics: {
        tasks_completed: agent.tasks_completed,
        tasks_failed: agent.tasks_failed,
        approval_rate: agent.approval_rate,
      },
    });

    if (error) {
      console.error(`Failed to seed agent '${agent.name}':`, error.message);
      continue;
    }

    agentsCreated++;
  }

  return {
    departments: departmentsCreated,
    squads: squadsCreated,
    agents: agentsCreated,
  };
}

// ---------------------------------------------------------------------------
// Exports for reference
// ---------------------------------------------------------------------------

export { DEPARTMENT_TEMPLATES, SQUAD_TEMPLATES, AGENT_TEMPLATES };
export type { DepartmentTemplate, SquadTemplate, AgentTemplate };
