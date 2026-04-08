# Prompt 011 — Organizacao Completa + Auditoria do Projeto Kairus Demo

> Gerado por `/ruflo-prompt` em 2026-04-08
> Estado do sistema: **STANDARD+** (MCP ativo, daemon STOPPED)

---

## Plano Ruflo

**Estado do sistema:** STANDARD+ (MCP ativo via .mcp.json, daemon stopped, SONA 0 patterns, 238 patterns locais, 10 hooks OK)
**Resultado:** Projeto Kairus Demo reorganizado profissionalmente com separacao clara entre codigo do produto e tooling de agentes, documentacao atualizada, e auditoria completa do estado atual
**Modo:** Swarm Hierarchical
**Agentes:** 10
**Consenso:** raft
**Routing:** auto (3-tier)

### Agentes
1. coordinator (orquestra toda a operacao)
2. architect (define a estrutura organizacional ideal)
3. researcher (levanta o estado atual completo — arquivos, dependencias, imports)
4. coder-1 (executa reorganizacao de arquivos e imports)
5. coder-2 (executa reorganizacao de configs e tooling)
6. coder-3 (atualiza .gitignore, paths, referencias quebradas)
7. reviewer (valida que nada quebrou apos cada fase)
8. tester (roda build + lint + typecheck apos reorganizacao)
9. documenter (gera documentacao profissional atualizada)
10. security-auditor (auditoria completa de seguranca e higiene)

### Gaps do sistema
- **Daemon:** STOPPED — Workers indisponiveis (audit, map, optimize). Fix: `./node_modules/.bin/ruflo daemon start`
- **SONA patterns:** 0 — Sem aprendizado neural ativo. Fix: `./node_modules/.bin/ruflo hooks pretrain --depth medium`
- Prompt adaptado para funcionar sem daemon e sem workers.

---

## Prompt para Claude Code

Use o Ruflo MCP para orquestrar a seguinte task:

1. Carregue contexto da memoria:
   - `mcp__ruflo__memory_search` com queries: ["kairus structure", "project organization", "file audit", "code patterns"]
   - `mcp__ruflo__embeddings_search` com query: "kairus demo project structure organization audit"

2. Configure o swarm:
   - `mcp__ruflo__swarm_init` com:
     - topology: "hierarchical"
     - maxAgents: 10
     - strategy: "specialized"
     - consensus: "raft"
     - routing: auto

3. Spawne os agentes:
   - coordinator (coord-org)
   - architect (arch-org)
   - researcher (research-org)
   - coder x3 (coder-files, coder-configs, coder-refs)
   - reviewer (review-org)
   - tester (test-org)
   - documenter (doc-org)
   - security-auditor (audit-org)

4. Objetivo:

   "REORGANIZAR E AUDITAR O PROJETO KAIRUS DEMO PARA ESTADO PROFISSIONAL

   O projeto Kairus OS e um painel de gestao para PMEs (cliente: Casa Mr. Lion, e-commerce de bebidas). Contem 20+ telas funcionais em Next.js 16 + React 19 + Tailwind 4. O codigo do produto esta em src/ e funciona. O problema e a DESORGANIZACAO ao redor do codigo — raiz poluida, tooling misturado com projeto, docs espalhados, arquivos orfaos.

   ESTADO ATUAL DA RAIZ (40 arquivos, 28 diretorios):
   
   Arquivos que NAO pertencem a raiz:
   - agentdb.db, agentdb.rvf, agentdb.rvf.lock (databases de agentes)
   - ruvector.db (vector database)
   - claude-flow.config.json (config de orquestracao)
   - CODE_PATTERNS_AUDIT.md (resultado de audit anterior)
   - RUFLO-INSTALL.md (guia de instalacao do ruflo)
   - DEVELOPER_GUIDE.md (32KB — avaliar se e relevante ou lixo)
   - GEMINI.md (11 bytes — provavelmente lixo)
   
   Diretorios de tooling/agentes na raiz (avaliar quais sao necessarios):
   - .agents/ (config do Codex CLI)
   - .amazonq/ (Amazon Q)
   - .augment/ (Augment)
   - .continue/ (Continue)
   - .cursor/ (Cursor)
   - .firecrawl/ (Firecrawl)
   - .gemini/ (Gemini)
   - .opencode/ (OpenCode)
   - .windsurf/ (Windsurf)
   - .swarm/ (dados de swarm)
   - .claude-flow/ (dados do ruflo)
   
   Diretorios do projeto (manter):
   - src/ (codigo fonte — NUNCA reorganizar internamente sem autorizacao)
   - docs/ (14+ arquivos de audit/report misturados)
   - e2e/ (testes e2e)
   - public/ (assets estaticos)
   - supabase/ (config do supabase)
   - scripts/ (1 arquivo: apply-patches.mjs)
   - patches/ (patches de npm)
   - prompts/ (10 prompts — historico de sessoes)
   
   docs/ contem tudo misturado:
   - 6 arquivos audit-*.md
   - 6 arquivos kairus-*.md (reports de 2026-04-06)
   - performance-audit.md, code-quality-audit.md
   - research/, screenshots/, screenshots-check/, specs/
   
   .gitignore NAO cobre: .amazonq/, .augment/, .continue/, .cursor/, .firecrawl/, .gemini/, .opencode/, agentdb.*, ruvector.db, claude-flow.config.json, CODE_PATTERNS_AUDIT.md

   RESULTADO DESEJADO:

   1. RAIZ LIMPA — apenas arquivos essenciais do projeto:
      - Configs do projeto: package.json, tsconfig.json, next.config.ts, eslint, postcss, playwright, vitest, components.json, docker-compose.yml, Dockerfile(s)
      - Docs padrao: README.md, CHANGELOG.md, LICENSE, CLAUDE.md, CLAUDE.local.md
      - Dotfiles padrao: .gitignore, .gitattributes, .nvmrc, .env.example, .dockerignore
      - TUDO MAIS deve estar em subpastas organizadas

   2. SEPARACAO CLARA — duas categorias visiveis:
      - PROJETO: src/, docs/, e2e/, public/, supabase/, scripts/, patches/
      - TOOLING: tudo que e config de agente/IDE/orquestrador fica em dotfolders (.claude/, .agents/, etc.) e listado no .gitignore
      - Arquivos de runtime (*.db, *.rvf, *.lock) no .gitignore

   3. DOCS ORGANIZADOS — dentro de docs/:
      - docs/audits/ (todos os arquivos de auditoria)
      - docs/reports/ (todos os reports datados)
      - docs/specs/ (especificacoes)
      - docs/research/ (pesquisas)
      - docs/screenshots/ (screenshots do app)
      - docs/guides/ (guias como DEVELOPER_GUIDE se for relevante)

   4. .GITIGNORE ATUALIZADO — cobrir TODOS os arquivos de tooling/runtime:
      - Todos os dotfolders de IDE/agentes
      - Databases: *.db, *.rvf, *.rvf.lock
      - Config de orquestracao: claude-flow.config.json
      - Reports gerados que nao devem ir pro repo

   5. AUDITORIA COMPLETA — gerar um documento unico com:
      - Inventario de TODOS os arquivos e seus propositos
      - Status do build (compila? lint passa? types ok?)
      - Dependencias: quais sao usadas, quais sao desnecessarias
      - Arquivos orfaos (existem mas ninguem importa)
      - Componentes duplicados ou muito similares
      - Estado de cada modulo/tela (funcional, parcial, placeholder)
      - Mapa de imports (quem depende de quem)
      - Problemas encontrados e recomendacoes
      - Salvar em docs/audits/project-audit-2026-04-08.md

   6. DOCUMENTACAO PROFISSIONAL — atualizar README.md com:
      - Descricao clara do projeto
      - Stack tecnologico
      - Estrutura de pastas (pos-reorganizacao)
      - Como rodar (dev, build, test)
      - Status atual do projeto

   CRITERIOS DE SUCESSO:
   - npm run build passa sem erros apos reorganizacao
   - npm run lint passa sem erros
   - Nenhum import quebrado (verificar com typecheck)
   - Raiz tem no maximo 20 arquivos (excluindo dotfiles)
   - Nenhum arquivo .db, .rvf ou de runtime na raiz visivel ao git
   - docs/ tem subpastas organizadas por categoria
   - .gitignore cobre todo tooling/runtime
   - Documento de auditoria completo e profissional gerado
   - README.md atualizado e profissional

   CONSTRAINTS:
   - NUNCA reorganizar internamente src/app/ — a estrutura de paginas e intencional
   - NUNCA reorganizar src/components/ — os componentes estao funcionando
   - NUNCA deletar arquivos sem confirmar que sao realmente orfaos
   - NUNCA alterar logica de codigo — apenas mover arquivos e atualizar imports se necessario
   - NUNCA remover .claude/ ou .claude-flow/ — sao essenciais para o Ruflo
   - Manter CLAUDE.md e CLAUDE.local.md na raiz (exigido pelo Claude Code)
   - Se um arquivo parecer importante mas voce nao tem certeza, MOVA em vez de deletar
   - Build DEVE continuar funcionando em cada fase da reorganizacao
   - Rodar verificacao (build + lint + typecheck) ANTES e DEPOIS de cada grupo de mudancas"

5. Pos-execucao:
   - `mcp__ruflo__memory_store` com key: "kairus-org-audit-2026-04-08" e value descritivo do resultado
   - `mcp__ruflo__session_save`

---

## Por Que Este Setup

**Estado:** STANDARD+ — MCP ativo permite coordenacao via tools, mas sem daemon os workers (audit, map, optimize) nao rodam em background. O swarm compensa com agentes dedicados (researcher faz o papel do worker map, security-auditor faz o papel do worker audit).

**Modo:** Swarm Hierarchical — tarefa multi-fase que precisa de coordenacao central forte. O coordinator garante que a reorganizacao acontece em fases (audit primeiro, depois mover, depois validar, depois documentar) sem drift.

**Agentes (10):** Tres coders permitem paralelismo na reorganizacao (um move arquivos de projeto, outro configs de tooling, outro atualiza referencias). Researcher levanta o estado completo antes de qualquer mudanca. Reviewer e tester validam apos cada fase. Documenter e security-auditor trabalham em paralelo no final.

**Consenso (raft):** Decisoes rapidas e consistentes. O coordinator como lider garante que nao ha conflitos na reorganizacao (ex: dois coders tentando mover o mesmo arquivo).

**Adaptacoes por estado do sistema:**
- Sem daemon: researcher substitui worker `map`, security-auditor substitui worker `audit`
- Sem SONA: routing auto usa intelligence local (238 patterns) em vez de neural
- 10 agentes (nao 15): sem daemon, menos coordenacao paralela e possivel
