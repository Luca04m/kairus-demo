/**
 * Vault data loader — server-side only.
 *
 * Tenta carregar dados reais do vault Mr. Lion (via MRLION_VAULT_PATH).
 * Retorna null quando vault nao configurado, permitindo fallback para mock.
 */

import { readVaultFile } from '@/lib/ai/vault';

// ─── Helpers ─────────────────────────────────────────────────────────

function extractFromContext(context: string, pattern: RegExp): string | null {
  const match = context.match(pattern);
  return match?.[1]?.trim() ?? null;
}

function extractSection(context: string, sectionKeywords: RegExp): string | null {
  const sections = context.split(/^##\s/m);
  const matched = sections.filter((s) =>
    sectionKeywords.test(s.substring(0, 120))
  );
  if (matched.length === 0) return null;
  return matched.map((s) => '## ' + s).join('\n');
}

// ─── Dashboard KPIs ──────────────────────────────────────────────────

export interface VaultDashboardData {
  receitaTotal: string;
  receita2025: string;
  pedidos: string;
  ticketMedio: string;
  clientes: string;
}

export function getVaultDashboardData(): VaultDashboardData | null {
  const context = readVaultFile('CONTEXT.md');
  if (!context) return null;

  const receitaTotal = extractFromContext(
    context,
    /receita\s*total[:\s]*R?\$?\s*([\d.,]+)/i
  );
  const receita2025 = extractFromContext(
    context,
    /receita\s*2025[:\s]*R?\$?\s*([\d.,]+)/i
  );
  const pedidos = extractFromContext(
    context,
    /pedidos?\s*(?:total|acumulado)?[:\s]*([\d.,]+)/i
  );
  const ticketMedio = extractFromContext(
    context,
    /ticket\s*m[eé]dio[:\s]*R?\$?\s*([\d.,]+)/i
  );
  const clientes = extractFromContext(
    context,
    /clientes?\s*(?:total|base)?[:\s]*([\d.,]+)/i
  );

  // Se nao conseguiu extrair nenhuma metrica principal, vault nao e util
  if (!receitaTotal && !receita2025) return null;

  return {
    receitaTotal: receitaTotal ? `R$ ${receitaTotal}` : 'R$ 2.756.310',
    receita2025: receita2025 ? `R$ ${receita2025}` : 'R$ 1.839.359',
    pedidos: pedidos ?? '10.337',
    ticketMedio: ticketMedio ? `R$ ${ticketMedio}` : 'R$ 210,45',
    clientes: clientes ?? '8.809',
  };
}

// ─── Financeiro ──────────────────────────────────────────────────────

export interface VaultFinanceiroData {
  resumo: string;
  margemBruta: string | null;
  cogs: string | null;
  chargebackAlerta: string | null;
}

export function getVaultFinanceiroData(): VaultFinanceiroData | null {
  const context = readVaultFile('CONTEXT.md');
  if (!context) return null;

  const section = extractSection(
    context,
    /faturamento|financeiro|dre|margem|gasto|receita|custo/i
  );
  if (!section) return null;

  return {
    resumo: section.substring(0, 4000),
    margemBruta: extractFromContext(context, /margem\s*bruta[:\s]*([\d.,]+%?)/i),
    cogs: extractFromContext(context, /cogs?[:\s]*([\d.,]+%?)/i),
    chargebackAlerta: extractFromContext(
      context,
      /chargeback[s]?[:\s]*([\d.,]+%?\s*(?:—|-|–)?\s*R?\$?\s*[\d.,]*)/i
    ),
  };
}

// ─── Marketing ───────────────────────────────────────────────────────

export interface VaultMarketingData {
  resumo: string;
  spendTotal: string | null;
  roas: string | null;
  cpm: string | null;
}

export function getVaultMarketingData(): VaultMarketingData | null {
  const context = readVaultFile('CONTEXT.md');
  if (!context) return null;

  const section = extractSection(
    context,
    /marketing|campanha|meta\s*ads|google\s*ads|tráfego|roas|ctr/i
  );
  if (!section) return null;

  return {
    resumo: section.substring(0, 4000),
    spendTotal: extractFromContext(context, /spend\s*total[:\s]*R?\$?\s*([\d.,]+)/i),
    roas: extractFromContext(context, /roas\s*(?:geral)?[:\s]*([\d.,]+x?)/i),
    cpm: extractFromContext(context, /cpm\s*(?:m[eé]dio)?[:\s]*R?\$?\s*([\d.,]+)/i),
  };
}

// ─── E-commerce ──────────────────────────────────────────────────────

export interface VaultEcommerceData {
  resumo: string;
  taxaConversao: string | null;
  carrinhoMedio: string | null;
  topProdutos: string | null;
}

export function getVaultEcommerceData(): VaultEcommerceData | null {
  const context = readVaultFile('CONTEXT.md');
  if (!context) return null;

  const section = extractSection(
    context,
    /combo|produto|venda|woocommerce|carrinho|conversão|e-commerce/i
  );
  if (!section) return null;

  return {
    resumo: section.substring(0, 4000),
    taxaConversao: extractFromContext(
      context,
      /taxa\s*(?:de\s*)?convers[aã]o[:\s]*([\d.,]+%?)/i
    ),
    carrinhoMedio: extractFromContext(
      context,
      /carrinho\s*m[eé]dio[:\s]*R?\$?\s*([\d.,]+)/i
    ),
    topProdutos: extractSection(context, /top\s*\d+|mais\s*vendid/i)?.substring(0, 2000) ?? null,
  };
}

// ─── Generic vault check ─────────────────────────────────────────────

/** Returns true if the vault is configured and CONTEXT.md exists. */
export function isVaultConfigured(): boolean {
  return readVaultFile('CONTEXT.md') !== null;
}
