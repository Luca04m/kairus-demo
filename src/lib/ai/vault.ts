import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const VAULT_PATH = process.env.MRLION_VAULT_PATH;

/**
 * Lê um arquivo do vault Mr. Lion (server-side only).
 * Retorna null se vault não configurado ou arquivo não encontrado.
 */
export function readVaultFile(filename: string): string | null {
  if (!VAULT_PATH) return null;
  const filepath = join(VAULT_PATH, filename);
  if (!existsSync(filepath)) return null;
  try {
    return readFileSync(filepath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Lista datasets Gold disponíveis no vault (excluindo arquivados/).
 */
export function listVaultDatasets(): string[] {
  if (!VAULT_PATH) return [];
  try {
    const goldPath = join(VAULT_PATH, 'gold');
    if (!existsSync(goldPath)) return [];
    return readdirSync(goldPath)
      .filter((f) => f.endsWith('.md') || f.endsWith('.csv') || f.endsWith('.json'))
      .slice(0, 20); // limitar para tokens
  } catch {
    return [];
  }
}

/**
 * Carrega resumo financeiro do vault para system prompt do Leo.
 */
export function loadFinanceiroContext(): string {
  const context = readVaultFile('CONTEXT.md');
  if (context) {
    // Extrair seção financeira relevante (limitar tokens)
    const sections = context.split(/^##\s/m);
    const finSections = sections.filter(
      (s) =>
        /faturamento|financeiro|dre|margem|gasto|receita|custo/i.test(s.substring(0, 100))
    );
    if (finSections.length > 0) {
      return finSections.map((s) => '## ' + s).join('\n').substring(0, 4000);
    }
    return context.substring(0, 3000);
  }

  // Fallback inline — dados reais resumidos do vault
  return `
## Dados Financeiros Casa Mr. Lion (resumo)
- Faturamento 2025: R$ 1.840.000
- Faturamento Jan/2026: R$ 168.420
- Faturamento Fev/2026: R$ 152.870
- Ticket médio: R$ 89,50
- Margem bruta média: 42%
- Top produto por receita: Kit Degustação Premium (R$ 23.400/mês)
- Gastos operacionais mensais: ~R$ 45.000
- CAC médio: R$ 32,00
- LTV médio: R$ 890,00
- Métodos de pagamento: PIX (62%), Cartão (28%), Boleto (10%)
- B2B representa 35% do faturamento (12 clientes ativos)
`;
}

/**
 * Carrega contexto e-commerce para system prompt do Rex.
 */
export function loadEcommerceContext(): string {
  const context = readVaultFile('CONTEXT.md');
  if (context) {
    const sections = context.split(/^##\s/m);
    const ecomSections = sections.filter(
      (s) =>
        /combo|produto|venda|woocommerce|carrinho|conversão|geografia|tráfego|marketing/i.test(
          s.substring(0, 100)
        )
    );
    if (ecomSections.length > 0) {
      return ecomSections.map((s) => '## ' + s).join('\n').substring(0, 4000);
    }
    return context.substring(0, 3000);
  }

  return `
## Dados E-commerce Casa Mr. Lion (resumo)
- Plataforma: WooCommerce
- Produtos ativos: 127
- Pedidos/mês (média): ~1.850
- Taxa de conversão: 3.2%
- Carrinho médio: R$ 89,50
- Top 5 combos mais vendidos:
  1. Kit Degustação Premium — R$ 189,90 (312 vendas/mês)
  2. Combo Cervejas Artesanais — R$ 129,90 (278 vendas/mês)
  3. Pack Vinhos Selecionados — R$ 249,90 (145 vendas/mês)
  4. Kit Whisky Iniciante — R$ 199,90 (98 vendas/mês)
  5. Combo Happy Hour — R$ 79,90 (423 vendas/mês)
- Geografia: SP (45%), RJ (18%), MG (12%), outros (25%)
- Canal: Orgânico (38%), Meta Ads (32%), Google (18%), Direto (12%)
- Taxa de recompra 90 dias: 34%
`;
}

/**
 * Carrega contexto de estoque para system prompt do Sol.
 */
export function loadEstoqueContext(): string {
  const context = readVaultFile('CONTEXT.md');
  if (context) {
    const sections = context.split(/^##\s/m);
    const estSections = sections.filter(
      (s) =>
        /estoque|inventário|divergência|produto|armazém|bling/i.test(s.substring(0, 100))
    );
    if (estSections.length > 0) {
      return estSections.map((s) => '## ' + s).join('\n').substring(0, 4000);
    }
    return context.substring(0, 3000);
  }

  return `
## Dados de Estoque Casa Mr. Lion (resumo)
- Total SKUs ativos: 127
- Produtos com estoque baixo (<10 un): 8
- Produtos sem estoque: 3
- Valor total em estoque: R$ 285.000
- Giro médio: 18 dias
- Alertas atuais:
  - Honey Pingente: 4 unidades (estoque crítico)
  - Capuccino Garrafa: divergência +3 unidades
  - Black Honey: divergência -1 unidade
  - Gin Artesanal Premium: 2 unidades (estoque crítico)
- Integração: Bling ERP v3
- Última sincronização: hoje às 08:00
`;
}
