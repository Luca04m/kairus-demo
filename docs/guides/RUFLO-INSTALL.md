# Ruflo v3.5 — Tutorial de Instalacao no Kairus Demo

> Baseado no README oficial do ruflo/claude-flow v3.5

## Pre-requisitos

- Node.js 20+ (verificar: `node -v`)
- npm 9+ (verificar: `npm -v`)
- Claude Code instalado globalmente (`npm install -g @anthropic-ai/claude-code`)

## Passo 1: Entrar no projeto

```bash
cd /Volumes/KINGSTON/kairus-demo
```

## Passo 2: Instalar Ruflo (escolha UMA opcao)

### Opcao A — Wizard interativo (recomendado para primeira vez)

```bash
npx ruflo@latest init --wizard
```

O wizard guia voce pelas opcoes: topologia, providers, hooks, etc.

### Opcao B — Init padrao (setup rapido)

```bash
npx ruflo@latest init
```

Cria a infraestrutura base (CLAUDE.md atualizado, hooks, agents, skills) sem modificar seu codigo.

### Opcao C — Init completo (tudo de uma vez)

```bash
npx ruflo@latest init --full
```

Inclui: init + skills extras + hooks avancados.

## Passo 3: Configurar MCP Server (integrar com Claude Code)

```bash
claude mcp add ruflo -- npx -y ruflo@latest mcp start
```

Isso registra o Ruflo como MCP server no Claude Code, liberando 313 tools.

Verificar:

```bash
claude mcp list
```

## Passo 4: Diagnostico

```bash
npx ruflo@latest doctor --fix
```

Verifica: Node.js, npm, Git, config, daemon, memoria, API keys, MCP, disco.

## Passo 5: Bootstrap de inteligencia (opcional mas recomendado)

```bash
npx ruflo@latest hooks pretrain --depth deep
```

Escaneia o codebase e aprende patterns do projeto antes de voce comecar.

## Passo 6: Verificar instalacao

```bash
# Listar agents disponiveis
npx ruflo@latest agent list

# Status do sistema
npx ruflo@latest status

# Testar memory search
npx ruflo@latest memory search -q "test" --build-hnsw
```

## O que o init cria no projeto

```
kairus-demo/
├── .claude/
│   ├── settings.json      (atualizado com hooks + statusline)
│   ├── helpers/
│   │   ├── hook-handler.cjs
│   │   ├── statusline.cjs
│   │   └── ...
│   └── skills/            (skills do ruflo)
├── .claude-flow/
│   ├── data/              (memoria, patterns, SQLite)
│   ├── metrics/           (progresso, swarm activity)
│   └── security/          (audit status)
├── CLAUDE.md              (atualizado com regras do ruflo)
└── claude-flow.config.json (configuracao principal)
```

> IMPORTANTE: O Ruflo NAO modifica seu codigo fonte (src/, pages/, components/).
> Ele adiciona infraestrutura de orquestracao ao lado do projeto.

## Comandos do dia-a-dia

```bash
# Iniciar sessao com daemon
npx ruflo@latest hooks session-start --start-daemon

# Rotear task para melhor agente
npx ruflo@latest hooks route "implementar auth com Supabase" --include-explanation

# Spawnar um agente
npx ruflo@latest agent spawn -t coder --name dev-1

# Iniciar swarm para task complexa
npx ruflo@latest hive-mind spawn "Implementar dashboard financeiro"

# Encerrar sessao salvando patterns
npx ruflo@latest hooks session-end --persist-patterns
```

## Upgrade futuro

```bash
npx ruflo@latest init upgrade --add-missing
```

Atualiza helpers e adiciona skills/agents novos sem sobrescrever customizacoes.

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| MCP nao conecta | `npx ruflo@latest mcp start` em separado |
| Agent nao spawna | `export CLAUDE_FLOW_MAX_AGENTS=5` |
| npm audit warnings | `npm install --omit=optional` |
| Lento na primeira vez | Normal — npx baixa ~340MB. Depois fica cached |

---

*Tutorial gerado em 2026-04-06 pelo Swarm Orchestrator*
