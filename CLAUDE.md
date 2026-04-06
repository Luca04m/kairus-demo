# Kairus OS Demo — Claude Code Project Instructions

> Ruflo v3.5 integrated — multi-agent orchestration with self-learning hooks

## O que e este projeto

Kairus OS Demo — prototipo visual do painel inteligente Kairus para PMEs, construido como showcase para o cliente Mr. Lion. Contem 20+ telas funcionais com dados mockados. NAO e o produto final (esse esta em `/Volumes/KINGSTON/kairus-os`).

## Stack

- **Framework:** Next.js 16.2 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Framer Motion, Lucide icons
- **State:** Zustand
- **Charts:** Recharts
- **Auth (preparado):** Supabase SSR + supabase-js
- **Styling:** CVA (class-variance-authority) + clsx + tailwind-merge
- **Language:** TypeScript 5, ESLint 9

## Estrutura

```
src/app/
├── dashboard/        # Painel principal
├── financeiro/       # Modulo financeiro
├── marketing/        # Modulo marketing
├── sales-room/       # Pipeline de vendas
├── roi/              # Calculadora ROI
├── equipe/           # Gestao de equipe
├── relatorios/       # Relatorios
├── inbox/            # Mensagens/notificacoes
├── agent/            # AI Agent interface
├── agent-templates/  # Templates do agent
├── integrations/     # Integracoes externas
├── configuracoes/    # Settings do app
├── roadmap/          # Roadmap do produto
├── tasks/            # Gestao de tarefas
├── views/            # Views customizadas
├── world/            # Visao global
├── auth/             # Auth pages
├── login/            # Login page
├── settings/         # User settings
└── api/              # API routes
```

## Comandos

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run check      # lint + typecheck + build
```

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- Respostas em portugues, termos tecnicos em ingles

## File Organization

- NEVER save to root folder — use the directories below
- Use `src/` for source code files
- Use `src/components/` for shared components
- Use `src/app/` for pages (App Router)
- Use `src/lib/` for utilities and helpers
- Use `src/types/` for TypeScript types
- Use `docs/` for documentation and markdown files

## Regras de desenvolvimento

- Manter design visual consistente (dark theme, glass morphism)
- Dados mockados — NAO conectar a APIs reais sem autorizacao
- Imports absolutos com `@/` (ex: `@/components/ui/button`)
- Tailwind CSS para styling, evitar CSS modules
- Animacoes via Framer Motion
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Ensure input validation at system boundaries

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

All operations MUST be concurrent/parallel in a single message when possible:

- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL terminal operations in ONE Bash message
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL memory store/retrieve operations in ONE message
- Use Claude Code's Task tool for spawning agents, not just MCP

## Contexto de negocio

- **Cliente:** Mr. Lion (Casa Mr. Lion — e-commerce de bebidas)
- **Objetivo:** Demonstrar o potencial do Kairus OS como painel de gestao para PMEs
- **Publico:** Dono de PME que quer ver metricas, financeiro, marketing e vendas em um lugar
- **Prioridade:** Visual polish > funcionalidade real. E um demo, nao um MVP.

---

## Ruflo v3.5 — Orchestration Configuration

Ruflo esta instalado neste projeto. Hooks, skills, agents e MCP server configurados em `.claude/`. O daemon roda em background. Patterns aprendidos ficam em `.claude-flow/data/`.

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var->const, add types) — Skip LLM entirely |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]` — intent types: `var-to-const`, `add-types`, `add-error-handling`, `async-await`, `add-logging`, `remove-console`

### Anti-Drift Swarm Configuration (Default)

```javascript
swarm_init({
  topology: "hierarchical",  // Single coordinator enforces alignment
  maxAgents: 8,              // Smaller team = less drift
  strategy: "specialized"    // Clear roles, no overlap
})
```

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use `raft` consensus for hive-mind
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

### Agent Routing (Task -> Agents)

| Code | Task Type | Agents |
|------|-----------|--------|
| 1 | Bug Fix | coordinator, researcher, coder, tester |
| 3 | Feature | coordinator, architect, coder, tester, reviewer |
| 5 | Refactor | coordinator, architect, coder, reviewer |
| 7 | Performance | coordinator, perf-engineer, coder |
| 9 | Security | coordinator, security-architect, auditor |
| 11 | Memory | coordinator, memory-specialist, perf-engineer |
| 13 | Docs | researcher, api-docs |

Codes 1-11: hierarchical/specialized (anti-drift). Code 13: mesh/balanced.

### Task Complexity Detection

**AUTO-INVOKE SWARM when task involves:**
- Multiple files (3+)
- New feature implementation
- Refactoring across modules
- API changes with tests
- Security-related changes
- Performance optimization

**SKIP SWARM for:**
- Single file edits
- Simple bug fixes (1-2 lines)
- Documentation updates
- Configuration changes
- Quick questions/exploration

### MCP + Task Tool Protocol

- MUST call MCP tools AND Task tool in ONE message for complex work
- MCP tools ONLY COORDINATE (swarm init, memory, neural features)
- Claude Code Task tool does the ACTUAL EXECUTION (file ops, code gen, bash)
- Always call MCP first, then IMMEDIATELY call Task tool to spawn agents

### Essential Hook Commands

```bash
# Session management
npx ruflo@latest hooks session-start --load-context
npx ruflo@latest hooks session-end --persist-patterns

# Intelligence routing
npx ruflo@latest hooks route "<task>" --include-explanation

# Pattern learning
npx ruflo@latest hooks pretrain --depth deep
npx ruflo@latest hooks post-edit --file "<file>" --train-patterns

# Background workers
npx ruflo@latest hooks worker list
npx ruflo@latest hooks worker dispatch --trigger audit

# Daemon
npx ruflo@latest daemon start
npx ruflo@latest daemon stop

# Diagnostics
npx ruflo@latest doctor --fix
```

### Hooks System (17 Hooks + 12 Workers)

| Category | Hooks | Purpose |
|----------|-------|---------|
| **Core** | `pre-edit`, `post-edit`, `pre-command`, `post-command`, `pre-task`, `post-task` | Tool lifecycle |
| **Session** | `session-start`, `session-end`, `session-restore`, `notify` | Context management |
| **Intelligence** | `route`, `explain`, `pretrain`, `build-agents`, `transfer` | Neural learning |
| **Learning** | `intelligence` (trajectory-start/step/end, pattern-store/search, stats) | Reinforcement |

### 12 Background Workers

| Worker | Priority | Description |
|--------|----------|-------------|
| `ultralearn` | normal | Deep knowledge acquisition |
| `optimize` | high | Performance optimization |
| `consolidate` | low | Memory consolidation |
| `audit` | critical | Security analysis |
| `map` | normal | Codebase mapping |
| `deepdive` | normal | Deep code analysis |
| `document` | normal | Auto-documentation |
| `refactor` | normal | Refactoring suggestions |
| `benchmark` | normal | Performance benchmarking |
| `testgaps` | normal | Test coverage analysis |

### Intelligence System

- **SONA**: Self-Optimizing Neural Architecture (<0.05ms adaptation)
- **HNSW**: 150x-12,500x faster pattern search
- **EWC++**: Elastic Weight Consolidation (prevents forgetting)

4-step pipeline:
1. **RETRIEVE** — Fetch relevant patterns via HNSW
2. **JUDGE** — Evaluate with verdicts (success/failure)
3. **DISTILL** — Extract key learnings via LoRA
4. **CONSOLIDATE** — Prevent catastrophic forgetting via EWC++

### Available Agents (Key Types)

| Category | Agents |
|----------|--------|
| **Core** | `coder`, `reviewer`, `tester`, `planner`, `researcher` |
| **V3 Specialized** | `security-architect`, `memory-specialist`, `performance-engineer` |
| **Swarm** | `hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator` |
| **SPARC** | `sparc-coord`, `specification`, `pseudocode`, `architecture`, `refinement` |
| **GitHub** | `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager` |

### Headless Background Instances

```bash
# Spawn parallel headless Claude instances
claude -p "Analyze src/app/dashboard for performance" &
claude -p "Write tests for src/components/ui/" &
wait

# With model selection
claude -p --model haiku "Format config"
claude -p --model opus "Design database schema"

# With budget limits
claude -p --max-budget-usd 0.50 "Security audit"
```

### Project Ruflo Configuration

- **Topology**: hierarchical
- **Max Agents**: 8
- **Strategy**: specialized
- **Consensus**: raft
- **Memory Backend**: hybrid (SQLite + AgentDB)
- **HNSW Indexing**: Enabled
- **Neural Learning**: Enabled (SONA)

---

Remember: **Ruflo coordinates, Claude Code creates!**
