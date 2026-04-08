# Kairus OS

Painel de gestao inteligente para PMEs.

## Sobre

Kairus OS e um painel completo de gestao empresarial com 20+ telas funcionais, reunindo financeiro, marketing, vendas, equipe e operacoes em uma unica interface. Dark theme com glass morphism.

## Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Framer Motion
- **Charts:** Recharts
- **State:** Zustand
- **Icons:** Lucide React
- **Auth (preparado):** Supabase
- **AI Chat:** AI SDK + Claude CLI (opcional)

## Pre-requisitos

- Node.js >= 20
- npm

## Instalacao

```bash
git clone <repo-url>
cd kairus-demo
cp .env.example .env   # preencher variaveis quando necessario
npm install
```

## Variaveis de ambiente

Veja `.env.example`. Todas sao opcionais para rodar o app em modo demo (dados mockados).

| Variavel | Descricao |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anonima do Supabase |
| `OPENROUTER_API_KEY` | API key do OpenRouter (AI chat) |
| `BLING_API_KEY` | API key do Bling ERP (estoque) |
| `MRLION_VAULT_PATH` | Caminho local para vault de dados |

## Comandos

```bash
npm run dev        # Servidor de desenvolvimento (http://localhost:3000)
npm run build      # Build de producao
npm run start      # Servidor de producao
npm run lint       # Linting
npm run typecheck  # Verificacao de tipos
npm run test       # Testes unitarios
npm run test:e2e   # Testes end-to-end
npm run check      # Lint + typecheck + build
```

## Estrutura do projeto

```
src/
  app/            # Paginas (App Router)
  components/     # Componentes React
  data/           # Dados mockados
  hooks/          # Custom hooks
  lib/            # Utilitarios e helpers
  stores/         # Estado (Zustand)
  types/          # TypeScript types
  providers/      # React providers
public/           # Assets estaticos
e2e/              # Testes end-to-end
supabase/         # Configuracao Supabase
docs/
  screenshots/    # Screenshots do app
  research/       # Pesquisas de mercado
  specs/          # Especificacoes tecnicas
```

## Modulos

| Modulo | Descricao |
|---|---|
| Dashboard | KPIs e metricas do negocio |
| Financeiro | Receitas, despesas, fluxo de caixa |
| Marketing | Campanhas e analytics |
| Sales Room | Pipeline de vendas com AI agents |
| ROI | Calculadora de retorno |
| Equipe | Gestao de equipe e permissoes |
| Relatorios | Relatorios gerenciais |
| Inbox | Mensagens e notificacoes |
| Agent | Interface de AI agents |
| Integracoes | Conexoes externas |
| Tasks | Gestao de tarefas |
| Views | Views customizadas |
| World | Visao global interativa |
| Roadmap | Planejamento do produto |

## AI Chat (opcional)

O modulo de AI agents usa Claude CLI (`claude --print`) como backend. Funciona com Claude Code instalado e logado. Sem ele, o app roda normalmente — apenas o chat nao responde.

Para habilitar:
1. Instale o [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
2. Execute `claude login`
3. O chat dos agentes funcionara automaticamente

## Deploy

O projeto e compativel com Vercel, Docker e qualquer plataforma que suporte Next.js.

```bash
# Docker
docker build -t kairus-os .
docker run -p 3000:3000 kairus-os
```

## Licenca

MIT — veja [LICENSE](LICENSE) para detalhes.
