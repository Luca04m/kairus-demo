# Kairus OS Demo — Plano de Acao Definitivo

> **Data:** 2026-04-06
> **Fontes:** 5 relatorios (assessment, test HTTP, performance, visual Playwright, button audit) + 2 memory refs (aiox capabilities, assessment summary)
> **Objetivo:** Levar o Kairus Demo de MVP decorativo (14% funcional) a OS nivel Apple
> **Executor:** 1 dev + Claude Code agents
> **Metodologia:** Evidence-based, zero suposicao, honestidade brutal

---

## Sumario Executivo

O Kairus Demo e um **showcase visual impressionante** construido sobre uma **base tecnica fragil**:

| Metrica | Valor | Fonte |
|---------|-------|-------|
| Paginas funcionais | 19/20 (HTTP 200) | Test Report |
| API routes funcionais | 0/10 (todas 401) | Test Report |
| Elementos interativos | 175 total | Button Audit |
| Funcionam de verdade | 24 (14%) | Button Audit |
| Decorativos (DEAD) | 88 (50%) | Button Audit |
| Local only (reset no refresh) | 60 (34%) | Button Audit |
| Testes automatizados | 0 | Assessment |
| Auth real | Nenhuma (bypass) | Assessment |
| Console errors em producao | 29 (27 x 401, 2 x 404) | Visual Test |
| Build size | 1.2 GB | Performance |
| JS bundle | 2.7 MB (2 chunks 404KB) | Performance |
| H1 ausente | 10 paginas | Visual Test |

**Veredicto:** O app e 86% decorativo. O usuario clica e nada acontece. Antes de adicionar features, o que existe precisa funcionar.

---

# DELIVERABLE 1 — BACKLOG UNICO PRIORIZADO

## Metodologia de Deduplicacao

Cada item foi cruzado entre as 5 fontes. IDs originais preservados para rastreabilidade.

| Fonte | Sigla | Total Findings |
|-------|-------|---------------|
| Assessment critico | F1-F52 | 52 |
| Test HTTP | BUG-001 a BUG-013 | 13 |
| Performance report | PERF-* | 6 |
| Visual Playwright | VBUG-001 a VBUG-009 | 9 |
| Button audit | BTN-* | 88 DEAD + 60 LOCAL |
| **Total bruto** | | **228** |
| **Apos deduplicacao** | | **97 items unicos** |

---

## EPIC A — DEAD BUTTONS: Triage dos 88 Elementos Mortos

### Decisao: REVIVE vs REMOVE vs DEFER

**Criterios de triage:**
- **REVIVE** = Adicionar handler real (toast, dialog, redirect, state change). Custo: S-M cada.
- **REMOVE** = Deletar do UI. O botao promete algo que nunca vai existir no demo. Honestidade > decoracao.
- **DEFER** = Manter visivel mas desabilitado (`disabled` + tooltip "Em breve"). Sera revivido quando backend suportar.

---

### A.1 BeamHomeContent.tsx (Homepage) — 11 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A01 | "Novo agente" button | 63 | **REVIVE** | Redirect para /agent-templates | S |
| A02 | "Perguntar" (Zap) | 109 | **REVIVE** | Submit chat → resposta fake animada | M |
| A03 | ChevronDown dropdown | 113 | **DEFER** | Disabled + tooltip "Selecionar modelo" | S |
| A04 | Paperclip (attach) | 120 | **DEFER** | Disabled + tooltip "Upload em breve" | S |
| A05 | Link2 | 123 | **REMOVE** | Proposito unclear, nenhum usuario vai usar | S |
| A06 | LayoutGrid | 126 | **REMOVE** | Proposito unclear | S |
| A07 | ArrowUp (send) | 129 | **REVIVE** | Submit chat (mesmo handler do A02) | S |
| A08-12 | Skills chips x5 | 148-155 | **REVIVE** | onClick popula chat input com texto do skill | S |

**Resultado:** 7 REVIVE, 2 REMOVE, 2 DEFER

---

### A.2 AgentChatContent.tsx (Chat do agente) — 11 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A13 | "Perguntar" mode | 29 | **REVIVE** | Toggle active state visual | S |
| A14 | "Executar" mode | 33 | **REVIVE** | Toggle active state visual | S |
| A15 | Chat textarea | 45-49 | **REVIVE** | Enable typing + submit | S |
| A16 | "Perguntar" (Zap) | 54 | **REVIVE** | Submit chat → resposta fake | M |
| A17 | ChevronDown | 58 | **DEFER** | Disabled + tooltip | S |
| A18 | Paperclip | 63 | **DEFER** | Disabled + tooltip | S |
| A19 | Settings2 | 66 | **DEFER** | Disabled + tooltip | S |
| A20 | ArrowUp (send) | 69 | **REVIVE** | Submit chat | S |
| A21-23 | Suggestion pills x3 | 83-88 | **REVIVE** | Populate chat input ao clicar | S |

**Resultado:** 7 REVIVE, 0 REMOVE, 3 DEFER

---

### A.3 AccountSettingsContent.tsx (Settings conta) — 14 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A24 | "Enviar foto" | 27-29 | **REVIVE** | Toast "Foto atualizada com sucesso" | S |
| A25 | Trash (remover foto) | 31-33 | **REVIVE** | Toast "Foto removida" | S |
| A26 | Email input (readOnly) | 48-50 | **REMOVE** | E display, nao input. Trocar por `<span>` | S |
| A27 | Nome completo input | 62-65 | **REVIVE** | Enable editing + local state | S |
| A28 | Nova senha input | 78-82 | **REVIVE** | Enable editing | S |
| A29 | Eye toggle senha | 83 | **REVIVE** | Toggle password visibility | S |
| A30 | Confirmar senha input | 99-102 | **REVIVE** | Enable editing | S |
| A31 | Eye toggle #2 | 104 | **REVIVE** | Toggle password visibility | S |
| A32 | "Atualizar senha" | 109 | **REMOVE** | Redundante com "Salvar alteracoes". Merge. | S |
| A33 | Dark theme card | 123-133 | **REVIVE** | Toggle tema dark (add onClick) | S |
| A34 | Light theme card | 136-143 | **REVIVE** | Toggle tema light (add onClick) | S |
| A35 | Idioma select | 158-163 | **REVIVE** | onChange com local state | S |
| A36 | "Excluir conta" | 177 | **REMOVE** | Perigoso no demo. Sem backend. Remover. | S |
| A37 | "Salvar alteracoes" | 186-188 | **REVIVE** | Toast "Alteracoes salvas com sucesso" | S |

**Resultado:** 10 REVIVE, 3 REMOVE, 0 DEFER

---

### A.4 AgentFlowContent.tsx (Flow builder) — 11 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A38 | "Ativo" status | 76-79 | **REVIVE** | Toggle badge active/inactive | S |
| A39 | "Criar tarefa" | 81 | **REVIVE** | Dialog "Nova tarefa" + toast | M |
| A40 | Chat trigger | 96 | **DEFER** | Disabled + tooltip "Trigger em breve" | S |
| A41 | Webhook trigger | 103 | **DEFER** | Disabled + tooltip | S |
| A42 | Agenda trigger | 110 | **DEFER** | Disabled + tooltip | S |
| A43 | Plus (add trigger) | 116 | **DEFER** | Disabled + tooltip | S |
| A44 | Plus (add step) | 140 | **DEFER** | Disabled + tooltip | S |
| A45-48 | Zoom controls x4 | 148-160 | **REVIVE** | Zoom in/out/fit/reset visual do canvas | S |

**Resultado:** 3 REVIVE, 0 REMOVE, 5 DEFER (flow triggers precisam backend real)

---

### A.5 AgentAnalyticsContent.tsx — 5 DEAD

| # | Elemento | Decisao | Acao | Esforco |
|---|----------|---------|------|---------|
| A49-53 | Date range + filter pills x5 | **DEFER** | Disabled + tooltip. Analytics nao e core. | S |

**Resultado:** 0 REVIVE, 0 REMOVE, 5 DEFER

---

### A.6 FinanceiroContent.tsx — 5 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A54 | Date range picker | 131 | **DEFER** | Disabled + tooltip | S |
| A55 | Download button | 151 | **REVIVE** | Toast "Relatorio baixado" | S |
| A56 | "+ Gerar relatorio" | 662 | **REVIVE** | Dialog com form basico + toast | M |
| A57 | "Ver" per card | 726 | **REVIVE** | Open modal com detalhes | M |
| A58 | Date range picker #2 | — | **DEFER** | Disabled | S |

**Resultado:** 3 REVIVE, 0 REMOVE, 2 DEFER

---

### A.7 InboxContent.tsx — 3 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A59 | Filter (sliders) | 141-144 | **DEFER** | Disabled + tooltip | S |
| A60 | Options (more) | 147-149 | **DEFER** | Disabled + tooltip | S |
| A61 | "Responder" | 358-362 | **REVIVE** | Open reply textarea + toast ao enviar | M |

**Resultado:** 1 REVIVE, 0 REMOVE, 2 DEFER

---

### A.8 IntegrationsContent.tsx — 8 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A62 | "Criar integracao" | 91 | **DEFER** | Disabled (precisa backend) | S |
| A63 | "Configurar" per card | 178 | **REVIVE** | Dialog de config mock + toast | M |
| A64 | "Desconectar" per card | 182 | **REMOVE** | Nada para desconectar no demo | S |
| A65 | "Categorias" | 197 | **REMOVE** | View mode nao implementado | S |
| A66 | "Listagem" | 201 | **REMOVE** | View mode nao implementado | S |
| A67 | "Adicionar conexao" | 252 | **REVIVE** | Toast "Conexao adicionada" | S |

**Resultado:** 2 REVIVE, 3 REMOVE, 1 DEFER (+ 2 items que a contagem original marca diferente)

---

### A.9 TasksContent.tsx — 2 DEAD

| # | Elemento | Linha | Decisao | Acao | Esforco |
|---|----------|-------|---------|------|---------|
| A68 | "Criar tarefa" | 136-138 | **REVIVE** | Dialog "Nova tarefa" + toast + add to list | M |
| A69 | "Visualizar" | 183-186 | **REVIVE** | Toggle list/card view | S |

**Resultado:** 2 REVIVE, 0 REMOVE, 0 DEFER

---

### A.10 Demais componentes — 22 DEAD

| Componente | Dead | REVIVE | REMOVE | DEFER | Acao principal |
|-----------|------|--------|--------|-------|----------------|
| RelatoriosContent | 3 | 2 | 1 | 0 | "Ver completo" modal, "Exportar" toast; remove filtro morto |
| ViewsContent | 3 | 1 | 2 | 0 | Toggle view; remove botoes sem proposito |
| AgentTemplatesContent | 2 | 2 | 0 | 0 | "Criar agente" → redirect/toast |
| AgentSettingsContent | 4 | 3 | 0 | 1 | "Salvar" → toast; defer advanced |
| AgentTasksContent | 3 | 2 | 0 | 1 | "Criar tarefa" → dialog; defer filter |
| HomeContent | 1 | 1 | 0 | 0 | "Ver alertas" → redirect /inbox |
| AppHeader | 4 | 1 | 3 | 0 | Search → Cmd+K; remove History/Network/History-alt |
| AppSidebar | 2 | 1 | 1 | 0 | "Chat e suporte" → redirect /; remove "Plano" |

---

### Resumo Triage DEAD Buttons

| Decisao | Count | % |
|---------|-------|---|
| **REVIVE** | 48 | 55% |
| **REMOVE** | 18 | 20% |
| **DEFER** (disabled + tooltip) | 22 | 25% |
| **Total** | **88** | 100% |

**Apos triage:**
- 48 botoes ganham handler real → app vai de 24 WORKS para **72 WORKS** (41% → muito melhor)
- 18 botoes removidos honestamente → UI nao mente mais
- 22 botoes desabilitados com tooltip → usuario sabe que esta em desenvolvimento
- 60 LOCAL ONLY permanecem (fase seguinte: persistir state)

---

## EPIC B — AUTH & SECURITY

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| B01 | Remover `.env.local` do repo + add ao .gitignore | F1 | P0 | S | — |
| B02 | Fix auth bypass — middleware funcional com demo mode toggle | F2, BUG-007, VBUG-001 | P0 | M | — |
| B03 | Fix API routes demo bypass (27 erros 401) | BUG-007, VBUG-001 | P0 | M | B02 |
| B04 | Criar rota /auth/callback para Supabase OAuth | BUG-006 | P1 | S | B02 |
| B05 | Fix login page crash sem env vars | F46 | P2 | S | B02 |
| B06 | Add security headers (X-Frame, CSP, X-Content-Type) | BUG-009/010/011 | P2 | S | — |
| B07 | Remove X-Powered-By header | Test Report | P3 | S | — |
| B08 | Add rel="noopener noreferrer" em links externos | F45 | P3 | S | — |

---

## EPIC C — DATA LAYER

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| C01 | EquipeContent: extrair dados para store/data file | F17 | P2 | S | — |
| C02 | ConfiguracoesContent: persistir settings (Zustand persist) | F20, BTN-audit | P2 | M | — |
| C03 | Unificar data layer — todos componentes via stores | F25 | P2 | M | — |
| C04 | Fix DEMO_USER email inconsistencia | F26 | P3 | S | — |
| C05 | Criar /api/inbox route (ou remover fetch) | F27, VBUG-004 | P2 | S | B03 |
| C06 | Criar /api/tasks route (ou remover fetch) | F28, VBUG-004 | P2 | S | B03 |
| C07 | Fix useSupabaseQuery error handling | F40 | P3 | S | — |
| C08 | UNREAD_COUNT reativo (derivar do store) | F41 | P3 | S | C03 |
| C09 | Wiring usePersistSetting em ConfiguracoesContent | BTN-audit | P2 | S | C02 |

---

## EPIC D — UX POLISH

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| D01 | Fix 3 paginas redirect (relatorios, roi, views) — conteudo real | F5, BUG-003/004 | P1 | M | — |
| D02 | Agent Flow: conteudo real em vez de redirect | F6 | P1 | M | — |
| D03 | Chat submit on Enter + handler funcional | F10, VBUG-006 | P0 | M | A02 |
| D04 | Inbox panel responsivo (nao fixo 280px) | F11 | P1 | S | — |
| D05 | Loading state na homepage | F15 | P2 | S | — |
| D06 | Agent pages: titulo dinamico (nao "sem titulo") | F16 | P2 | S | — |
| D07 | Password fields: validacao e submit funcional | F19 | P2 | M | A28-32 |
| D08 | Video: poster image + play on click (nao autoplay) | F22 | P2 | S | — |
| D09 | Desktop sidebar toggle funcional | F30, VBUG-002 | P2 | M | — |
| D10 | Tab state preservado entre navegacoes | F31, F52 | P2 | M | C03 |
| D11 | Pagina 404 customizada | F50 | P3 | S | — |
| D12 | Loading skeletons em World/Sales Room | F51 | P3 | S | — |
| D13 | H1 semantico em 10 paginas que faltam | VBUG-005 | P2 | S | — |
| D14 | /sales-room: conteudo visivel no HTML (SSR) | BUG-005 | P1 | M | — |
| D15 | /agent/[id]: validar ID ou 404 graceful | BUG-008 | P3 | S | — |
| D16 | ROI: inputs nativos para calculadora | VBUG-007 | P2 | M | — |
| D17 | Settings toggles: data-state funcional | VBUG-008 | P2 | S | C02 |

---

## EPIC E — PERFORMANCE

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| E01 | Remover `agentic-flow` do package.json | F12, PERF | P1 | S | — |
| E02 | Mover `shadcn` para devDependencies | F13, PERF | P1 | S | — |
| E03 | Usar next/image em todas imagens | F21 | P2 | S | — |
| E04 | Dynamic import Recharts (nao carregar em todas paginas) | F23, PERF | P2 | M | — |
| E05 | SSR guard para navigator.userAgent | F24 | P2 | S | — |
| E06 | will-change em glass-card para GPU | F49 | P3 | S | — |
| E07 | Font local com fallback (nao CDN) | F34 | P3 | S | — |
| E08 | Clean .next/ e rebuild (1.2GB → ~200MB) | BUG-012, PERF | P2 | S | — |
| E09 | Code-split os 2 chunks de 404KB | PERF | P2 | M | E04 |
| E10 | Video 3.3MB: lazy load + poster image | PERF | P2 | S | D08 |
| E11 | Refatorar 4 arquivos >500 linhas | PERF | P3 | M | — |

---

## EPIC F — TESTING

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| F01 | Setup Vitest + config basica | F3 | P0 | M | — |
| F02 | Setup Playwright config (ja instalado) | F3 | P0 | S | — |
| F03 | Smoke test: 19 rotas retornam 200 | BUG-* | P1 | M | F02 |
| F04 | E2E: chat submit funciona | D03 | P1 | S | F02, D03 |
| F05 | E2E: navegacao sidebar funciona | — | P1 | S | F02 |
| F06 | Unit tests: stores Zustand | — | P2 | M | F01 |
| F07 | Unit tests: componentes core (5-10) | — | P2 | L | F01 |
| F08 | Visual regression baseline (screenshots) | Visual Test | P2 | M | F02 |

---

## EPIC G — DESIGN SYSTEM

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| G01 | Migrar inline rgba() para CSS custom properties | F39 | P2 | L | — |
| G02 | Split globals.css (430 linhas) | F36 | P3 | M | — |
| G03 | Limpar dead code light theme ou habilitar toggle | F37 | P3 | S | A33-34 |
| G04 | Recharts Legend: usar Tailwind em vez de inline styles | F43 | P3 | S | — |
| G05 | Avaliar remocao de @base-ui/react (so usado em Button) | F35 | P3 | S | — |

---

## EPIC H — ACCESSIBILITY

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| H01 | Sidebar: usar `<nav>` + `<a>` semanticos | F8, VBUG-002/003, BUG-013 | P1 | M | — |
| H02 | aria-label em todos icon-only buttons | F9 | P1 | M | — |
| H03 | role= em componentes interativos (tabs, dialogs) | BUG-013 | P2 | M | — |
| H04 | tabIndex em elementos interativos | BUG-013 | P2 | M | — |
| H05 | Emojis → Lucide icons (acessiveis) | F48 | P3 | S | — |

---

## EPIC I — INFRA & DX

| ID | Titulo | Fonte(s) | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| I01 | Fix CI branch master → main | F4 | P1 | S | — |
| I02 | Limpar tsconfig exclude ds/ | F33 | P3 | S | — |
| I03 | Adicionar favicon.ico | F32 | P3 | S | — |
| I04 | Meta tags por pagina (title, description) | F18 | P2 | S | — |
| I05 | robots.txt + sitemap.xml | F38 | P3 | S | — |
| I06 | OpenGraph + Twitter card meta | F47 | P3 | S | — |
| I07 | Remover getRouteTitle() nao usado | F42 | P3 | S | — |
| I08 | Fix SSR bailout (financeiro, marketing) | BUG-001/002 | P3 | S | — |
| I09 | Fix NEXT_REDIRECT (roi, relatorios) | BUG-003/004 | P3 | S | D01 |
| I10 | Error boundaries per page | F29 | P1 | M | — |
| I11 | Fix font Geist aborted em /views | VBUG-009 | P3 | S | E07 |

---

## EPIC J — FEATURES AIOX-DASHBOARD (portar seletivamente)

| ID | Titulo | Ref aiox | Sev | Esforco | Deps |
|----|--------|----------|-----|---------|------|
| J01 | Design token system (4-tier) | aiox tokens | P1 | M | G01 |
| J02 | Command palette (Cmd+K) | aiox Cmd+K | P1 | M | — |
| J03 | Keyboard shortcuts (20+) | aiox shortcuts | P2 | M | J02 |
| J04 | Settings persistence (Zustand persist) | aiox 10 stores | P1 | S | C02 |
| J05 | Loading/empty state patterns | aiox 53 files | P1 | M | — |
| J06 | i18n basico (pt/en) | aiox i18n | P2 | M | — |
| J07 | Onboarding tour | aiox cinematic intro | P2 | M | — |
| J08 | Kanban drag-drop (tasks) | aiox @dnd-kit | P2 | L | — |
| J09 | PWA + offline basics | aiox OfflineManager | P3 | L | — |
| J10 | Export hook (dados para CSV) | aiox useExport | P3 | S | — |

---

## Backlog Completo — Ordenado por Prioridade

### P0 — Critico (bloqueia demo)

| ID | Titulo | Epic | Esforco | Sprint |
|----|--------|------|---------|--------|
| B01 | Remover .env.local + gitignore | Auth | S | 0 |
| B02 | Fix auth bypass com demo mode | Auth | M | 0 |
| B03 | Fix API routes 401 (demo bypass) | Auth | M | 0 |
| D03 | Chat submit funcional (Enter + button) | UX | M | 1 |
| A02+A07 | Chat send BeamHome (Zap + ArrowUp) | Buttons | M | 1 |
| A16+A20 | Chat send AgentChat | Buttons | M | 1 |
| F01 | Setup Vitest | Testing | M | 1 |
| F02 | Setup Playwright config | Testing | S | 1 |

**Total P0:** 8 items

### P1 — Alto (demo Mr. Lion)

| ID | Titulo | Epic | Esforco | Sprint |
|----|--------|------|---------|--------|
| A01 | "Novo agente" → redirect | Buttons | S | 1 |
| A08-12 | Skills chips populate chat | Buttons | S | 1 |
| A13-14 | Chat mode toggle | Buttons | S | 1 |
| A21-23 | Suggestion pills → chat | Buttons | S | 1 |
| A37 | "Salvar alteracoes" → toast | Buttons | S | 2 |
| A39 | "Criar tarefa" flow → dialog | Buttons | M | 2 |
| A55 | Download → toast | Buttons | S | 2 |
| A56 | "Gerar relatorio" → dialog | Buttons | M | 2 |
| A61 | "Responder" inbox → textarea | Buttons | M | 2 |
| A68 | "Criar tarefa" tasks → dialog | Buttons | M | 2 |
| D01 | Fix 3 paginas redirect | UX | M | 2 |
| D02 | Agent Flow conteudo real | UX | M | 2 |
| D04 | Inbox responsivo | UX | S | 2 |
| D14 | Sales Room SSR content | UX | M | 2 |
| E01 | Remover agentic-flow dep | Perf | S | 1 |
| E02 | shadcn → devDependencies | Perf | S | 1 |
| F03 | Smoke test 19 rotas | Testing | M | 1 |
| F04 | E2E chat funciona | Testing | S | 1 |
| F05 | E2E sidebar nav funciona | Testing | S | 1 |
| H01 | Sidebar semantica (nav + a) | A11y | M | 2 |
| H02 | aria-label icon buttons | A11y | M | 2 |
| I01 | Fix CI branch | Infra | S | 1 |
| I10 | Error boundaries per page | Infra | M | 1 |
| J01 | Design tokens (4-tier) | aiox | M | 3 |
| J02 | Command palette Cmd+K | aiox | M | 3 |
| J04 | Settings persistence | aiox | S | 2 |
| J05 | Loading/empty states | aiox | M | 2 |

**Total P1:** 27 items

### P2 — Medio (qualidade producao)

| ID | Titulo | Epic | Esforco | Sprint |
|----|--------|------|---------|--------|
| A24-25 | Photo upload/remove toast | Buttons | S | 3 |
| A27 | Nome completo editable | Buttons | S | 3 |
| A28-31 | Password fields funcionais | Buttons | S | 3 |
| A33-34 | Theme cards toggle | Buttons | S | 3 |
| A35 | Idioma select funcional | Buttons | S | 3 |
| A38 | Flow "Ativo" toggle | Buttons | S | 3 |
| A45-48 | Zoom controls visuais | Buttons | S | 4 |
| A57 | "Ver" card → modal | Buttons | M | 3 |
| A63 | "Configurar" integracao | Buttons | M | 4 |
| A67 | "Adicionar conexao" | Buttons | S | 4 |
| A69 | Toggle view tasks | Buttons | S | 3 |
| B05 | Login page safe sem env | Auth | S | 3 |
| B06 | Security headers next.config | Auth | S | 3 |
| C01 | EquipeContent → store | Data | S | 3 |
| C02 | Settings persist (Zustand) | Data | M | 2 |
| C03 | Unificar data layer | Data | M | 3 |
| C05 | /api/inbox route | Data | S | 3 |
| C06 | /api/tasks route | Data | S | 3 |
| C09 | Wire usePersistSetting | Data | S | 2 |
| D05 | Loading homepage | UX | S | 3 |
| D06 | Agent titulo dinamico | UX | S | 3 |
| D07 | Password validation | UX | M | 3 |
| D08 | Video poster + click play | UX | S | 3 |
| D09 | Sidebar collapse desktop | UX | M | 3 |
| D10 | Tab state persist | UX | M | 4 |
| D13 | H1 em 10 paginas | UX | S | 3 |
| D16 | ROI inputs nativos | UX | M | 4 |
| D17 | Settings toggle data-state | UX | S | 2 |
| E03 | next/image | Perf | S | 4 |
| E04 | Dynamic import Recharts | Perf | M | 4 |
| E05 | SSR guard userAgent | Perf | S | 3 |
| E08 | Clean rebuild | Perf | S | 3 |
| E09 | Code-split 404KB chunks | Perf | M | 4 |
| E10 | Video lazy load | Perf | S | 3 |
| F06 | Unit tests stores | Testing | M | 4 |
| F07 | Unit tests componentes | Testing | L | 5 |
| F08 | Visual regression baseline | Testing | M | 5 |
| G01 | rgba → CSS vars | Design | L | 4 |
| H03 | role= em interativos | A11y | M | 4 |
| H04 | tabIndex coverage | A11y | M | 4 |
| I04 | Meta tags per page | Infra | S | 4 |
| J03 | Keyboard shortcuts | aiox | M | 4 |
| J06 | i18n basico pt/en | aiox | M | 5 |
| J07 | Onboarding tour | aiox | M | 5 |
| J08 | Kanban drag-drop | aiox | L | 5 |

**Total P2:** 45 items

### P3 — Baixo (polish)

| ID | Titulo | Epic | Esforco | Sprint |
|----|--------|------|---------|--------|
| B07 | Remove X-Powered-By | Auth | S | 6 |
| B08 | noopener noreferrer | Auth | S | 6 |
| C04 | DEMO_USER email fix | Data | S | 6 |
| C07 | useSupabaseQuery error | Data | S | 6 |
| C08 | UNREAD_COUNT reativo | Data | S | 6 |
| D11 | 404 page customizada | UX | S | 6 |
| D12 | Loading skeletons World/Sales | UX | S | 6 |
| D15 | Agent ID validation | UX | S | 6 |
| E06 | will-change glass-card | Perf | S | 7 |
| E07 | Font local + fallback | Perf | S | 7 |
| E11 | Refatorar >500 LOC | Perf | M | 7 |
| G02 | Split globals.css | Design | M | 7 |
| G03 | Light theme toggle | Design | S | 6 |
| G04 | Recharts Legend Tailwind | Design | S | 7 |
| G05 | Avaliar @base-ui/react | Design | S | 7 |
| H05 | Emojis → Lucide icons | A11y | S | 7 |
| I02 | tsconfig cleanup | Infra | S | 6 |
| I03 | favicon.ico | Infra | S | 6 |
| I05 | robots.txt + sitemap | Infra | S | 7 |
| I06 | OG + Twitter cards | Infra | S | 7 |
| I07 | Remove getRouteTitle | Infra | S | 6 |
| I08 | Fix SSR bailout | Infra | S | 6 |
| I09 | Fix NEXT_REDIRECT | Infra | S | 6 |
| I11 | Fix font Geist | Infra | S | 7 |
| J09 | PWA + offline basics | aiox | L | 8 |
| J10 | Export hook | aiox | S | 8 |

**Total P3:** 26 items

---

### Totais por Epic

| Epic | Items | P0 | P1 | P2 | P3 |
|------|-------|----|----|----|----|
| A: Dead Buttons | 48 REVIVE + 18 REMOVE + 22 DEFER | 2 | 8 | 14 | 0 |
| B: Auth & Security | 8 | 3 | 1 | 2 | 2 |
| C: Data Layer | 9 | 0 | 0 | 6 | 3 |
| D: UX Polish | 17 | 1 | 4 | 9 | 3 |
| E: Performance | 11 | 0 | 2 | 5 | 3 |
| F: Testing | 8 | 2 | 3 | 3 | 0 |
| G: Design System | 5 | 0 | 0 | 1 | 4 |
| H: Accessibility | 5 | 0 | 2 | 2 | 1 |
| I: Infra & DX | 11 | 0 | 3 | 1 | 7 |
| J: Features aiox | 10 | 0 | 4 | 5 | 2 |
| **TOTAL** | **97** (+ 18 removals + 22 defers) | **8** | **27** | **45** | **26** |

---

# DELIVERABLE 2 — ROADMAP DE SPRINTS

## Premissas

- **Executor:** 1 desenvolvedor + Claude Code agents
- **Sprint:** 1 semana (5 dias uteis, ~40h dev + unlimited AI)
- **Capacidade por sprint:** ~15-25 items S/M ou ~5-8 items L com AI assist
- **Baseline atual:** 24 WORKS (14%), 18/18 paginas renderizam, 0 testes

---

## Sprint 0 — TRIAGE & DECISOES (3 dias)

**Objetivo:** Decidir o que e feature vs decoracao. Sem essa decisao, todo sprint seguinte trabalha sobre areia.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | Categorizar 88 DEAD buttons (tabela acima) | A | — |
| 2 | Remover 18 botoes marcados REMOVE | A | S |
| 3 | Adicionar disabled + tooltip nos 22 DEFER | A | S |
| 4 | Remover .env.local + gitignore | B01 | S |
| 5 | Fix CI branch master → main | I01 | S |

**Criterio de done:** Todos os 88 DEAD categorizados. 18 removidos. 22 desabilitados com tooltip. .env.local fora do repo. CI corrigido.

**Marco:** "O app nao mente mais — botoes mortos foram removidos ou marcados honestamente"

**Risco:** Decisoes de triage podem mudar conforme feedback do Mr. Lion.

---

## Sprint 1 — FUNDACAO (1 semana)

**Objetivo:** O chat funciona, auth nao bloqueia, testes existem.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | Auth bypass com demo mode toggle | B02 | M |
| 2 | Fix API routes 401 (demo bypass) | B03 | M |
| 3 | Chat submit funcional — Enter + button (BeamHome + AgentChat) | D03, A02, A07, A16, A20 | M |
| 4 | Skills chips populate chat input | A08-12 | S |
| 5 | Suggestion pills → chat input | A21-23 | S |
| 6 | Chat mode toggle (Perguntar/Executar) | A13-14 | S |
| 7 | "Novo agente" → redirect /agent-templates | A01 | S |
| 8 | Setup Vitest | F01 | M |
| 9 | Setup Playwright config | F02 | S |
| 10 | Smoke test 19 rotas | F03 | M |
| 11 | E2E: chat funciona | F04 | S |
| 12 | E2E: sidebar nav | F05 | S |
| 13 | Error boundaries per page | I10 | M |
| 14 | Remover agentic-flow dep | E01 | S |
| 15 | shadcn → devDependencies | E02 | S |

**Criterio de done:**
- Chat homepage e agent chat enviam mensagem e recebem resposta fake animada
- 0 erros 401 no console
- Vitest roda, Playwright roda
- 19 rotas testadas em CI
- Error boundary em cada pagina

**Marco:** "24 → 40 WORKS (23%). Chat funciona. Zero 401. Testes existem."

**Risco:** Resposta fake do chat pode parecer artificial. Mitigacao: usar typing animation + delay realista.

---

## Sprint 2 — BOTOES VIVEM (1 semana)

**Objetivo:** Reviver os botoes de acao mais importantes. O usuario clica e algo acontece.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | "Salvar alteracoes" → toast (Account, Agent Settings) | A37, AgentSettings | S |
| 2 | "Criar tarefa" → dialog + toast (Tasks, Flow, AgentTasks) | A39, A68, AgentTasks | M |
| 3 | "Responder" inbox → reply textarea | A61 | M |
| 4 | Download → toast | A55 | S |
| 5 | "Gerar relatorio" → dialog | A56 | M |
| 6 | "Ver todos alertas" → redirect /inbox | HomeContent | S |
| 7 | Fix 3 paginas redirect (conteudo real) | D01 | M |
| 8 | Agent Flow conteudo real | D02 | M |
| 9 | Inbox responsivo (nao fixo 280px) | D04 | S |
| 10 | Sales Room SSR content | D14 | M |
| 11 | Loading/empty state patterns | J05 | M |
| 12 | Settings persistence (Zustand persist) | C02, J04 | S |
| 13 | Wire usePersistSetting | C09 | S |
| 14 | Settings toggle data-state | D17 | S |
| 15 | Sidebar semantica (nav + a) | H01 | M |
| 16 | aria-label icon buttons | H02 | M |
| 17 | "Chat e suporte" sidebar → redirect | AppSidebar | S |

**Criterio de done:**
- Todos botoes P1 REVIVE funcionam
- Settings persistem no refresh
- Sidebar usa HTML semantico
- Paginas redirect mostram conteudo

**Marco:** "40 → 60 WORKS (34%). Acoes principais funcionam. Settings persistem."

**Risco:** Toasts/dialogs podem parecer genéricos. Mitigacao: copiar visual do ConfiguracoesContent (melhor componente).

---

## Sprint 3 — POLIMENTO FUNCIONAL (1 semana)

**Objetivo:** Componentes de settings, account, financeiro ficam completos.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | Photo upload/remove toast | A24-25 | S |
| 2 | Nome completo editable | A27 | S |
| 3 | Password fields funcionais + toggle | A28-31 | S |
| 4 | Theme cards toggle | A33-34 | S |
| 5 | Idioma select | A35 | S |
| 6 | "Ver" card financeiro → modal | A57 | M |
| 7 | Toggle view tasks | A69 | S |
| 8 | Flow "Ativo" toggle | A38 | S |
| 9 | Agent titulo dinamico | D06 | S |
| 10 | Video poster + click play | D08, E10 | S |
| 11 | Sidebar collapse desktop | D09 | M |
| 12 | H1 em 10 paginas | D13 | S |
| 13 | Security headers next.config | B06 | S |
| 14 | Login page safe sem env | B05 | S |
| 15 | EquipeContent → store | C01 | S |
| 16 | Criar /api/inbox e /api/tasks | C05, C06 | S |
| 17 | Unificar data layer | C03 | M |
| 18 | SSR guard userAgent | E05 | S |
| 19 | Clean rebuild | E08 | S |
| 20 | Loading homepage | D05 | S |

**Criterio de done:**
- AccountSettings 100% funcional (de 0% para 100%)
- Financeiro com modals e download
- Sidebar collapse funciona
- H1 em todas paginas
- Build limpo (~200MB)

**Marco:** "60 → 72 WORKS (41%). Settings completo. Financeiro interativo."

**Risco:** Unificar data layer (C03) pode ser maior que estimado. Mitigacao: fazer progressivamente, 3 componentes por vez.

---

## Sprint 4 — INFRA & PERFORMANCE (1 semana)

**Objetivo:** Bundle otimizado, testes unitarios, design tokens comecam.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | Design tokens 4-tier (migrar aiox) | J01 | M |
| 2 | rgba → CSS vars (parcial) | G01 | L (parcial) |
| 3 | Dynamic import Recharts | E04 | M |
| 4 | Code-split 404KB chunks | E09 | M |
| 5 | next/image em imagens | E03 | S |
| 6 | Zoom controls flow | A45-48 | S |
| 7 | "Configurar" integracao | A63 | M |
| 8 | "Adicionar conexao" | A67 | S |
| 9 | Tab state persist | D10 | M |
| 10 | ROI inputs nativos | D16 | M |
| 11 | Unit tests stores | F06 | M |
| 12 | role= em interativos | H03 | M |
| 13 | tabIndex coverage | H04 | M |
| 14 | Meta tags per page | I04 | S |
| 15 | Keyboard shortcuts (10 essenciais) | J03 | M |

**Criterio de done:**
- Bundle JS < 1.5 MB (de 2.7 MB)
- Design tokens funcionando
- ROI calculadora funciona
- Testes unitarios para stores

**Marco:** "72 WORKS mantidos. Bundle -44%. Tokens no lugar. Keyboard nav basica."

**Risco:** Design tokens sao mudanca grande. Mitigacao: comecar com 5 cores core, expandir iterativamente.

---

## Sprint 5 — FEATURES RICAS (1 semana)

**Objetivo:** Paridade com aiox-dashboard nos pontos criticos.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | Command palette Cmd+K | J02 | M |
| 2 | i18n basico pt/en | J06 | M |
| 3 | Onboarding tour | J07 | M |
| 4 | Kanban drag-drop (tasks) | J08 | L |
| 5 | Password validation UX | D07 | M |
| 6 | Unit tests componentes core | F07 | L |
| 7 | Visual regression baseline | F08 | M |

**Criterio de done:**
- Cmd+K funciona em todas paginas
- i18n toggle pt/en
- First-run tour guia o usuario
- Tasks com drag-drop
- 50+ testes unitarios

**Marco:** "Paridade visual e funcional com aiox nos 10 features mais impactantes."

**Risco:** Kanban drag-drop e complexo. Mitigacao: usar @dnd-kit com a mesma API do aiox.

---

## Sprint 6 — CLEANUP (1 semana)

**Objetivo:** Eliminar tech debt, P3 fixes, polimento.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | 404 page customizada | D11 | S |
| 2 | Loading skeletons World/Sales | D12 | S |
| 3 | Agent ID validation | D15 | S |
| 4 | DEMO_USER email fix | C04 | S |
| 5 | useSupabaseQuery error | C07 | S |
| 6 | UNREAD_COUNT reativo | C08 | S |
| 7 | Light theme toggle | G03 | S |
| 8 | tsconfig cleanup | I02 | S |
| 9 | favicon.ico | I03 | S |
| 10 | Remove getRouteTitle | I07 | S |
| 11 | Fix SSR bailout | I08 | S |
| 12 | Fix NEXT_REDIRECT | I09 | S |
| 13 | noopener noreferrer | B08 | S |
| 14 | Remove X-Powered-By | B07 | S |

**Criterio de done:**
- Zero warnings no build
- 404 page customizada
- Light theme acessivel
- Todos P3 fixes aplicados

**Marco:** "Zero tech debt. Build limpo. Ambos temas funcionam."

**Risco:** Baixo — todos items sao S.

---

## Sprint 7 — POLISH (1 semana)

**Objetivo:** Microinteracoes, performance final, CSS limpo.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | will-change glass-card | E06 | S |
| 2 | Font local + fallback | E07 | S |
| 3 | Refatorar >500 LOC (4 arquivos) | E11 | M |
| 4 | Split globals.css | G02 | M |
| 5 | Recharts Legend Tailwind | G04 | S |
| 6 | Avaliar @base-ui/react | G05 | S |
| 7 | Emojis → Lucide icons | H05 | S |
| 8 | robots.txt + sitemap | I05 | S |
| 9 | OG + Twitter cards | I06 | S |
| 10 | Fix font Geist | I11 | S |
| 11 | Animacoes spring physics (Framer Motion) | — | M |
| 12 | Transicoes de pagina suaves | — | M |

**Criterio de done:**
- Animacoes suaves em todas transicoes
- CSS organizado e < 300 LOC por arquivo
- SEO tags em todas paginas
- Performance Lighthouse > 90

**Marco:** "Visual nivel Apple. Animacoes suaves. SEO pronto."

**Risco:** Spring physics pode ser time-consuming. Mitigacao: usar presets do Framer Motion.

---

## Sprint 8 — NIVEL APPLE (1 semana)

**Objetivo:** PWA, offline, testes completos, deploy ready.

| # | Item | Epic | Esforco |
|---|------|------|---------|
| 1 | PWA + offline basics | J09 | L |
| 2 | Export hook (CSV) | J10 | S |
| 3 | Teste de carga (Lighthouse CI) | — | M |
| 4 | A11y audit final (axe-core) | — | M |
| 5 | Security audit final | — | M |
| 6 | Deploy pipeline (Vercel) | — | M |
| 7 | Monitoring basico | — | M |
| 8 | Documentacao usuario | — | M |

**Criterio de done:**
- PWA instalavel
- Lighthouse > 95 em todas categorias
- Zero vulnerabilidades criticas
- Deploy automatico via push
- Documentacao de uso

**Marco:** "Kairus OS nivel Apple. Instalavel como app. Deploy automatico. Auditado."

**Risco:** PWA com Next.js pode ter quirks. Mitigacao: usar next-pwa ou serwist.

---

## Evolucao de Funcionalidade por Sprint

| Sprint | WORKS | % | Testes | Marco |
|--------|-------|---|--------|-------|
| Atual | 24 | 14% | 0 | — |
| 0 (triage) | 24 | 14% | 0 | Botoes mortos resolvidos honestamente |
| 1 (fundacao) | 40 | 25% | 22 | Chat funciona. Zero 401. |
| 2 (botoes) | 60 | 38% | 22 | Acoes principais funcionam |
| 3 (polish) | 72 | 46% | 22 | Settings completo |
| 4 (infra) | 72 | 46% | 35 | Bundle -44%. Tokens. |
| 5 (features) | 72 | 46% | 85 | Cmd+K. i18n. Kanban. |
| 6 (cleanup) | 72 | 46% | 85 | Zero tech debt |
| 7 (polish) | 72 | 46% | 85 | Animacoes. SEO. |
| 8 (Apple) | 72 | 46% | 100+ | PWA. Deploy. Auditado. |

> **Nota:** WORKS maxima e 72 (48 REVIVE + 24 original) porque 18 foram removidos e 22 deferidos.
> Os 60 LOCAL ONLY viram WORKS progressivamente com Zustand persist (sprints 2-4).
> Meta final realista: **~120 WORKS de ~157 elementos** (76% funcional).

---

# DELIVERABLE 3 — DECISOES ARQUITETURAIS

## ADR-001: Next.js vs Vite

**Opcoes:**
1. **Manter Next.js 16** (atual)
2. **Migrar para Vite SPA** (como aiox-dashboard)

**Recomendacao: MANTER NEXT.JS**

| Criterio | Next.js | Vite | Vencedor |
|----------|---------|------|----------|
| SSR/SEO | Built-in | Precisa SSR framework | Next.js |
| API Routes | Colocated | Server separado | Next.js |
| Auth middleware | middleware.ts | Client-side only | Next.js |
| Deploy | Vercel one-click | Docker/VPS | Next.js |
| Bundle size | Maior (RSC overhead) | Menor | Vite |
| Dev HMR | Turbopack (rapido) | Instantaneo | Vite |
| Ecossistema PME | Mais adotado | Mais dev-friendly | Next.js |

**Justificativa:** Kairus e painel de gestao com auth, dados sensiveis e API routes — beneficia-se de SSR e middleware. A migracao custaria 3-4 semanas sem ganho funcional. Os pontos fracos de bundle sao resolvidos com code splitting e dynamic imports (Sprint 4).

---

## ADR-002: O que portar do aiox-dashboard

**Opcoes:**
1. **Portar tudo** (~55K LOC)
2. **Portar seletivamente** (top 15%)
3. **Reescrever do zero**

**Recomendacao: PORTAR SELETIVAMENTE (opcao 2)**

### PORTAR (adaptar para Next.js):

| Feature | Esforco | Sprint | Justificativa |
|---------|---------|--------|---------------|
| Design tokens (4-tier) | M | 4 | Elimina 200+ inline rgba, habilita temas |
| Command palette (Cmd+K) | M | 5 | UX pro, impressiona no demo |
| Keyboard shortcuts | M | 4 | Qualquer app serio tem |
| Settings persistence (Zustand persist) | S | 2 | Settings que sobrevivem reload |
| Loading/empty state patterns | M | 2 | Elimina telas vazias |
| i18n (pt/en) | M | 5 | Escalabilidade |
| Onboarding tour | M | 5 | First-run experience |
| Kanban/drag-drop | L | 5 | Tasks interativas |
| Export hook | S | 8 | Dados para fora |
| Error boundaries per-page | M | 1 | Evita crash total |

### REESCREVER (conceito diferente):

| Feature | Esforco | Justificativa |
|---------|---------|---------------|
| Auth (Supabase SSR) | L | Kairus ja tem client preparado; aiox nao tem auth |
| Chat/streaming | L | Precisa API route Next.js, nao Engine SSE |
| Dashboard widgets | M | Metricas PME ≠ metricas agent platform |

### DESCARTAR (nao faz sentido):

| Feature | Justificativa |
|---------|---------------|
| Engine WebSocket (port 4002) | Kairus nao tem AIOS Engine |
| Authority Matrix | Nao se aplica a PME |
| Handoff Flows | Muito tecnico para dono de PME |
| Terminal view | Irrelevante |
| Agent Directory/Registry | Complexidade desnecessaria |
| Gemini Live voice | Overkill para demo |
| Mock server | Kairus ja tem API routes |
| Presence simulation | Kairus tem useWorldSimulation |

---

## ADR-003: Stack de Testes

**Opcoes:**
1. **Jest** (classico, pesado)
2. **Vitest** (rapido, ESM native)
3. **Vitest + Playwright** (unit + e2e)

**Recomendacao: VITEST + PLAYWRIGHT (opcao 3)**

| Tool | Uso | Config |
|------|-----|--------|
| Vitest | Unit + component tests | @vitejs/plugin-react + jsdom |
| Playwright | E2E + visual regression | Ja instalado (1.59.1) |
| @testing-library/react | Component rendering | Standard React testing |

**Justificativa:** Vitest e 5-10x mais rapido que Jest, suporta ESM nativo (Next.js 16 usa ESM), e compativel com a API do Jest. Playwright ja esta instalado e foi usado nos visual tests (36 screenshots capturados).

**Meta de cobertura:**
- Sprint 1: Smoke tests (19 rotas) + 2 E2E (chat, nav)
- Sprint 4: Stores Zustand (5 stores)
- Sprint 5: 50+ unit tests, 10 E2E
- Sprint 8: Lighthouse CI, visual regression baseline

---

## ADR-004: Estrategia para 88 DEAD Buttons — Triage Framework

**Criterios para decidir REVIVE vs REMOVE:**

| Criterio | REVIVE se... | REMOVE se... |
|----------|-------------|-------------|
| **Proposito** | Usuario espera que funcione (chat send, save) | Proposito unclear (Link2, LayoutGrid) |
| **Backend** | Pode funcionar com toast/dialog/state | Precisa backend complexo inexistente |
| **Demo impact** | Mr. Lion vai clicar nisso | Ninguem nota se sumir |
| **Esforco** | S-M (< 2h com AI) | L-XL e baixo impacto |
| **Honestidade** | Faz algo real (mesmo que simplificado) | Finge funcionalidade que nao existe |

**Patterns de implementacao:**

```typescript
// REVIVE pattern 1: Toast feedback
onClick={() => toast.success("Tarefa criada com sucesso")}

// REVIVE pattern 2: Dialog + toast
onClick={() => setShowDialog(true)}
// Dialog com form → onSubmit → toast

// REVIVE pattern 3: State toggle
onClick={() => setActiveMode(mode === 'ask' ? 'exec' : 'ask')}

// REVIVE pattern 4: Redirect
onClick={() => router.push('/agent-templates')}

// REVIVE pattern 5: Populate input
onClick={() => setChatInput(skill.prompt)}

// DEFER pattern: Disabled + tooltip
<Button disabled title="Em breve">...</Button>

// REMOVE pattern: Delete from JSX entirely
// (commit com mensagem explicando a decisao)
```

---

## ADR-005: Estrategia mock → real data

**Situacao atual:**
- 27 API routes retornam 401 (auth guard sem demo bypass)
- Componentes usam dados hardcoded inline
- Supabase client preparado mas nao conectado
- 4 Zustand stores (parciais), deveria ter 15+

**Estrategia em 3 fases:**

| Fase | Sprint | Acao |
|------|--------|------|
| **1. Demo bypass** | 1 | API routes detectam `DEMO_MODE=true` e retornam mock data do data/ dir |
| **2. Centralizar mocks** | 2-3 | Mover dados hardcoded dos componentes para `src/data/` + stores Zustand |
| **3. Supabase real** | Futuro (pos-demo) | Conectar stores ao Supabase com fallback para mock |

**Demo bypass pattern:**

```typescript
// src/app/api/financial/route.ts
export async function GET(req: Request) {
  if (process.env.DEMO_MODE === 'true') {
    return Response.json({ data: MOCK_FINANCIAL_DATA })
  }
  // auth guard + Supabase fetch
}
```

---

## ADR-006: Auth Strategy

**Opcoes:**
1. **Supabase Auth (SSR)** — ja preparado no codebase
2. **NextAuth.js** — mais popular, mais providers
3. **Custom JWT** — maximo controle

**Recomendacao: SUPABASE AUTH SSR (opcao 1)**

**Justificativa:**
- `@supabase/ssr` ja instalado e configurado
- `createClient()` ja existe em `src/lib/supabase/`
- Supabase tem free tier generoso para PME
- Auth + DB + Storage em um servico = menos complexidade
- middleware.ts ja tem o shell para auth guard

**Plano:**
1. Sprint 0-1: Demo mode bypass (sem auth real)
2. Sprint futuro (pos-demo): Ativar Supabase Auth, criar /auth/callback, proteger rotas

---

## ADR-007: Design System Convergence

**Opcoes:**
1. **Manter CSS atual** (rgba inline, vars basicos)
2. **Importar token system do aiox** (4-tier)
3. **Adotar design system externo** (Radix Themes, Chakra)

**Recomendacao: IMPORTAR TOKENS DO AIOX (opcao 2)**

**Sistema 4-tier do aiox:**

```
Tier 1: Primitives   → --color-blue-500: #3b82f6
Tier 2: Semantic      → --color-primary: var(--color-blue-500)
Tier 3: Component     → --button-bg: var(--color-primary)
Tier 4: Theme         → [data-theme="dark"] { --color-primary: ... }
```

**Plano de migracao:**
1. Sprint 4: Criar `src/styles/tokens.css` com Tier 1+2
2. Sprint 4: Migrar 20 cores mais usadas de rgba → var()
3. Sprint 6: Habilitar light theme via Tier 4
4. Sprint 7: Completar migracao restante

---

## ADR-008: A11y Remediation

**Problemas identificados:**
- Sidebar sem `<nav>` ou `<a>` semanticos (VBUG-002/003)
- H1 ausente em 10 paginas (VBUG-005)
- 0 `aria-label` em icon-only buttons (F9)
- role= em apenas 3 de 40+ componentes (BUG-013)
- tabIndex em 2 componentes (BUG-013)
- Emojis como icones (F48)

**Estrategia:**

| Sprint | Acao | Impacto |
|--------|------|---------|
| 2 | Sidebar `<nav>` + `<a>` + `aria-label` em icons | Screen reader pode navegar |
| 3 | H1 em todas paginas | Heading hierarchy correta |
| 4 | role= e tabIndex em interativos | Keyboard navigation |
| 7 | Emojis → Lucide icons | Consistent e accessible |
| 8 | Audit final axe-core | Verificacao completa |

**Meta:** WCAG 2.1 AA (nao AAA — AAA e overkill para demo PME).

---

## ADR-009: Framework vs Vite (decisao final — consolidada)

Ja coberto em ADR-001. **Decisao final: MANTER NEXT.JS.** Nao revisitar ate que haja evidencia concreta de que Next.js e bloqueio (nao ha).

---

## Resumo de Decisoes

| ADR | Decisao | Confianca |
|-----|---------|-----------|
| ADR-001 | Manter Next.js | Alta (95%) |
| ADR-002 | Portar seletivamente do aiox (top 15%) | Alta (90%) |
| ADR-003 | Vitest + Playwright | Alta (95%) |
| ADR-004 | Triage framework para DEAD buttons | Alta (90%) |
| ADR-005 | Demo bypass → centralizar mocks → Supabase real | Alta (85%) |
| ADR-006 | Supabase Auth SSR | Media-Alta (80%) |
| ADR-007 | Importar tokens 4-tier do aiox | Media (75%) |
| ADR-008 | A11y remediacao progressiva, meta WCAG AA | Alta (90%) |

---

# APENDICE — RASTREABILIDADE

## Mapeamento Fonte → Backlog

| Fonte | IDs Originais | IDs no Backlog |
|-------|--------------|----------------|
| Assessment F1 | .env.local | B01 |
| Assessment F2 | Auth bypass | B02 |
| Assessment F3 | Zero testes | F01, F02 |
| Assessment F4 | CI branch | I01 |
| Assessment F5 | Redirect pages | D01 |
| Assessment F6 | Agent flow redirect | D02 |
| Assessment F7 | Decorative buttons | Epic A inteiro |
| Assessment F8 | Keyboard nav sidebar | H01 |
| Assessment F9 | aria-label | H02 |
| Assessment F10 | Chat textarea | D03, A02 |
| Assessment F11 | Inbox panel 280px | D04 |
| Assessment F12 | agentic-flow dep | E01 |
| Assessment F13 | shadcn dep | E02 |
| Assessment F14-F52 | Demais | Distribuidos em C, D, E, G, H, I |
| Test BUG-001/002 | SSR bailout | I08 |
| Test BUG-003/004 | NEXT_REDIRECT | I09 |
| Test BUG-005 | Sales Room empty | D14 |
| Test BUG-006 | /auth 404 | B04 |
| Test BUG-007 | API 401 | B03 (dedup B02) |
| Test BUG-008 | Agent any ID | D15 |
| Test BUG-009/010/011 | Security headers | B06 |
| Test BUG-012 | Build 1.3GB | E08 |
| Test BUG-013 | Low ARIA | H03, H04 |
| Visual VBUG-001 | 401s console | B03 (dedup) |
| Visual VBUG-002/003 | Sidebar selectors | H01 (dedup) |
| Visual VBUG-004 | 404 inbox/tasks | C05, C06 |
| Visual VBUG-005 | Missing H1 | D13 |
| Visual VBUG-006 | Chat send | D03 (dedup) |
| Visual VBUG-007 | ROI inputs | D16 |
| Visual VBUG-008 | Toggle data-state | D17 |
| Visual VBUG-009 | Font Geist | I11 |
| Button Audit | 88 DEAD | Epic A (48 REVIVE, 18 REMOVE, 22 DEFER) |
| Performance | Bundle/deps | E01-E11 |

## Items Duplicados Eliminados

| Item | Aparece em | Mantido como |
|------|-----------|-------------|
| API 401 | F2, BUG-007, VBUG-001 | B02 + B03 |
| Chat morto | F7, F10, VBUG-006, BTN-audit | D03 + A02 |
| ARIA/keyboard | F8, F9, BUG-013 | H01-H04 |
| Sidebar semantica | VBUG-002, VBUG-003, F8 | H01 |
| Missing H1 | VBUG-005 | D13 |
| 404 inbox/tasks | F27, F28, VBUG-004 | C05, C06 |
| agentic-flow | F12, PERF | E01 |
| Build size | BUG-012, PERF | E08 |
| SSR bailout | BUG-001, BUG-002 | I08 |

---

*Gerado em 2026-04-06 com base em 5 relatorios (228 findings brutos → 97 unicos) + 2 memory refs.*
*Executor: 1 dev + Claude Code agents. Timeline: 8 sprints (~8-10 semanas).*
*Criterio: Primeiro funciona (14% → 76%), depois fica bonito, depois fica perfeito.*
