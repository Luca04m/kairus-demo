# Kairus Demo — Inventario Completo de Elementos Interativos

> Data: 2026-04-06 | Auditoria linha-a-linha de 22 componentes (6,290 LOC)

## Resumo

| Status | Count | % |
|--------|-------|---|
| **DEAD** (sem handler) | 88 | 50% |
| **LOCAL ONLY** (reseta no refresh) | 60 | 34% |
| **WORKS** (funciona de verdade) | 24 | 14% |
| **STUB** (desabilitado proposital) | 1 | <1% |
| **Total** | **175** | 100% |

**Metade dos botoes do app nao fazem absolutamente nada.**

---

## Piores Ofensores

| Componente | Dead | Total | Pagina |
|-----------|------|-------|--------|
| AccountSettingsContent | 14 | 14 | /settings — 100% morto |
| BeamHomeContent | 11 | 12 | / — homepage quase toda morta |
| AgentChatContent | 11 | 11 | /agent/[id] — chat 100% morto |
| AgentFlowContent | 11 | 11 | /agent/[id]/flow — 100% morto |
| IntegrationsContent | 8 | 16 | /integrations — metade morta |
| AgentAnalyticsContent | 5 | 5 | /agent/[id]/analytics — 100% morto |

---

## Inventario por Componente

### BeamHomeContent.tsx (homepage) — 12 elementos, 11 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 63 | button | "Novo agente" | DEAD |
| 109 | button | "Perguntar" (Zap) | DEAD |
| 113 | button | ChevronDown dropdown | DEAD |
| 120 | button | Paperclip (attach) | DEAD |
| 123 | button | Link2 | DEAD |
| 126 | button | LayoutGrid | DEAD |
| 129 | button | ArrowUp (send) | DEAD |
| 96-102 | textarea | Chat input | LOCAL ONLY (focus/blur) |
| 148-155 | buttons x5 | Skills chips | DEAD |
| 165-179 | buttons x3 | Agent chips | DEAD |

### AgentChatContent.tsx (chat do agente) — 11 elementos, 11 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 29 | button | "Perguntar" mode | DEAD |
| 33 | button | "Executar" mode | DEAD |
| 45-49 | textarea | Chat input | DEAD |
| 54 | button | "Perguntar" (Zap) | DEAD |
| 58 | button | ChevronDown | DEAD |
| 63 | button | Paperclip | DEAD |
| 66 | button | Settings2 | DEAD |
| 69 | button | ArrowUp (send) | DEAD |
| 83-88 | buttons x3 | Suggestion pills | DEAD |

### AccountSettingsContent.tsx (configuracoes conta) — 14 elementos, 14 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 27-29 | button | "Enviar foto" | DEAD |
| 31-33 | button | Trash (remover foto) | DEAD |
| 48-50 | input | Email (readOnly) | DEAD |
| 62-65 | input | Nome completo | DEAD |
| 78-82 | input | Nova senha | DEAD |
| 83 | button | Eye (toggle senha) | DEAD |
| 99-102 | input | Confirmar senha | DEAD |
| 104 | button | Eye (toggle senha) | DEAD |
| 109 | button | "Atualizar senha" | DEAD |
| 123-133 | div | Dark theme card | DEAD (cursor-pointer sem onClick) |
| 136-143 | div | Light theme card | DEAD (cursor-pointer sem onClick) |
| 158-163 | select | Idioma | DEAD |
| 177 | button | "Excluir conta" | DEAD |
| 186-188 | button | "Salvar alteracoes" | DEAD |

### AgentFlowContent.tsx (flow builder) — 11 elementos, 11 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 76-79 | button | "Ativo" status | DEAD |
| 81 | button | "Criar tarefa" | DEAD |
| 96 | button | Chat trigger | DEAD |
| 103 | button | Webhook trigger | DEAD |
| 110 | button | Agenda trigger | DEAD |
| 116 | button | Plus (add trigger) | DEAD |
| 140 | button | Plus (add step) | DEAD |
| 148-160 | buttons x4 | Zoom controls | DEAD |

### FinanceiroContent.tsx — 14 elementos, 5 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 131 | button | Date range picker | DEAD |
| 137-148 | buttons x3 | Period pills | LOCAL ONLY |
| 151 | button | Download | DEAD |
| 662 | button | "+ Gerar relatorio" | DEAD |
| 670 | buttons x3 | Report filter pills | LOCAL ONLY |
| 676-682 | input | Report search | LOCAL ONLY |
| 726 | button | "Ver" per card | DEAD |
| 753-767 | buttons x3 | Tab switcher | LOCAL ONLY |

### InboxContent.tsx — 11 elementos, 3 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 141-144 | button | Filter (sliders) | DEAD |
| 147-149 | button | Options (more) | DEAD |
| 161-166 | input | Search | LOCAL ONLY |
| 176-188 | buttons x3 | Filter tabs | LOCAL ONLY |
| 207-287 | buttons | Message list items | LOCAL ONLY |
| 358-362 | button | "Responder" | DEAD |
| 364-369 | button | "Marcar como lida" | LOCAL ONLY |
| 371-376 | button | "Arquivar" | LOCAL ONLY |

### IntegrationsContent.tsx — 16 elementos, 8 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 91 | button | "Criar integracao" | DEAD |
| 98-115 | buttons x2 | Tabs | LOCAL ONLY |
| 178 | button | "Configurar" per card | DEAD |
| 182 | button | "Desconectar" per card | DEAD |
| 197 | button | "Categorias" | DEAD |
| 201 | button | "Listagem" | DEAD |
| 206-216 | buttons | Category pills | LOCAL ONLY |
| 220-226 | input | Search | LOCAL ONLY |
| 252 | button | "Adicionar conexao" | DEAD |

### TasksContent.tsx — 8 elementos, 2 DEAD

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 136-138 | button | "Criar tarefa" | DEAD |
| 145-168 | buttons x5 | Status filters | LOCAL ONLY |
| 175-181 | input | Search | LOCAL ONLY |
| 183-186 | button | "Visualizar" | DEAD |

### ConfiguracoesContent.tsx — 17 elementos, 1 DEAD, 1 STUB

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 437-449 | buttons x5 | Tab sidebar | LOCAL ONLY |
| 183-285 | toggles x8 | Todos os toggles | LOCAL ONLY (usePersistSetting NAO wired) |
| 234-238 | select | Autonomia | LOCAL ONLY |
| 256 | select | Idioma | LOCAL ONLY |
| 301-306 | button | "Gerenciar acessos" | STUB (disabled + tooltip) |
| 401 | button | "Gerenciar plano" | DEAD |

### Demais componentes

| Componente | Dead | LOCAL | WORKS |
|-----------|------|-------|-------|
| MarketingContent | 0 | 4 | 0 |
| RelatoriosContent | 3 | 2 | 0 |
| ViewsContent | 3 | 2 | 0 |
| AgentTemplatesContent | 2 | 5 | 0 |
| AgentSettingsContent | 4 | 5 | 0 |
| AgentTasksContent | 3 | 3 | 0 |
| HomeContent | 1 | 0 | 0 |
| RoiContent | 0 | 0 | 0 |
| EquipeContent | 0 | 0 | 0 |

### AppSidebar.tsx — 22 elementos, 19 WORKS

| Status | Count |
|--------|-------|
| WORKS (navegacao) | 19 |
| LOCAL ONLY | 1 |
| DEAD | 2 ("Plano", "Chat e suporte") |

### AppHeader.tsx — 7 elementos, 3 WORKS

| Linha | Elemento | Label | Status |
|-------|----------|-------|--------|
| 50-61 | button | Hamburger mobile | WORKS |
| 64-75 | button | PanelLeft toggle | WORKS |
| 79 | button | History | DEAD |
| 88 | button | Network | DEAD |
| 91 | button | History (alt) | DEAD |
| 103 | button | Search | DEAD |
| 107-112 | button | LogOut | WORKS |

---

## Prioridade de Fix para Demo

### P0 — Corrigir antes de QUALQUER demo

1. **Chat send/input** (BeamHomeContent + AgentChatContent) — ISSO E O PRODUTO. Chat morto numa plataforma AI e deal-breaker. Minimo: animacao de resposta fake.
2. **"Responder"** (InboxContent:358) — usuario leu a mensagem, vai querer responder.
3. **"Criar tarefa"** (TasksContent + AgentTasksContent) — dialog ou toast "Tarefa criada".

### P1 — Corrigir antes do demo Mr. Lion

4. **"Novo agente"** (BeamHomeContent) — redirecionar para /agent-templates
5. **"Criar agente"** nos template cards — mostrar confirmacao/flow
6. **Suggestion pills** (AgentChatContent) — popular o chat input ao clicar
7. **"Salvar"/"Salvar alteracoes"** (AgentSettings, AccountSettings) — toast de sucesso
8. **"Ver completo"** nos reports — abrir modal ou detail view
9. **"+ Gerar relatorio"** — dialog de geracao

### P2 — Nice to have

10. Flow trigger/zoom buttons
11. "Configurar"/"Desconectar" em integracoes
12. Analytics date range/filter pills
13. "Ver todos os alertas" — navegar para inbox
14. Search button no header — abrir command palette
15. Theme selector cards — toggle visual

---

## Observacao Critica

O `ConfiguracoesContent.tsx` e o componente mais bem construido em interatividade — todos os toggles e selects funcionam com local state. Porem o hook `usePersistSetting` (linhas 16-36) cria uma funcao `save()` que **NUNCA E CHAMADA**. Os toggles usam `useState` puro. Nada persiste no refresh.

Este padrao deveria ser replicado (com o save() realmente wired) nos demais componentes.
