// Agent metadata — safe for client-side import (no env vars, no server deps)
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, ShoppingCart, Package, Brain } from 'lucide-react';

export interface AgentMeta {
  nome: string;
  cor: string;
  icon: LucideIcon;
  descricao: string;
  modelo: string;
}

export const AGENT_META: Record<string, AgentMeta> = {
  orquestrador: {
    nome: 'Kairus',
    cor: '#a1a1aa',
    icon: Brain,
    descricao: 'Orquestrador — visao estrategica e roteamento',
    modelo: 'claude-opus-4-6',
  },
  financeiro: {
    nome: 'Rex',
    cor: '#a1a1aa',
    icon: TrendingUp,
    descricao: 'Financeiro — DRE, margens, faturamento',
    modelo: 'claude-sonnet-4-6',
  },
  ecommerce: {
    nome: 'Leo',
    cor: '#a1a1aa',
    icon: ShoppingCart,
    descricao: 'Vendas — pipeline, leads, conversao',
    modelo: 'claude-sonnet-4-6',
  },
  estoque: {
    nome: 'Sol',
    cor: '#a1a1aa',
    icon: Package,
    descricao: 'Suporte — estoque, logistica, atendimento',
    modelo: 'claude-haiku-4-5-20251001',
  },
};

export const AGENT_IDS = Object.keys(AGENT_META);
