// src/lib/squads/types.ts

import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Enums & Literals
// ---------------------------------------------------------------------------

export type SquadStatus = "ativo" | "pausado" | "arquivado";
export type AgentStatus = "ativo" | "pausado" | "idle" | "desativado";
export type DepartmentDomain =
  | "financeiro"
  | "marketing"
  | "vendas"
  | "operacoes"
  | "atendimento";
export type AlertSeverity = "critico" | "alto" | "medio" | "baixo" | "info";
export type PresenceStatus = "online" | "busy" | "away" | "offline";

// ---------------------------------------------------------------------------
// Database Row Types
// ---------------------------------------------------------------------------

export interface DepartmentRow {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  emoji: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SquadRow {
  id: string;
  tenant_id: string;
  department_id: string;
  name: string;
  description: string | null;
  status: SquadStatus;
  created_at: string;
  updated_at: string;
}

export interface AgentPerformanceMetrics {
  tasks_completed: number;
  tasks_failed: number;
  approval_rate: number;
}

export interface AgentRow {
  id: string;
  tenant_id: string;
  squad_id: string | null;
  department_id: string;
  name: string;
  initials: string;
  type: "ai" | "human" | "hybrid";
  status: AgentStatus;
  description: string | null;
  skills: string[];
  config: Record<string, unknown>;
  performance_metrics: AgentPerformanceMetrics;
  last_action: string | null;
  last_action_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentPresenceRow {
  id: string;
  agent_id: string;
  room_id: string | null;
  current_task: string | null;
  status: PresenceStatus;
  last_seen_at: string;
  metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Enriched / Joined Types
// ---------------------------------------------------------------------------

export interface SquadWithAgents extends SquadRow {
  agents: AgentRow[];
  department?: DepartmentRow;
}

export interface SquadWithCounts extends SquadRow {
  agent_count: number;
  active_agent_count: number;
  department?: DepartmentRow;
}

export interface DepartmentWithCounts extends DepartmentRow {
  squad_count: number;
  agent_count: number;
  active_agent_count: number;
}

export interface AgentWithRelations extends AgentRow {
  squad?: SquadRow;
  department?: DepartmentRow;
  presence?: AgentPresenceRow;
}

// ---------------------------------------------------------------------------
// Activity & Metrics
// ---------------------------------------------------------------------------

export interface SquadActivity {
  id: string;
  squad_id: string;
  agent_id: string;
  agent_name: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SquadMetrics {
  squad_id: string;
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  avg_approval_rate: number;
  active_agents: number;
  total_agents: number;
}

export interface DepartmentStats {
  department_id: string;
  total_squads: number;
  total_agents: number;
  active_agents: number;
  total_tasks_completed: number;
  total_tasks_failed: number;
  avg_approval_rate: number;
}

// ---------------------------------------------------------------------------
// Input Types
// ---------------------------------------------------------------------------

export interface CreateSquadInput {
  tenant_id: string;
  department_id: string;
  name: string;
  description?: string;
  status?: SquadStatus;
}

export interface CreateDepartmentInput {
  tenant_id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  emoji?: string;
  order_index?: number;
}

export interface AgentFilters {
  tenant_id?: string;
  department_id?: string;
  squad_id?: string;
  status?: AgentStatus;
  search?: string;
}

// ---------------------------------------------------------------------------
// Realtime Event Types
// ---------------------------------------------------------------------------

export interface AgentStatusEvent {
  agent_id: string;
  old_status: AgentStatus;
  new_status: AgentStatus;
  timestamp: string;
}

export interface PresenceEvent {
  agent_id: string;
  agent_name: string;
  room_id: string;
  status: PresenceStatus;
  current_task: string | null;
}

export interface SquadActivityEvent {
  squad_id: string;
  activity: SquadActivity;
}

// ---------------------------------------------------------------------------
// Error Types
// ---------------------------------------------------------------------------

export class SquadError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "SquadError";
  }
}

export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AgentError";
  }
}

export class DepartmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "DepartmentError";
  }
}

// ---------------------------------------------------------------------------
// Utility: type-safe Supabase client param
// ---------------------------------------------------------------------------

export type SupabaseParam = SupabaseClient;

// ---------------------------------------------------------------------------
// Type Inference Helpers
// ---------------------------------------------------------------------------

const DOMAIN_SQUAD_MAP: Record<DepartmentDomain, string[]> = {
  financeiro: ["DRE", "Fluxo de Caixa", "Chargebacks", "Impostos"],
  marketing: ["Meta Ads", "Conteudo", "SEO", "Email Marketing"],
  vendas: ["B2B", "B2C", "Inside Sales", "Recompra"],
  operacoes: ["Estoque", "Logistica", "Entregas", "Fornecedores"],
  atendimento: ["WhatsApp", "Pos-Venda", "Trocas", "SAC"],
};

/**
 * Infer which department a squad belongs to based on its name/domain keywords.
 */
export function inferDepartmentFromSquadName(
  squadName: string,
): DepartmentDomain | null {
  const lower = squadName.toLowerCase();
  for (const [domain, keywords] of Object.entries(DOMAIN_SQUAD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return domain as DepartmentDomain;
    }
  }
  return null;
}

/**
 * Infer squad skills based on department domain.
 */
export function inferSkillsForDomain(domain: DepartmentDomain): string[] {
  const skillMap: Record<DepartmentDomain, string[]> = {
    financeiro: [
      "analise-dre",
      "fluxo-caixa",
      "deteccao-chargebacks",
      "margem-lucro",
    ],
    marketing: [
      "meta-ads",
      "conteudo-social",
      "analytics",
      "roas-otimizacao",
    ],
    vendas: ["crm-pipeline", "recompra-b2b", "ticket-medio", "follow-up"],
    operacoes: [
      "gestao-estoque",
      "rastreio-entregas",
      "reenvios",
      "fornecedores",
    ],
    atendimento: [
      "whatsapp-auto",
      "pos-venda",
      "trocas-devolucoes",
      "nps",
    ],
  };
  return skillMap[domain] ?? [];
}
