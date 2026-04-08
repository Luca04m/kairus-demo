// Claude CLI models por agente — Claude Max subscription, zero API keys
export const AGENT_MODELS: Record<string, string> = {
  financeiro: 'claude-sonnet-4-6',
  ecommerce: 'claude-sonnet-4-6',
  estoque: 'claude-haiku-4-5-20251001',
  orquestrador: 'claude-opus-4-6',
};

// Re-export for server-side usage
export { AGENT_META } from './agent-meta';
