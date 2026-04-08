# Kairus OS

Painel de gestao inteligente para PMEs.

## Sobre

Kairus OS e um painel completo de gestao empresarial com 20+ telas funcionais. Desenvolvido para a Casa Mr. Lion (e-commerce de bebidas), serve como solucao all-in-one para gestao de pequenas e medias empresas -- reunindo financeiro, marketing, vendas, equipe e operacoes em uma unica interface.

## Stack

| Tecnologia | Versao / Detalhes |
|---|---|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| shadcn/ui | Radix primitives |
| Framer Motion | Animacoes |
| Recharts | Graficos e visualizacoes |
| Zustand | Gerenciamento de estado |
| Supabase | Auth e banco de dados (preparado) |

## Pre-requisitos

- Node.js 20+
- npm 9+

## Instalacao

```bash
git clone https://github.com/seu-usuario/kairus-demo.git
cd kairus-demo
npm install
```

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz (opcional para o modo demo):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

O app funciona sem Supabase configurado -- usa dados mockados como fallback.

## Comandos

| Comando | Descricao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (http://localhost:3000) |
| `npm run build` | Build de producao |
| `npm start` | Servidor de producao |
| `npm run lint` | Linting com ESLint |
| `npm run typecheck` | Verificacao de tipos TypeScript |
| `npm test` | Testes unitarios (Vitest) |
| `npm run test:e2e` | Testes end-to-end (Playwright) |
| `npm run check` | Lint + typecheck + build |

## Modulos

| Modulo | Descricao |
|---|---|
| Dashboard | Visao geral de KPIs e metricas do negocio |
| Financeiro | Controle financeiro com receitas, despesas e fluxo de caixa |
| Marketing | Gestao de campanhas e analytics de performance |
| Sales Room | Pipeline de vendas com suporte a AI agents |
| ROI | Calculadora de retorno sobre investimento |
| Equipe | Gestao de equipe, membros e permissoes |
| Relatorios | Relatorios gerenciais com exportacao |
| Inbox | Central de mensagens e notificacoes |
| Agent | Interface de interacao com AI agents |
| Integracoes | Conexoes com plataformas externas |
| Configuracoes | Ajustes gerais do aplicativo |
| Tasks | Gestao de tarefas e acompanhamento |
| Views | Views customizadas de dados |
| World | Visao global com mapa interativo |
| Roadmap | Roadmap do produto e planejamento |

## Estrutura do Projeto

```
src/
├── app/          # Paginas (App Router)
├── components/   # Componentes compartilhados
├── data/         # Dados mockados
├── hooks/        # Custom hooks
├── lib/          # Utilitarios
├── stores/       # Estado (Zustand)
├── types/        # TypeScript types
└── providers/    # React providers
e2e/              # Testes end-to-end
public/           # Assets estaticos
supabase/         # Configuracao Supabase
```

## Docker

```bash
docker compose up
```

## Deploy

O projeto esta configurado para deploy na Vercel. Para outras plataformas, faca o build com `npm run build` e sirva a pasta `.next/`.

## Licenca

MIT -- veja [LICENSE](LICENSE) para detalhes.
