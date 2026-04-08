# Auditoria de Design System e Identidade Visual — Kairus OS Demo

**Data:** 2026-04-06
**Auditor:** Designer Agent (claude-opus-4-6)
**Escopo:** Todos os page components, content components, UI components e globals.css
**Classificacao:** REMOVER / MELHORAR / APERFEICOAR

---

## Sumario Executivo

O Kairus OS Demo possui uma base de design system **bem estruturada** em `globals.css` com tokens oklch, glass morphism utilities, spacing scale e typography scale. A identidade visual dark-theme com glassmorphism e a fonte Satoshi esta bem definida. Porem, a **adocao dos tokens nas paginas e inconsistente** — muitos componentes usam valores hardcoded que deveriam referenciar as variaveis CSS. Existem tambem **componentes duplicados**, inconsistencias de border-radius, e o Framer Motion esta subutilizado apesar de estar no stack.

**Score geral: 6.5/10** — Fundacao solida, execucao inconsistente.

---

## 1. Paleta de Cores

### O que esta BEM
- CSS variables oklch bem definidas em `globals.css` (L68-175) para light e dark mode
- Brand colors Kairus (green, blue, purple) definidas como tokens
- Semantic colors (success, danger, warning, info) definidas como tokens
- Chart colors com 5 niveis definidos
- Shadow glow tokens por cor de marca

### MELHORAR — Hex hardcoded em vez de tokens

**Gravidade: Alta** — A maioria dos componentes ignora os tokens CSS e usa hex/rgba diretamente.

| Arquivo | Linha(s) | Problema | Deveria usar |
|---------|----------|----------|--------------|
| `src/components/HomeContent.tsx` | 10-15 | `kpiAccentColor` usa hex (`#22c55e`, `#6366f1`, etc.) | Tokens da paleta de departamento ou `var(--color-success)` etc. |
| `src/components/HomeContent.tsx` | 17-22 | `severidadeCor` usa classes Tailwind nativas (`bg-red-500`, `bg-orange-500`) | `bg-danger`, `bg-warning` dos tokens |
| `src/components/HomeContent.tsx` | 24-28 | `variacaoCor` usa `text-red-400`, `text-green-400` | `text-danger`, `text-success` |
| `src/components/FinanceiroContent.tsx` | 16 | `BRAND = "#6366f1"` hardcoded | `var(--kairus-blue)` ou token |
| `src/components/FinanceiroContent.tsx` | 33-37 | `KPI_ACCENT` usa classes Tailwind nativas (`text-emerald-400`, `text-sky-400`) | Tokens semanticos |
| `src/components/TasksContent.tsx` | 45-49 | `DEPT_COLORS` repete hex identicos aos de HomeContent | Centralizar em `src/data/` ou CSS variables |
| `src/components/TasksContent.tsx` | 55-61 | `StatusIcon` usa hex inline (`text-[#22c55e]`, `text-[#6366f1]`) | Tokens |
| `src/components/RoiContent.tsx` | 164-169 | Gradientes SVG com hex (`#ef4444`, `#22c55e`) | Tokens |
| `src/components/sales-room/ActivityFeed.tsx` | 36,41 | `#D1FF00` — cor unica nao presente em nenhum token | Adicionar ao design system ou remover |
| `src/components/sales-room/ConversationView.tsx` | 192-195 | Hex inline (`#4ade80`, `#fbbf24`, `#f87171`) | Tokens semanticos |
| `src/components/InboxContent.tsx` | 132-136 | `#3b82f6` hardcoded para badges e filtros | Token `--kairus-blue` ou `--color-info` |

### MELHORAR — Cor `#D1FF00` (lime/neon) isolada ao Sales Room

| Arquivo | Linha(s) | Problema |
|---------|----------|----------|
| `src/components/sales-room/AgentRow.tsx` | 67 | `text-[#D1FF00]` para revenue |
| `src/components/sales-room/ActivityFeed.tsx` | 36, 41, 119 | `text-[#D1FF00]` para valores |
| `src/components/sales-room/ConversationView.tsx` | 213 | `text-[#D1FF00]` para revenue |

Esta cor neon lime aparece **exclusivamente** no Sales Room e nao existe como token. Ou adiciona-la como `--kairus-neon` ou substituir por `--kairus-green`.

### APERFEICOAR — Mistura oklch e rgba no dark mode

Em `globals.css` L137-175, o dark mode mistura formatos:
- Algumas vars usam `oklch()` (ex: `--primary`, `--destructive`)
- Outras usam `rgba()` (ex: `--card`, `--secondary`, `--border`)
- Outras usam hex (ex: `--background: #080808`, `--popover: #111111`)

Recomendacao: Unificar em oklch para consistencia.

---

## 2. Tipografia

### O que esta BEM
- Fonte Satoshi (Fontshare) carregada em `layout.tsx` L16 — boa escolha, nao generica
- Typography scale tokens definidos em `globals.css` L184-197 com clamp() responsivo
- Tracking tokens definidos para cada nivel

### MELHORAR — Typography tokens nao sao usados nos componentes

**Gravidade: Alta** — Os tokens `--text-hero`, `--text-h2`, `--text-h3` etc. definidos em `globals.css` L185-191 **nao sao referenciados em nenhum componente**.

| Arquivo | Linha | Estilo usado | Deveria usar |
|---------|-------|-------------|--------------|
| `src/components/HomeContent.tsx` | 129 | `text-xl font-semibold` | `font: var(--text-h2)` |
| `src/components/FinanceiroContent.tsx` | 108 | `text-xl font-semibold` | `font: var(--text-h2)` |
| `src/components/MarketingContent.tsx` | 126 | `text-xl font-semibold` | `font: var(--text-h2)` |
| `src/components/RoiContent.tsx` | 76 | `text-xl font-semibold` | `font: var(--text-h2)` |
| `src/components/EquipeContent.tsx` | 67 | `text-xl font-semibold` | `font: var(--text-h2)` |
| Todos os *Content.tsx | Subtitulos | `text-sm text-[rgba(255,255,255,0.4)]` | `font: var(--text-body-sm)` + `text-muted-foreground` |

### APERFEICOAR — Hierarquia h1/h2/h3 inconsistente

- Page headings usam `<h1>` corretamente em todos os *Content
- `src/components/ui/card.tsx` L51: `CardTitle` renderiza `<h3>` — correto
- `src/components/BeamHomeContent.tsx` L77: Usa `<h3>` com `text-2xl font-bold` para o heading principal — deveria ser `<h1>`
- `src/components/RelatoriosContent.tsx` L157: Usa `<h3>` com `text-sm font-bold` para titulos de cards — correto semanticamente

### MELHORAR — Font weight inconsistente nos headings

- Page headings: `font-semibold` (600) em todos os *Content
- Card titles: `font-medium` (500) no `CardTitle` component
- Mas muitos cards inline usam `font-semibold` (600) diretamente — ex: `EquipeContent.tsx` L192, `IntegrationsContent.tsx` L155
- `RelatoriosContent.tsx` L157 usa `font-bold` (700) para card titles

Recomendacao: Padronizar — page heading = `font-semibold`, card heading = `font-medium`, emphasis = `font-semibold`.

---

## 3. Iconografia (Lucide)

### O que esta BEM
- Lucide React e usado consistentemente em toda a app
- Icons sao importados individualmente (tree-shaking)
- A maioria dos icons usa tamanho coerente por contexto

### MELHORAR — Tamanhos de icones inconsistentes

| Contexto | Tamanhos encontrados | Recomendacao |
|----------|---------------------|--------------|
| Section headers (ao lado de titulos) | 14px (maioria), 16px (Sidebar) | Padronizar 14px |
| Inline com texto xs | 11-13px variando | Padronizar 12px |
| Botoes icon-only no header | 20px | OK |
| Status icons (TasksContent) | 15px | OK |
| Navigation sidebar | 16px (nav), 13px (sub-items) | OK — hierarquia proposital |

| Arquivo | Linha | Problema |
|---------|-------|----------|
| `src/components/FinanceiroContent.tsx` | 171 | KPI icon `size={13}` enquanto Marketing usa `size={14}` L176 |
| `src/components/MarketingContent.tsx` | 134 | Calendar icon sem `size` explicito no date button |
| `src/components/HomeContent.tsx` | 59-61 | `VariacaoIcon` usa `size={12}` — OK mas poderia ser token |

### APERFEICOAR — Alinhamento icone + texto

Na maioria dos locais o alinhamento esta correto via `flex items-center gap-*`. Porem:

| Arquivo | Linha | Problema |
|---------|-------|----------|
| `src/components/RelatoriosContent.tsx` | 14-15 | `tipoIcon` usa `inline-block mr-1 -mt-px` para alinhar — hack manual |
| `src/components/ui/toast.tsx` | 125 | `mt-0.5` no icone do toast — ajuste manual em vez de `items-start` |

---

## 4. Componentes Compartilhados vs Ad-hoc

### REMOVER — Componentes duplicados (LoadingSkeleton vs skeleton)

**Gravidade: Critica**

Existem **dois arquivos de skeleton** com componentes de mesmo nome:

1. `src/components/ui/skeleton.tsx` — Design system oficial com CVA, usa a classe `.skeleton` do globals.css
2. `src/components/ui/LoadingSkeleton.tsx` — Versao ad-hoc com `animate-pulse` e `bg-[rgba(255,255,255,0.06)]`

Ambos exportam `SkeletonCard`, `SkeletonTable`, `SkeletonChart`. Os page components importam de `LoadingSkeleton.tsx`:

| Arquivo | Importa de |
|---------|------------|
| `src/components/HomeContent.tsx` | `LoadingSkeleton` |
| `src/components/FinanceiroContent.tsx` | `LoadingSkeleton` |
| `src/components/MarketingContent.tsx` | `LoadingSkeleton` |
| `src/components/RoiContent.tsx` | `LoadingSkeleton` |
| `src/components/EquipeContent.tsx` | `LoadingSkeleton` |
| `src/components/RelatoriosContent.tsx` | `LoadingSkeleton` |
| `src/components/IntegrationsContent.tsx` | `LoadingSkeleton` |
| `src/components/AgentTemplatesContent.tsx` | `LoadingSkeleton` |

Nenhum componente importa de `skeleton.tsx`. **Remover `skeleton.tsx`** ou migrar tudo para ele e remover `LoadingSkeleton.tsx`.

### REMOVER — ErrorState e EmptyState duplicados

**Gravidade: Alta**

1. `src/components/ui/error-state.tsx` — Versao oficial com props tipadas, usa `<Button>`, icons Lucide
2. `src/components/ui/LoadingSkeleton.tsx` L97-120 — Versao ad-hoc de `ErrorState` no mesmo arquivo dos skeletons
3. `src/components/ui/empty-state.tsx` — Versao oficial com props tipadas
4. `src/components/ui/LoadingSkeleton.tsx` L122-144 — Versao ad-hoc de `EmptyState`

`AgentTemplatesContent.tsx` importa `ErrorState` de `LoadingSkeleton` (L6), nao do componente oficial.

Recomendacao: **Remover as versoes duplicadas de LoadingSkeleton.tsx** e atualizar imports.

### MELHORAR — Inputs ad-hoc em vez de usar `<Input>` component

O componente `src/components/ui/input.tsx` existe com CVA variants, mas **nenhuma pagina o usa**:

| Arquivo | Linha | Usa | Deveria usar |
|---------|-------|-----|-------------|
| `src/components/EquipeContent.tsx` | 119-125 | `<input>` com classes inline | `<Input>` |
| `src/components/RelatoriosContent.tsx` | 101-106 | `<input>` com classes inline | `<Input>` |
| `src/components/InboxContent.tsx` | 179-184 | `<input>` com classes inline | `<Input>` |
| `src/components/TasksContent.tsx` | 174-180 | `<input>` com classes inline | `<Input>` |
| `src/components/ViewsContent.tsx` | 111-116 | `<input>` com classes inline | `<Input>` |
| `src/components/IntegrationsContent.tsx` | 220-225 | `<input>` com classes inline | `<Input>` |
| `src/components/AgentTemplatesContent.tsx` | 223-228 | `<input>` com classes inline | `<Input>` |
| `src/components/AccountSettingsContent.tsx` | 48-50 | `<input>` com classes inline | `<Input>` |
| `src/components/ConfiguracoesContent.tsx` | 75 | `<select>` com classes inline | `<Select>` |
| `src/components/login/page.tsx` | 87-91 | `<input>` com classes inline | `<Input>` |

### MELHORAR — Selects ad-hoc em vez de usar `<Select>` component

`src/components/ui/select.tsx` existe mas nao e usado. Todos os `<select>` na app sao inline.

### MELHORAR — Badges ad-hoc em vez de usar `<Badge>` component

`src/components/ui/badge.tsx` define variants (green, blue, purple, success, danger, warning) mas quase nenhuma pagina o usa:

| Arquivo | Linha | Usa | Deveria usar |
|---------|-------|-----|-------------|
| `src/components/RelatoriosContent.tsx` | 150-153 | `<span>` com classes inline | `<Badge variant="blue">` |
| `src/components/TasksContent.tsx` | 66-76 | `PrioridadeBadge` custom com classes inline | `<Badge variant="danger/warning">` |
| `src/components/IntegrationsContent.tsx` | 160-168 | `<span>` com estilos inline | `<Badge variant="success/warning">` |
| `src/components/EquipeContent.tsx` | 67-69 | `<span>` com classes inline | `<Badge>` |

### MELHORAR — Cards ad-hoc em vez de usar `<Card>` component

`src/components/ui/card.tsx` define variants (default/glass-card, elevated/glass, surface, ghost) com CVA, mas os page components criam cards inline:

| Arquivo | Linha | Usa | Deveria usar |
|---------|-------|-----|-------------|
| `src/components/HomeContent.tsx` | 149 | `glass-card rounded-xl p-4` | `<Card size="sm">` |
| `src/components/HomeContent.tsx` | 180 | `glass-card rounded-xl p-5` | `<Card>` (default) |
| `src/components/FinanceiroContent.tsx` | 168-169 | `glass-card rounded-xl border p-4` | `<Card size="sm">` |
| `src/components/ConfiguracoesContent.tsx` | 144 | `rounded-xl border ... bg-... p-5` sem `glass-card` | `<Card variant="surface">` |
| Todos os *Content.tsx | Multiplas | Repetem `glass-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5` | `<Card>` |

### MELHORAR — Button patterns ad-hoc

Botoes primarios sao implementados ad-hoc em vez de usar `<Button>`:

| Arquivo | Linha | Estilo |
|---------|-------|--------|
| `src/components/TasksContent.tsx` | 136 | `bg-[rgba(255,255,255,0.88)] text-[#080808]` |
| `src/components/ViewsContent.tsx` | 84 | `bg-[rgba(255,255,255,0.88)] text-[#080808]` |
| `src/components/AgentTemplatesContent.tsx` | 187 | `bg-[rgba(255,255,255,0.88)] text-[#080808]` |
| `src/components/AccountSettingsContent.tsx` | 185 | `bg-[rgba(255,255,255,0.92)] text-[#080808]` — nota: opacidade diferente (0.92 vs 0.88) |
| `src/components/login/page.tsx` | 100-103 | `bg-kairus-blue` — cor diferente dos outros CTAs |

Recomendacao: Criar variant `primary-light` no Button ou usar `<Button variant="default">`.

---

## 5. Glass Morphism

### O que esta BEM
- `globals.css` define 5 niveis de glass: `.glass`, `.glass-nav`, `.glass-light`, `.glass-surface`, `.glass-card`
- Cada nivel tem blur, border, box-shadow e shine gradient bem calibrados
- `.glass-card` tem hover state com transicao
- `Card` component em `card.tsx` mapeia variants para as classes glass

### MELHORAR — Glass inconsistente nas paginas

| Arquivo | Linha | Problema |
|---------|-------|----------|
| `src/components/FinanceiroContent.tsx` | 189 | Usa `glass-card` + `border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]` — o bg override conflita com o da classe |
| `src/components/MarketingContent.tsx` | 215 | Usa `rounded-xl border border-... bg-...` **sem** `glass-card` — deveria ter |
| `src/components/MarketingContent.tsx` | 288 | Idem — sem glass |
| `src/components/ConfiguracoesContent.tsx` | 144 | `rounded-xl border ... bg-... p-5` **sem** glass — deveria ser `glass-surface` |
| `src/components/RoiContent.tsx` | 155 | `glass-card` + border duplicado |
| `src/components/InboxContent.tsx` | Inteiro | **Nenhuma** classe glass no componente inteiro — usa apenas `rgba()` inline |

### APERFEICOAR — Sales Room sem glass

O `SalesRoomPanel.tsx` e sub-componentes usam `bg-[#0a0a0a]` e `border-[rgba(255,255,255,0.06)]` sem nenhuma classe glass. Este e um design choice proposital (estilo "terminal") mas destoa do resto da app.

---

## 6. Spacing System

### O que esta BEM
- `globals.css` L55-65 define spacing tokens de 4px a 96px
- A maioria dos componentes usa escala Tailwind padrao (p-4, p-5, p-6, gap-2, gap-3, etc.)

### MELHORAR — Padding de pagina inconsistente

| Arquivo | Padding | Deveria ser |
|---------|---------|-------------|
| `src/components/HomeContent.tsx` | `p-6 space-y-6` | p-6 — OK |
| `src/components/FinanceiroContent.tsx` | `p-6 space-y-6` | OK |
| `src/components/MarketingContent.tsx` | `p-6 space-y-6` | OK |
| `src/components/RoiContent.tsx` | `p-6 space-y-6` | OK |
| `src/components/EquipeContent.tsx` | `p-6` (sem space-y) | Adicionar `space-y-6` |
| `src/components/RelatoriosContent.tsx` | `p-6` (sem space-y) | Adicionar `space-y-6` |
| `src/components/InboxContent.tsx` | Sem padding (full-bleed) | Correto — layout especial |
| `src/components/TasksContent.tsx` | `p-6` (sem space-y) | Adicionar `space-y-6` |
| `src/components/ViewsContent.tsx` | `p-6` (sem space-y) | Adicionar `space-y-6` |
| `src/components/ConfiguracoesContent.tsx` | `p-6 max-w-4xl` | OK |
| `src/components/AccountSettingsContent.tsx` | `p-6 max-w-2xl` | OK |

### APERFEICOAR — Gap entre secoes inconsistente

- `mb-6` para header sections — consistente na maioria
- `mb-5` em alguns lugares (TasksContent L187, IntegrationsContent L97) — deveria ser `mb-6`
- `gap-4` vs `gap-3` nos KPI grids (FinanceiroContent usa `gap-3`, HomeContent usa `gap-4`)

---

## 7. Cards/Containers

### O que esta BEM
- `card.tsx` define radius via CVA: sm=rounded-xl, default=rounded-2xl, lg=rounded-3xl
- Glass card hover state e consistente via CSS class

### MELHORAR — Border-radius inconsistente

| Pattern | Onde usado | Frequencia |
|---------|-----------|-----------|
| `rounded-xl` | KPI cards, table containers, modals | ~70% |
| `rounded-2xl` | Card component default, login page, main container | ~20% |
| `rounded-lg` | Buttons, inputs, badges, filter pills | ~10% |
| `rounded-[10px]` | Sidebar nav items | Sidebar only |
| `rounded-[14px]` | BeamHome chat input, skill pills | BeamHome only |
| `rounded-[16px]` | AgentChat input | Agent only |

A maioria dos content cards usa `rounded-xl` diretamente em vez de ir pelo `<Card>` component que defaults to `rounded-2xl`. Isso cria uma inconsistencia visual.

### MELHORAR — Padding de cards inconsistente

| Arquivo | Card padding |
|---------|-------------|
| HomeContent KPI cards | `p-4` |
| HomeContent section cards | `p-5` |
| FinanceiroContent KPI cards | `p-4` |
| FinanceiroContent chart cards | `p-5` |
| RoiContent hero cards | `p-6` |
| RoiContent detail cards | `p-5` |
| EquipeContent agent cards | `p-4` |
| IntegrationsContent cards | `p-5` (connected) / `p-4` (available) |

Recomendacao: Padronizar — KPI/small = `p-4`, standard = `p-5`, hero/featured = `p-6`. Ou usar `<Card size="sm|default|lg">`.

---

## 8. Animacoes (Framer Motion)

### MELHORAR — Framer Motion subutilizado

**Gravidade: Media** — Framer Motion esta no `package.json` mas e usado em **apenas 2 arquivos**:

1. `src/components/sales-room/ConversationView.tsx`
2. `src/components/sales-room/ActivityFeed.tsx`

Todas as outras animacoes usam CSS puro:
- `animate-fade-in-up` (CSS keyframe)
- `animate-pulse` (Tailwind)
- `animate-spin` (Tailwind)
- `animate-ping` (Tailwind)
- `transition-all duration-200` (CSS transitions)
- `pulseSoft` (CSS keyframe)

### MELHORAR — Oportunidades de animacao nao exploradas

| Local | Animacao atual | Poderia ter |
|-------|---------------|-------------|
| Page transitions | Nenhuma | Framer `AnimatePresence` + fade/slide |
| Card hover (EquipeContent) | `hover:-translate-y-0.5` via Tailwind | Framer `whileHover` com spring |
| KPI cards load | Nenhuma | Framer stagger reveal |
| Skeleton -> content | Corte abrupto (ternary) | Framer `AnimatePresence` fade |
| Inbox message select | Nenhuma visual | Framer layout animation |
| Sidebar mobile | CSS `transition-transform` | OK — CSS e adequado aqui |
| Filter pills active state | `transition-colors` | OK |

### O que esta BEM
- `globals.css` define motion tokens (spring-gentle/snappy/bouncy, duration-micro/fast/normal)
- `@media (prefers-reduced-motion: reduce)` implementado corretamente
- CSS animations definidas (fade-in-up, pulse-ring, shimmer, pulseSoft, glowPulse) — bom repertorio

---

## 9. Dark Theme

### O que esta BEM
- App renderiza exclusivamente em dark mode (`<html className="dark">` hardcoded)
- Background `#080808` e escuro o suficiente
- Text hierarchy: white (headings), white/80 (body), white/50-60 (secondary), white/35-40 (muted), white/25 (ghost)
- Glass card borders em white/8 sao sutis e nao intrusivos

### MELHORAR — Contraste baixo em alguns elementos

| Arquivo | Linha | Elemento | Cor | Contraste |
|---------|-------|---------|-----|-----------|
| Todos os *Content | Subtitulos | `text-[rgba(255,255,255,0.4)]` | 40% branco em #080808 | ~3.2:1 — **falha WCAG AA** para texto normal |
| HomeContent | 167 | Periodo `text-[10px] text-[rgba(255,255,255,0.3)]` | 30% branco, 10px | **Muito baixo** — illegible |
| HomeContent | 202 | Tempo atividade `text-[rgba(255,255,255,0.35)]` | 35% branco | Limiar inferior |
| RelatoriosContent | 170 | Data criacao `text-[10px] text-[rgba(255,255,255,0.25)]` | 25% branco, 10px | **Critico** — quase invisivel |
| SalesRoomPanel | 123-130 | Footer text `text-[9px] text-[rgba(255,255,255,0.25)]` | 25% branco, 9px | **Critico** |
| AgentRow (sales-room) | Multiplas | `text-[9px]` em varios locais | Muito pequeno | Considerar 10px minimo |

### APERFEICOAR — Light mode nao implementado

O design system define tokens `:root` (light) em `globals.css` L68-101, mas o app forca dark mode. `AccountSettingsContent.tsx` mostra um selector de tema "Escuro/Claro" (L118-145) mas o toggle e apenas visual — nao funciona. Isso e aceitavel para demo, mas o selector nao deveria aparecer se nao funciona, ou ter um tooltip "Em breve".

---

## 10. Padroes Reutilizaveis vs Duplicados

### REMOVER — Padroes duplicados que devem ser extraidos

#### 10.1 Search Bar Component

O seguinte pattern se repete em **8+ arquivos**:
```
<div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5">
  <Search size={14} className="text-[rgba(255,255,255,0.4)]" />
  <input className="bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.4)] outline-none w-48" placeholder="..." />
</div>
```

**Arquivos:** TasksContent L173-180, IntegrationsContent L218-225, AgentTemplatesContent L222-228, ViewsContent L110-116, EquipeContent L114-125, RelatoriosContent L98-106, InboxContent L176-184

Recomendacao: Extrair para `<SearchInput>` component em `src/components/ui/search-input.tsx`.

#### 10.2 Filter Pill Button

Pattern repetido em 6+ arquivos:
```
<button className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
  active ? "bg-[rgba(255,255,255,0.10)] text-white" : "text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)]"
}`}>
```

**Arquivos:** EquipeContent, RelatoriosContent, TasksContent, ViewsContent, IntegrationsContent

Recomendacao: Extrair para `<FilterPill>` component.

#### 10.3 Page Header Pattern

Pattern repetido em todos os *Content:
```
<div>
  <h1 className="text-xl font-semibold text-white mb-1">Titulo</h1>
  <p className="text-sm text-[rgba(255,255,255,0.4)]">Descricao</p>
</div>
```

Variantes: com botao de acao (TasksContent, ViewsContent, RelatoriosContent, IntegrationsContent, AgentTemplatesContent)

Recomendacao: Extrair para `<PageHeader title="" description="" action={<Button>}>` component.

#### 10.4 Date Range Control

Pattern em FinanceiroContent L121-153 e MarketingContent L133-155 — quase identico.

Recomendacao: Extrair para `<DateRangeToolbar>`.

#### 10.5 Agent Avatar Circle

Pattern em HomeContent, EquipeContent, TasksContent, InboxContent, RelatoriosContent:
```
<span className="flex h-N w-N items-center justify-center rounded-full text-[Xpx] font-semibold text-white"
  style={{ backgroundColor: `${cor}33`, border: `1px solid ${cor}55` }}>
  {iniciais}
</span>
```

Tamanhos variam (h-6/h-7/h-9/h-10), mas o pattern e o mesmo.

Recomendacao: Extrair para `<AgentAvatar name="" color="" size="sm|md|lg">`.

#### 10.6 Department Color Map

O mapeamento departamento -> cor aparece em:
- `src/components/HomeContent.tsx` L9-15 (`kpiAccentColor`)
- `src/components/TasksContent.tsx` L44-50 (`DEPT_COLORS`)
- `src/data/mrlion.ts` (provavelmente — dados de departamentos com `cor` field)

Recomendacao: Centralizar em `src/data/mrlion.ts` e exportar como constante unica.

### MELHORAR — InboxContent usa `onMouseEnter/onMouseLeave` inline

**Gravidade: Baixa** — `src/components/InboxContent.tsx` L144-165, 383-406 usa event handlers inline para hover effects em vez de classes CSS `hover:*`. Isso e um anti-pattern em React/Tailwind.

---

## 11. Problemas Adicionais

### MELHORAR — Tooltip hardcoded

`src/components/FinanceiroContent.tsx` L150-152 — tooltip implementado via CSS `opacity-0 group-hover:opacity-100`. Funciona mas nao e acessivel (sem role tooltip, sem aria). Se tooltips forem necessarios em mais locais, usar uma lib (Radix tooltip).

### MELHORAR — BeamHomeContent heading semantico

`src/components/BeamHomeContent.tsx` L77: O heading principal da home usa `<h3>` — deveria ser `<h1>` semanticamente ja que e a pagina root.

### APERFEICOAR — Stagger delay utilities nao usados

`globals.css` L418-422 define `.delay-100` ate `.delay-500` mas nenhum componente os usa. Ou remover ou implementar nos card grids.

### APERFEICOAR — Custom properties de motion nao usados

`globals.css` L129-134 define `--spring-gentle`, `--spring-snappy`, `--spring-bouncy` e `--duration-*` mas nenhum componente os referencia. Estes deveriam ser usados nos Framer Motion spring configs.

---

## Resumo de Prioridades

### REMOVER (critico — limpar imediatamente)
1. Componentes duplicados: `LoadingSkeleton.tsx` exporta `ErrorState`, `EmptyState`, `SkeletonCard`, `SkeletonTable` que conflitam com `skeleton.tsx`, `error-state.tsx`, `empty-state.tsx`

### MELHORAR (alta prioridade)
2. Hex/rgba hardcoded em vez de CSS tokens — 10+ arquivos
3. Typography tokens definidos mas nao usados — todos os *Content
4. `<Input>`, `<Select>`, `<Badge>`, `<Card>`, `<Button>` components existem mas nao sao adotados
5. SearchBar pattern duplicado em 8+ arquivos — extrair component
6. Contraste WCAG falha em textos de 30-40% opacidade

### APERFEICOAR (nice-to-have)
7. Framer Motion subutilizado (apenas 2 arquivos de 20+)
8. Page header, filter pill, agent avatar, date range — extrair components
9. Unificar formato de cor (oklch vs rgba vs hex) no dark mode
10. Corrigir heading semantico em BeamHomeContent (`h3` -> `h1`)
11. Implementar stagger delays e motion tokens nos componentes
12. Remover ou implementar o selector de tema claro/escuro

---

## Metricas de Consistencia

| Aspecto | Score | Nota |
|---------|-------|------|
| Color tokens | 4/10 | Definidos mas nao adotados |
| Typography tokens | 3/10 | Definidos mas nao adotados |
| Glass morphism | 7/10 | Usado na maioria, falta em Marketing charts e Inbox |
| Spacing | 7/10 | Escala Tailwind consistente, padding de pagina quase uniforme |
| Component adoption (shadcn) | 2/10 | Components existem mas sao ignorados |
| Iconography | 8/10 | Consistente com pequenas variacoes de tamanho |
| Dark theme | 7/10 | Bom no geral, problemas de contraste em textos sutis |
| Animations | 4/10 | CSS utilities boas, Framer Motion desperdicado |
| Border-radius | 6/10 | Maioria rounded-xl, algumas variacoes desnecessarias |
| Reusability | 3/10 | Muita duplicacao, componentes compartilhados existem mas nao sao usados |

**Score medio: 5.1/10**

A arquitetura de design system esta **bem fundada** (globals.css e ui/ components sao solidos), mas a **adocao** nos page components e deficiente. O trabalho principal e migrar os componentes de pagina para usar os shared components e tokens existentes, nao criar novos.
