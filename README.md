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
docs/
├── audits/       # Auditorias de qualidade
├── reports/      # Relatorios datados
├── guides/       # Guias de desenvolvimento
├── specs/        # Especificacoes tecnicas
├── research/     # Pesquisas de mercado
└── screenshots/  # Screenshots do app
e2e/              # Testes end-to-end
public/           # Assets estaticos
supabase/         # Configuracao Supabase
```

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000
```

## Comandos

| Comando | Descricao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run lint` | Linting com ESLint |
| `npm run typecheck` | Verificacao de tipos TypeScript |

## Status

Em desenvolvimento ativo. 20+ telas funcionais com dados mockados. Interface com dark theme e glass morphism.

## Licenca

MIT -- veja [LICENSE](LICENSE) para detalhes.
