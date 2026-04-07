# Auditoria UI/UX — Kairus OS Demo

**Data:** 2026-04-06  
**Auditor:** Architect Agent (Opus)  
**Total de issues:** 48 (2 REMOVER, 28 MELHORAR, 18 APERFEICOAR)

---

## Issues Sistemicos (afetam multiplas paginas)

### S-01: Identidade do usuario hardcoded em multiplos componentes [MELHORAR]
- `src/components/HomeContent.tsx:130` — "Luca"
- `src/components/AccountSettingsContent.tsx:24` — "Luca Moreno"
- `src/components/AccountSettingsContent.tsx:49` — "carlos.moreno@kairus.ai"
- `src/components/AppSidebar.tsx:115` — fallback "Luca Moreno"
- **Fix:** Extrair para constante `DEMO_USER` em `src/data/mrlion.ts`, importar em todos.

### S-02: Data hardcoded no Dashboard [MELHORAR]
- `src/components/HomeContent.tsx:134` — "Quarta-feira, 2 de Abril de 2026" estatico enquanto `getGreeting()` e dinamico.
- **Fix:** Gerar data dinamicamente ou marcar como placeholder demo.

### S-03: Padrao de wrapper de pagina inconsistente [APERFEICOAR]
- Maioria usa `<AppHeader>` + `<div className="flex-1 overflow-auto">` mas:
  - `src/app/page.tsx` — BeamHomeContent fullscreen sem AppHeader
  - `src/app/sales-room/page.tsx:9` — SalesRoomPanel standalone
  - `src/app/roadmap/page.tsx:10` — RoadmapView standalone
  - `src/app/world/page.tsx:8-9` — tem AppHeader mas WorldView sem wrapper `flex-1 overflow-auto`
  - `src/app/agent/[id]/flow/page.tsx:8-9` — AgentFlowContent sem wrapper
- **Fix:** World e AgentFlow devem ter wrapper de scroll. Standalone pages (SalesRoom, Roadmap) sao aceitaveis.

### S-04: Headings h1 duplicados [MELHORAR]
- Pages como Financeiro, Marketing, ROI, Equipe renderizam `<AppHeader title="X" />` E tambem `<h1>` dentro dos content components.
- **Fix:** Remover `<h1>` duplicado dos content components ou remover titulo do AppHeader.

### S-05: Border radius inconsistente [APERFEICOAR]
- Mix de `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-[14px]`, `rounded-[10px]`, etc.
- **Fix:** Padronizar: cards = `rounded-xl`, inputs = `rounded-lg`, pills = `rounded-full`, modals = `rounded-2xl`.

---

## Auditoria Por Pagina

### 1. Home (`/`) — BeamHomeContent
- **MELHORAR** L56: Video `/videos/bg-beam-ai.webm` provavelmente inexistente — gera 404.
- **MELHORAR** L142-157: Skills row sem indicador de scroll no mobile.
- **APERFEICOAR** L98: Textarea `min-h-[36px]` — usar auto-resize.
- **MELHORAR** L137: "Cmd+K" hardcoded — detectar OS.
- **APERFEICOAR** L63: "Novo agente" `absolute right-4 top-4` pode sobrepor header.

### 2. Dashboard (`/dashboard`) — HomeContent
- **MELHORAR** L126: Nested scroll containers (`flex-1 overflow-auto` duplicado).
- **APERFEICOAR** L142-175: KPI grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` — 5o card orfao em 2 cols. Adicionar `sm:grid-cols-2`.
- **MELHORAR** L252: Contagem de agents hardcoded sem loading state.

### 3. Financeiro (`/financeiro`) — FinanceiroContent
- **MELHORAR** L108-118: Titulo h1 duplicado (AppHeader ja mostra).
- **APERFEICOAR** L127-141: Date range "6 meses" sempre ativo — sem state change.
- **MELHORAR** L276: `max-w-[130px] truncate` muito estreito para nomes de produtos.
- **APERFEICOAR** L255-298: Tabela sem wrapper de overflow responsivo.

### 4. Marketing (`/marketing`) — MarketingContent
- **MELHORAR** L212: Chart grid `grid-cols-2` sem breakpoint responsivo.
- **MELHORAR** L204: Double border (glass-card `border` + `border-l-4`).
- **APERFEICOAR** L293-326: Tabela de campanhas sem scroll horizontal mobile.
- **MELHORAR** L134: Border rgba inconsistente com Financeiro.

### 5. Sales Room (`/sales-room`) — SalesRoomPanel
- **MELHORAR** L61: `max-md:hidden` esconde agent list no tablet — usar drawer.
- **MELHORAR** L107: Right panel `max-lg:hidden` — em medium screens nenhum panel visivel.
- **MELHORAR** L29: `bg-[#0a0a0a]` duplica body background — usar transparent.
- **APERFEICOAR** L31-55: Header customizado, nao usa AppHeader.

### 6. ROI (`/roi`) — RoiContent
- **APERFEICOAR** L125: `/8` nao e Tailwind opacity valido — usar `/[8%]` ou `/5`.
- **MELHORAR** L83-143: KPI cards `grid-cols-1 md:grid-cols-3` sem `sm:` breakpoint.
- **APERFEICOAR** L98: `roiDados.investimentoTotal` pode crashar se array vazio.

### 7. Equipe (`/equipe`) — EquipeContent
- **APERFEICOAR** L155: Grid responsivo `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — melhor padrao do app.
- **MELHORAR** L114-125: Search input sem width constraint.
- **MELHORAR** L160: `hover:-translate-y-0.5` pode causar layout shift no grid.

### 8. Relatorios (`/relatorios`) — RelatoriosContent
- **MELHORAR** L72: Botao "Gerar relatorio" `bg-white/10` inconsistente com CTA de outras paginas.
- **APERFEICOAR** L157: Gradient text conflita com `text-white` — gradient nao aparece.

### 9. Inbox (`/inbox`) — InboxContent
- **REMOVER** L143-167: Inline `onMouseEnter`/`onMouseLeave` para hover — anti-pattern. Usar Tailwind `hover:`.
- **MELHORAR** L119: Width hardcoded `width: 280` inline — nao responsivo.
- **MELHORAR** L8: `overflow-hidden` correto para split-panel mas sem adaptacao mobile.
- **APERFEICOAR** L58-61: Estado `lidas` inicializado de source errada.

### 10. Agent Templates (`/agent-templates`) — AgentTemplatesContent
- **APERFEICOAR** L286-308: Paginacao bem implementada.
- **MELHORAR** L202-218: Dropdown sem click-outside handler.
- **APERFEICOAR** L244: Hover states com `-translate-y-0.5` — bom.

### 11. Integrations (`/integrations`) — IntegrationsContent
- **MELHORAR** L196-227: Category filter buttons em row flat — wraps mal com muitas categorias.
- **APERFEICOAR** L97-117: Tabs limpas mas underline sem animacao.

### 12. Configuracoes (`/configuracoes`) — ConfiguracoesContent
- **MELHORAR** L418: `max-w-4xl` sem `mx-auto` — conteudo alinhado a esquerda.
- **APERFEICOAR** L428-446: Sidebar navigation bem estruturada.
- **MELHORAR** L302: Botao disabled sem tooltip explicativo.

### 13. Settings (`/settings`) — AccountSettingsContent
- **MELHORAR** L184-188: Save button `fixed bottom-6 left-1/2` — posiciona relativo ao viewport, nao ao content area.
- **MELHORAR** L21: Initials "CM" (Carlos Moreno) mas nome "Luca Moreno" — contradictorio.
- **APERFEICOAR** L87-93: Password strength indicator estatico/decorativo.
- **REMOVER** L49: Email "carlos.moreno@kairus.ai" contradiz "Luca Moreno".

### 14. Roadmap (`/roadmap`) — RoadmapView
- **APERFEICOAR** Bem estruturado com Zustand store.
- **MELHORAR** L57: `space-y-5` vs `space-y-6` das outras paginas.

### 15. Tasks (`/tasks`) — TasksContent
- **APERFEICOAR** L196-281: Tabela bem estruturada.
- **MELHORAR** L157-167: Status filter pills `rounded-full` vs botao "Todos" `rounded-lg`.
- **APERFEICOAR** L199: `<th>` vazio sem aria-label.

### 16. Views (`/views`) — ViewsContent
- **APERFEICOAR** Card layout limpo.
- **MELHORAR** L190-191: Inline hover handlers — usar Tailwind.

### 17. World (`/world`) — WorldView
- **MELHORAR** L8-9: Falta wrapper `flex-1 overflow-auto` no page.tsx.
- **APERFEICOAR** L56-58: Detail panel com marginRight smooth.

### 18. Login (`/login`)
- **APERFEICOAR** Magic link flow bem desenhado.
- **MELHORAR** L37: Container sem max-height — erro longo pode empurrar conteudo.
- **APERFEICOAR** L89: Input com `focus-ring` correto.

### 19-23. Agent Sub-pages (`/agent/[id]/*`)

**Agent Chat:**
- **MELHORAR** L11-26: Inline `<style>` com keyframes — mover para globals.css.
- **MELHORAR** L7: AppHeader badge="% 0" — quebrado.

**Agent Analytics:**
- **APERFEICOAR** L183-199: SVG gauge limpo.
- **MELHORAR** L174: `grid-cols-2` sem breakpoint responsivo.
- **MELHORAR** L209: Expressao inline muito longa para calcular feedback %.

**Agent Flow:**
- **APERFEICOAR** Visual flow builder bem desenhado.
- **MELHORAR** L69-91: Inline `<style>` com keyframes.
- **MELHORAR** L112: `-translate-y-[58%]` magic number.

**Agent Settings:**
- **APERFEICOAR** Tab navigation limpa.
- **MELHORAR** L44-48: `queueMicrotask` para defer setState — code smell.

**Agent Tasks:**
- **APERFEICOAR** Grid-based table layout limpo.
- **MELHORAR** L176: Column widths desktop-only — overflow no mobile.

---

## AppShellClient + Sidebar

### AppShellClient
- **APERFEICOAR** L43: Grid layout `md:grid-cols-[270px_1fr]` correto.
- **MELHORAR** L54: Padding assimetrico — right sempre 16px, left 0 no desktop.
- **MELHORAR** L55: `rounded-2xl border` clipando conteudo nos cantos.

### AppSidebar
- **APERFEICOAR** L24-47: Navigation com active state bem desenhada.
- **MELHORAR** L232-238: "Chat e suporte" usa `<a href="#">` — causa scroll.
- **MELHORAR** L115: Initials computation pode crashar com palavra vazia.

### AppHeader
- **MELHORAR** L63-73: Desktop PanelLeft button sem onClick — confuso.
- **MELHORAR** L87-89: Network e History buttons sem onClick ou aria-labels.

---

## Causa Raiz

Falta de abstracoes compartilhadas: cada pagina compoe `AppHeader + content wrapper` independentemente, levando a inconsistencias em padding, overflow, e headings. Um componente `PageLayout` resolveria a maioria dos issues sistemicos.

## Recomendacoes Prioritarias

1. **Criar componente `PageLayout`** — Baixo esforco, Alto impacto
2. **Remover h1 duplicados dos content components** — Baixo esforco, Medio impacto
3. **Fix save button positioning** — Baixo esforco, Alto impacto
4. **Eliminar inline hover handlers** — Baixo esforco, Medio impacto
5. **Adicionar breakpoints responsivos em tabelas** — Medio esforco, Alto impacto
6. **Consolidar strings hardcoded do usuario** — Baixo esforco, Baixo impacto
7. **Extrair keyframes inline para globals.css** — Baixo esforco, Baixo impacto
8. **Padronizar border-radius tokens** — Medio esforco, Medio impacto

---

**Assessment Geral:** Demo visualmente impressionante com tema dark glassmorphic coeso. Os riscos principais para apresentacao ao cliente sao: (1) save button off-center, (2) tabelas ilegiveis abaixo de 1280px, (3) contradicao Carlos/Luca. Corrigir esses 3 e o demo esta presentation-ready.
