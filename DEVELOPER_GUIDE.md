# Beam AI Clone — Developer Guide

Manual completo para entender, editar e estender qualquer parte do clone.

---

## Índice

1. [Visão geral da arquitetura](#1-visão-geral-da-arquitetura)
2. [Stack e dependências](#2-stack-e-dependências)
3. [Estrutura de arquivos](#3-estrutura-de-arquivos)
4. [Design tokens — globals.css](#4-design-tokens--globalscss)
5. [Componentes compartilhados](#5-componentes-compartilhados)
   - [AppSidebar](#appsidebar)
   - [AppHeader](#appheader)
6. [Padrão de layout por página](#6-padrão-de-layout-por-página)
7. [Todas as rotas e seus arquivos](#7-todas-as-rotas-e-seus-arquivos)
8. [Como editar cada tela](#8-como-editar-cada-tela)
   - [Home](#home)
   - [Inbox](#inbox)
   - [Tasks](#tasks)
   - [Agent Templates](#agent-templates)
   - [Integrations](#integrations)
   - [Views](#views)
   - [Agent Chat](#agent-chat)
   - [Agent Tasks](#agent-tasks)
   - [Agent Flow](#agent-flow)
   - [Agent Settings (Configuration)](#agent-settings-configuration)
   - [Agent Analytics](#agent-analytics)
   - [Account Settings](#account-settings)
9. [Como adicionar uma nova rota](#9-como-adicionar-uma-nova-rota)
10. [Como adicionar um agente novo na sidebar](#10-como-adicionar-um-agente-novo-na-sidebar)
11. [Paleta de cores de referência](#11-paleta-de-cores-de-referência)
12. [Classes utilitárias globais](#12-classes-utilitárias-globais)
13. [Ícones disponíveis](#13-ícones-disponíveis)
14. [Comandos de desenvolvimento](#14-comandos-de-desenvolvimento)

---

## 1. Visão geral da arquitetura

O projeto é um **Next.js 16 App Router** com todos os dados estáticos (nenhuma API real). A estrutura é simples:

```
Toda página = AppSidebar (esquerda) + coluna direita (AppHeader + conteúdo)
```

O **AppSidebar** é compartilhado entre todas as páginas. Ele usa `usePathname()` para detectar a rota ativa e destacar o item correto automaticamente.

Cada tela tem:
- Um `page.tsx` — monta o layout e importa o componente de conteúdo
- Um `*Content.tsx` — contém o HTML/JSX real da tela

Essa separação permite editar o visual de uma tela sem tocar no roteamento, e vice-versa.

---

## 2. Stack e dependências

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16 (App Router) | Framework, roteamento |
| React | 19 | UI |
| TypeScript | strict | Tipagem |
| Tailwind CSS | v4 | Estilos (utility classes) |
| lucide-react | latest | Ícones |
| Satoshi (Google Fonts) | — | Fonte principal |

**Não há** React Query, Redux, Zustand, Prisma, autenticação, ou qualquer lib de charts real.

---

## 3. Estrutura de arquivos

```
src/
├── app/
│   ├── layout.tsx                        ← HTML root, fonte, metadata global
│   ├── globals.css                       ← TODOS os design tokens e utilitários
│   ├── page.tsx                          ← Rota: /  (Home)
│   ├── inbox/
│   │   └── page.tsx                      ← Rota: /inbox
│   ├── tasks/
│   │   └── page.tsx                      ← Rota: /tasks
│   ├── agent-templates/
│   │   └── page.tsx                      ← Rota: /agent-templates
│   ├── integrations/
│   │   └── page.tsx                      ← Rota: /integrations
│   ├── views/
│   │   └── page.tsx                      ← Rota: /views
│   ├── settings/
│   │   └── page.tsx                      ← Rota: /settings (Account Settings)
│   └── agent/
│       └── [id]/
│           ├── layout.tsx                ← Layout compartilhado para sub-rotas do agente
│           ├── page.tsx                  ← Rota: /agent/[id]  (Chat)
│           ├── tasks/
│           │   └── page.tsx              ← Rota: /agent/[id]/tasks
│           ├── flow/
│           │   └── page.tsx              ← Rota: /agent/[id]/flow
│           ├── settings/
│           │   └── page.tsx              ← Rota: /agent/[id]/settings
│           └── analytics/
│               └── page.tsx              ← Rota: /agent/[id]/analytics
│
├── components/
│   ├── AppSidebar.tsx                    ← Sidebar global (client component)
│   ├── AppHeader.tsx                     ← Header global (server component)
│   ├── HomeContent.tsx                   ← Conteúdo da Home
│   ├── InboxContent.tsx
│   ├── TasksContent.tsx
│   ├── AgentTemplatesContent.tsx
│   ├── IntegrationsContent.tsx
│   ├── ViewsContent.tsx
│   ├── AgentChatContent.tsx
│   ├── AgentTasksContent.tsx
│   ├── AgentFlowContent.tsx
│   ├── AgentSettingsContent.tsx
│   ├── AgentAnalyticsContent.tsx
│   ├── AccountSettingsContent.tsx
│   ├── ui/                               ← Primitivos shadcn/ui
│   └── ds/                               ← Design system interno (showcase)
│
├── lib/
│   ├── utils.ts                          ← Função cn() para merge de classes
│   └── motion.ts                         ← Variantes de animação Framer Motion
│
└── data/
    └── ds-data.ts                        ← Dados do design system showcase
```

---

## 4. Design tokens — globals.css

**Arquivo:** `src/app/globals.css`

Este é o **único lugar** onde cores, tipografia e espaçamento são definidos. Nunca use valores hexadecimais soltos no JSX sem antes verificar se já existe um token.

### Filosofia da paleta atual

**Kairus dark mode = preto profundo + branco puro + hierarquia de opacidade. Zero cromatismo nas superfícies.**

Onde há degradê, o degradê é preto→transparente ou branco→transparente. O que é neutro fica neutro.

### Cores principais (usadas inline nas classes Tailwind)

```
Fundos
  #080808                    Fundo principal da app (quase preto, ligeiramente acima do puro)
  rgba(255,255,255,0.04)     Card/main content area (elevação mínima)
  rgba(255,255,255,0.06)     Hover de itens de nav
  rgba(255,255,255,0.08)     Item de nav ativo / bordas / inputs

Bordas
  rgba(255,255,255,0.08)     Borda padrão (todos os elementos)
  rgba(255,255,255,0.10)     Borda levemente mais visível

Texto
  white / rgba(255,255,255,0.92)   Texto primário
  rgba(255,255,255,0.4)            Texto secundário / labels / placeholders / ícones inativos

Ações (botão primário)
  rgba(255,255,255,0.88)     Background do botão primário (branco quase opaco)
  rgba(255,255,255,0.75)     Hover do botão primário
  #080808                    Texto sobre botão primário (escuro sobre fundo claro)

Avatares / indicadores
  rgba(255,255,255,0.08)     Background de avatares (iniciais UA, etc.)
  rgba(255,255,255,0.12)     Background do avatar do usuário (LM)
```

### Tokens CSS (bloco `.dark` em globals.css)

```css
.dark {
  --background: #080808;
  --foreground: rgba(255, 255, 255, 0.92);
  --card: rgba(255, 255, 255, 0.055);
  --card-foreground: rgba(255, 255, 255, 0.92);
  --popover: #111111;
  --popover-foreground: rgba(255, 255, 255, 0.92);
  --secondary: rgba(255, 255, 255, 0.07);
  --secondary-foreground: rgba(255, 255, 255, 0.9);
  --muted: rgba(255, 255, 255, 0.04);
  --muted-foreground: rgba(255, 255, 255, 0.4);
  --accent: rgba(255, 255, 255, 0.88);
  --accent-foreground: rgba(255, 255, 255, 0.92);
  --border: rgba(255, 255, 255, 0.08);
  --input: rgba(255, 255, 255, 0.09);
  --ring: rgba(255, 255, 255, 0.35);
}
```

### Exceções — cores que NÃO são neutras

```
--color-danger    → vermelho (alertas críticos) — MANTER
--color-warning   → amarelo/amber — MANTER
--color-success   → verde — MANTER
--color-info      → azul info — MANTER
--kairus-purple   → #AB53FF token — MANTER (não usar em surfaces)
--kairus-blue     → #4A9EFF token — MANTER (não usar em surfaces)
```

### Como mudar uma cor globalmente

Edite o bloco `.dark` em `src/app/globals.css`. O `<html>` tem classe `dark` permanente (definida em `layout.tsx`), então apenas o bloco `.dark` está ativo.

### Regra absoluta ao editar cores

- **PERMITIDO:** valores de `color`, `background`, `border-color`, `box-shadow` (só as cores), CSS custom properties de cor, `fill`/`stroke` de SVGs
- **PROIBIDO:** `padding`, `margin`, `font-size`, `border-radius`, `width`, `height`, layout, `transition`, `animation`, estrutura JSX/TSX

### Utilitários globais de CSS

| Classe | Efeito |
|---|---|
| `.glass` | Glassmorphism premium com blur 40px |
| `.glass-card` | Card com glassmorphism leve + hover |
| `.glass-light` | Surface translúcida mais clara |
| `.glass-nav` | Fundo de navegação glass |
| `.gradient-text` | Texto com gradiente branco → transparente |
| `.dot-grid` | Background com padrão de pontos |
| `.kairus-gradient` | Gradiente rainbow de brand |

---

## 5. Componentes compartilhados

### AppSidebar

**Arquivo:** `src/components/AppSidebar.tsx`
**Tipo:** Client Component (`"use client"`)

#### Props
Nenhuma. O componente lê `usePathname()` internamente.

#### Como funciona o estado ativo

```tsx
const pathname = usePathname();
const isAgentRoute = pathname.startsWith("/agent/");

// Item ativo  = fundo rgba(255,255,255,0.08) + texto branco
// Item inativo = texto rgba(255,255,255,0.4) + hover rgba(255,255,255,0.06)
```

A função `navItem(href, children)` calcula o estado ativo automaticamente:
- Para `/` (home): só ativa quando `pathname === "/"`
- Para qualquer outra rota: ativa quando `pathname.startsWith(href)`

#### Como mudar o nome do workspace

```tsx
// Linha ~26
<span>Luca</span>   ← altere aqui
```

#### Como mudar o agente fixo na sidebar

O ID do agente está numa constante no topo do arquivo:

```tsx
const AGENT_ID = "demo-agent";   // ← altere para o ID real
```

Todos os links do sub-nav do agente (`/agent/${AGENT_ID}/tasks`, etc.) são gerados a partir dessa constante.

#### Como adicionar um item de nav principal

Dentro do bloco `{/* Nav items */}`, adicione:

```tsx
{navItem("/nova-rota", <><IconeAqui size={16} />Nome do item</>)}
```

#### Como adicionar um sub-item ao agente

Dentro do bloco `{isAgentRoute && (...)}`, adicione:

```tsx
{subItem(`/agent/${AGENT_ID}/nova-sub-rota`, <><Icone size={13} />Nome</>)}
```

---

### AppHeader

**Arquivo:** `src/components/AppHeader.tsx`
**Tipo:** Server Component (sem estado)

#### Props

```tsx
interface AppHeaderProps {
  title?: string;    // Texto principal. Default: "Home"
  parent?: string;   // Se definido, renderiza breadcrumb: parent > title
  badge?: string;    // Texto pequeno no canto direito (ex: "% 0")
}
```

#### Exemplos de uso

```tsx
// Página simples
<AppHeader title="Inbox" />

// Sub-página de agente com breadcrumb
<AppHeader title="Analytics" parent="Untitled agent" badge="% 0" />

// Home (sem props = comportamento padrão)
<AppHeader />
```

#### Como mudar os ícones do header

Os ícones são `PanelLeft`, `Network`, `History` (importados de `lucide-react`). Para substituir, edite diretamente o JSX no `AppHeader.tsx`.

---

## 6. Padrão de layout por página

Existem **dois padrões** de layout no projeto:

### Padrão A — Home (com card arredondado)

Usado apenas em `src/app/page.tsx`:

```tsx
<div className="h-screen bg-background" style={{ backgroundImage: "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%)" }}>
  <div className="h-full w-full grid" style={{ gridTemplateColumns: "270px 1fr" }}>
    <AppSidebar />
    <div className="flex h-full flex-col overflow-hidden px-4 pb-4 md:pl-0">
      <main className="mt-4 flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
        <AppHeader />
        <HomeContent />
      </main>
    </div>
  </div>
</div>
```

### Padrão B — Todas as outras páginas (flat panel)

```tsx
<div className="h-screen bg-background">
  <div className="h-full w-full grid" style={{ gridTemplateColumns: "270px 1fr" }}>
    <AppSidebar />
    <div className="flex h-full flex-col overflow-hidden border-l border-[rgba(255,255,255,0.08)]">
      <AppHeader title="Nome da Página" />
      <div className="flex-1 overflow-auto">
        <NomeContent />
      </div>
    </div>
  </div>
</div>
```

### Padrão C — Sub-rotas de agente (usam layout compartilhado)

As páginas em `/agent/[id]/*` **não** declaram o wrapper de layout — ele vem de `src/app/agent/[id]/layout.tsx`:

```tsx
// layout.tsx já inclui AppSidebar + wrapper
// Cada page.tsx dentro de agent/[id]/ retorna apenas:
<>
  <AppHeader title="Flow" parent="Untitled agent" badge="% 0" />
  <div className="flex-1 overflow-auto">   {/* ou overflow-hidden para canvas */}
    <AgentFlowContent />
  </div>
</>
```

> **Atenção:** Para telas com canvas/flow (sem scroll), use `overflow-hidden`. Para telas com conteúdo scrollável, use `overflow-auto`.

---

## 7. Todas as rotas e seus arquivos

| URL | page.tsx | Content component |
|---|---|---|
| `/` | `src/app/page.tsx` | `HomeContent.tsx` |
| `/inbox` | `src/app/inbox/page.tsx` | `InboxContent.tsx` |
| `/tasks` | `src/app/tasks/page.tsx` | `TasksContent.tsx` |
| `/agent-templates` | `src/app/agent-templates/page.tsx` | `AgentTemplatesContent.tsx` |
| `/integrations` | `src/app/integrations/page.tsx` | `IntegrationsContent.tsx` |
| `/views` | `src/app/views/page.tsx` | `ViewsContent.tsx` |
| `/settings` | `src/app/settings/page.tsx` | `AccountSettingsContent.tsx` |
| `/agent/[id]` | `src/app/agent/[id]/page.tsx` | `AgentChatContent.tsx` |
| `/agent/[id]/tasks` | `src/app/agent/[id]/tasks/page.tsx` | `AgentTasksContent.tsx` |
| `/agent/[id]/flow` | `src/app/agent/[id]/flow/page.tsx` | `AgentFlowContent.tsx` |
| `/agent/[id]/settings` | `src/app/agent/[id]/settings/page.tsx` | `AgentSettingsContent.tsx` |
| `/agent/[id]/analytics` | `src/app/agent/[id]/analytics/page.tsx` | `AgentAnalyticsContent.tsx` |

---

## 8. Como editar cada tela

### Home

**Arquivo de conteúdo:** `src/components/HomeContent.tsx`

| O que mudar | Onde |
|---|---|
| Texto do heading ("How can I help you today?") | `<h3>` no centro do componente |
| Skills exibidas | Array `["ai-product-strategy", ...]` no map das skill pills |
| Agents sugeridos | Array `["Create a b2b...", "Create a debt..."]` no map dos agent buttons |
| Vídeo de fundo | Trocar o arquivo em `public/videos/bg-beam-ai.webm` |
| Botão "+ New agent" | `<button>` no `absolute right-4 top-4` |

> **Nota:** O ícone orb/esfera que ficava acima do heading foi removido. Para restaurá-lo, adicione antes do `{/* Heading */}`:
> ```tsx
> <Image src="/images/sphere.webp" alt="logo" width={72} height={72}
>   className="mb-6 rounded-full border border-[rgba(255,255,255,0.08)]" />
> ```

O componente usa `"use client"` por causa do `<textarea>` interativo.

---

### Inbox

**Arquivo de conteúdo:** `src/components/InboxContent.tsx`

Layout: dois painéis horizontais.
- Painel esquerdo (260px): título "Inbox" + ícones de filtro
- Painel direito: estado vazio centralizado

| O que mudar | Como |
|---|---|
| Adicionar itens na lista | No painel esquerdo, adicione elementos após o `border-b`. Ex: `<div className="px-4 py-3 ...">item</div>` |
| Mudar o estado vazio | Altere o JSX dentro do painel direito (`flex-1 flex flex-col items-center justify-center`) |
| Largura do painel esquerdo | Classe `w-[260px]` no primeiro `<div>` |
| Contador de notificações | Substitua o texto "0 new notifications" |

---

### Tasks

**Arquivo de conteúdo:** `src/components/TasksContent.tsx`

| O que mudar | Como |
|---|---|
| Tabs de filtro (Status, Agent) | Os dois `<button>` no topo da área de filtros |
| Adicionar tarefas reais | Substitua o bloco de estado vazio por uma lista/tabela |
| Texto do estado vazio | Altere o `<p>` no `flex flex-col items-center justify-center py-24` |
| Título e subtítulo | `<h1>` e `<p>` no cabeçalho da página |

**Estrutura de uma task row** (para adicionar itens):

```tsx
<div className="flex items-center gap-4 px-4 py-3 border-b border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)]">
  <span className="text-sm text-white">Nome da tarefa</span>
  <span className="ml-auto text-xs text-[rgba(255,255,255,0.4)]">há 2h</span>
</div>
```

---

### Agent Templates

**Arquivo de conteúdo:** `src/components/AgentTemplatesContent.tsx`

Os templates estão num array `templates` no topo do arquivo:

```tsx
const templates = [
  {
    category: "Marketing",
    name: "B2B Outbound Personalisation Agent",
    desc: "Descrição...",
    color: "#6366f1",   // cor do dot de categoria
  },
  // ...
];
```

| O que mudar | Como |
|---|---|
| Adicionar/remover template | Adicione/remova objetos do array `templates` |
| Mudar ícone dos cards | Substitua o emoji `🤖` por um componente `<Image>` ou ícone Lucide |
| Número de colunas | Classe `grid-cols-4` no `<div className="grid ...">` |
| Paginação | Altere o texto "Page 1 of 4" no rodapé |
| Categorias do filtro | O dropdown "Categories" ainda não tem lógica — adicione `useState` para filtrar o array |
| Cor do dot de categoria | Campo `color` no objeto — use apenas `rgba(255,255,255,X)` para manter paleta neutra |

---

### Integrations

**Arquivo de conteúdo:** `src/components/IntegrationsContent.tsx`

As integrações estão num array `integrations`:

```tsx
const integrations = [
  {
    category: "Developer Tools",
    name: "BrowserStack",
    desc: "Descrição...",
    color: "#f97316",
  },
  // ...
];
```

| O que mudar | Como |
|---|---|
| Adicionar integração | Adicione objeto ao array `integrations` |
| Tab ativa (Connections vs Available) | Adicione `useState` e condicione o conteúdo |
| Botão "Add a connection" | Atualmente sem ação — adicione `onClick` e lógica de modal |
| Ícone das integrações | Substitua a bolinha colorida por `<Image src="..." />` com logo real |

---

### Views

**Arquivo de conteúdo:** `src/components/ViewsContent.tsx`

Tela simples com estado vazio. Para adicionar views reais:

```tsx
// Substitua o bloco de estado vazio por:
const views = [
  { name: "Pipeline de vendas", description: "Leads e status", updatedAt: "há 2d" },
];

return (
  <div className="grid grid-cols-3 gap-4 mt-6">
    {views.map(v => (
      <div key={v.name} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
        <h3 className="text-sm font-semibold text-white">{v.name}</h3>
        <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">{v.description}</p>
      </div>
    ))}
  </div>
);
```

---

### Agent Chat

**Arquivo de conteúdo:** `src/components/AgentChatContent.tsx`

Layout: tela cheia com conteúdo centralizado verticalmente.

| O que mudar | Como |
|---|---|
| Texto "What can I help with?" | `<h2>` no centro |
| Subtítulo | `<p>` abaixo do `<h2>` |
| Botão principal ("Ask") | O `<button>` com `<Zap>` dentro do input toolbar |
| Histórico de mensagens | Adicione um `<div className="flex-1 overflow-auto px-8">` antes do input box, com os bubbles de chat |
| Input real (controlado) | Transforme o `<textarea>` em controlled com `useState` |

**Estrutura de uma mensagem de chat:**

```tsx
// Mensagem do usuário (alinhada à direita)
<div className="flex justify-end mb-4">
  <div className="max-w-[70%] rounded-2xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] px-4 py-2.5 text-sm text-white">
    Texto da mensagem
  </div>
</div>

// Resposta do agente (alinhada à esquerda)
<div className="flex gap-3 mb-4">
  <div className="h-7 w-7 rounded-full bg-[rgba(255,255,255,0.08)] flex-shrink-0 flex items-center justify-center text-xs text-[rgba(255,255,255,0.4)]">UA</div>
  <div className="max-w-[70%] rounded-2xl bg-[rgba(255,255,255,0.06)] px-4 py-2.5 text-sm text-white">
    Resposta do agente
  </div>
</div>
```

---

### Agent Tasks

**Arquivo de conteúdo:** `src/components/AgentTasksContent.tsx`

Idêntico ao Tasks global, mas com subtítulo diferente ("all the tasks in this agent"). Para adicionar tarefas, use a mesma estrutura descrita em [Tasks](#tasks).

---

### Agent Flow

**Arquivo de conteúdo:** `src/components/AgentFlowContent.tsx`

Canvas com posicionamento absoluto. O "nó Trigger" está centralizado com `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`.

| O que mudar | Como |
|---|---|
| Adicionar nós ao canvas | Adicione `<div className="absolute" style={{ left: X, top: Y }}>` dentro do container |
| Mudar o padrão do dot grid | Edite `backgroundImage` no style inline do container raiz |
| Conectar nós com linhas | Use SVG `<line>` ou `<path>` com posicionamento absoluto |
| Integrar uma lib de flow real | Substitua o componente inteiro por `react-flow` ou `xyflow` |

---

### Agent Settings (Configuration)

**Arquivo de conteúdo:** `src/components/AgentSettingsContent.tsx`
**Tipo:** Client Component (`"use client"` — usa `useState`)

As tabs estão num array:

```tsx
const tabs = ["Settings", "Memory", "Task Context", "Tools", "Interface"];
```

| O que mudar | Como |
|---|---|
| Adicionar uma tab nova | Adicione o string ao array `tabs` |
| Conteúdo de cada tab | Adicione condicionais `{activeTab === "Memory" && <MemorySection />}` após o formulário de Basic |
| Campos do formulário | Adicione `<div>` com `<label>` + `<input>` após "Category" |
| Remover o banner informativo | Delete o bloco `{showBanner && (...)}` e o `useState(showBanner)` |
| Opções do dropdown Category | Adicione `<option>` dentro do `<select>` |

---

### Agent Analytics

**Arquivo de conteúdo:** `src/components/AgentAnalyticsContent.tsx`

#### Stats cards

O array de estatísticas no topo do componente:

```tsx
{[
  { label: "Tasks completed", value: "0", sub: "0% from prior period", icon: CheckCircle2 },
  { label: "Tasks failed",    value: "0", sub: "0% from prior period", icon: XCircle },
  // ...
].map(({ label, value, sub, icon: Icon }) => (...))}
```

Para exibir dados reais, substitua os valores `"0"` por variáveis.

#### Gauge charts (SVG)

Os gauges usam SVG puro com dois `<path>` — um de fundo (`stroke="rgba(255,255,255,0.08)"`) e um de preenchimento (`stroke="rgba(255,255,255,0.88)"`).

Para animar o gauge para X%:

```tsx
// X% de um semicírculo = X% de 188 (comprimento do arco semicircular)
// strokeDasharray="[X*1.88] 188"
// Exemplo: 75% = strokeDasharray="141 188"
<path
  d="M 10 70 A 60 60 0 0 1 130 70"
  stroke="rgba(255,255,255,0.88)"
  strokeWidth="12"
  fill="none"
  strokeLinecap="round"
  strokeDasharray="141 188"   // 75%
/>
```

#### Período do date range

```tsx
// Linha ~15
March 2nd, 2026 - April 1st, 2026   ← altere para valor dinâmico
```

---

### Account Settings

**Arquivo de conteúdo:** `src/components/AccountSettingsContent.tsx`

| O que mudar | Como |
|---|---|
| Email exibido | Prop `value` do `<input readOnly>` |
| Nome padrão | Prop `defaultValue` do input Full Name |
| Foto de perfil | Substitua o avatar `LM` por `<Image src="..." />` |
| Opções de tema | Adicione `<option>` no `<select>` de Interface theme |
| Lógica de save | Adicione `"use client"` + `useState` + `onSubmit` no formulário |

---

## 9. Como adicionar uma nova rota

### Passo 1 — Criar a pasta e o page.tsx

```bash
mkdir -p src/app/nova-pagina
```

```tsx
// src/app/nova-pagina/page.tsx
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { NovaPaginaContent } from "@/components/NovaPaginaContent";

export default function NovaPaginaPage() {
  return (
    <div className="h-screen bg-background">
      <div className="h-full w-full grid" style={{ gridTemplateColumns: "270px 1fr" }}>
        <AppSidebar />
        <div className="flex h-full flex-col overflow-hidden border-l border-[rgba(255,255,255,0.08)]">
          <AppHeader title="Nova Página" />
          <div className="flex-1 overflow-auto">
            <NovaPaginaContent />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Passo 2 — Criar o componente de conteúdo

```tsx
// src/components/NovaPaginaContent.tsx
export function NovaPaginaContent() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-white mb-1">Nova Página</h1>
      <p className="text-sm text-[rgba(255,255,255,0.4)]">Subtítulo aqui</p>
    </div>
  );
}
```

### Passo 3 — Adicionar à sidebar

Em `src/components/AppSidebar.tsx`, dentro do bloco de nav items:

```tsx
import { NomeDoIcone } from "lucide-react";

// Dentro do JSX, após os outros navItem():
{navItem("/nova-pagina", <><NomeDoIcone size={16} />Nova Página</>)}
```

---

## 10. Como adicionar um agente novo na sidebar

Atualmente a sidebar tem um único agente hardcoded (`AGENT_ID = "demo-agent"`). Para suportar múltiplos agentes:

```tsx
// src/components/AppSidebar.tsx

// 1. Substitua a constante por um array
const agents = [
  { id: "demo-agent",     name: "Untitled Agent",     initials: "UA" },
  { id: "sales-agent",    name: "Sales Bot",           initials: "SB" },
  { id: "support-agent",  name: "Support Assistant",   initials: "SA" },
];

// 2. No JSX, troque o bloco do agente por um .map()
{agents.map((agent) => {
  const isThisAgentActive = pathname.startsWith(`/agent/${agent.id}`);
  return (
    <div key={agent.id}>
      <Link href={`/agent/${agent.id}`} className="...">
        <span className="...">{agent.initials}</span>
        <span className="flex-1 text-sm text-white">{agent.name}</span>
        {isThisAgentActive ? <ChevronDown ... /> : <ChevronRight ... />}
      </Link>
      {isThisAgentActive && (
        <div className="ml-3 mt-0.5 flex flex-col gap-0.5">
          {subItem(`/agent/${agent.id}`, <><MessageSquare size={13} />Chat</>)}
          {/* ... outros sub-itens */}
        </div>
      )}
    </div>
  );
})}
```

---

## 11. Paleta de cores de referência

**Filosofia: preto profundo + branco puro + hierarquia de opacidade. Zero cromatismo nas superfícies.**

```
Fundos
  #080808                        Fundo principal da app (body, page wrappers)
  rgba(255,255,255,0.04)         Card da Home / áreas de conteúdo (elevação mínima)
  rgba(255,255,255,0.055)        --card token (shadcn)
  rgba(255,255,255,0.06)         Hover de nav items
  rgba(255,255,255,0.07)         --secondary token
  rgba(255,255,255,0.08)         Item ativo de nav / fundo de avatares / nós do flow
  rgba(255,255,255,0.09)         --input token
  #111111                        --popover (menus suspensos, modais)

Bordas
  rgba(255,255,255,0.08)         Borda padrão (todos os elementos)
  rgba(255,255,255,0.10)         Borda levemente mais visível
  rgba(255,255,255,0.12)         Borda de cards hover / avatar do usuário

Texto
  white / rgba(255,255,255,0.92) Texto primário
  rgba(255,255,255,0.9)          --secondary-foreground
  rgba(255,255,255,0.4)          Texto muted / labels / placeholders / ícones inativos
  rgba(255,255,255,0.3)          Placeholder de textarea

Ações (botão primário)
  rgba(255,255,255,0.88)         Background do botão primário (--accent)
  rgba(255,255,255,0.75)         Hover do botão primário
  #080808                        Texto sobre botão primário

Avatares
  rgba(255,255,255,0.08)         Background de avatares UA, etc.
  rgba(255,255,255,0.12)         Background do avatar do usuário (LM)

Gradientes permitidos
  radial-gradient(45% 250px at 50% 0px, rgba(255,255,255,0.04) 18.31%, rgba(0,0,0,0) 92.85%)
    → Gradiente sutil na Home e Agent Chat (branco→transparente)

Tokens que NÃO são neutros (exceções mantidas)
  --color-danger    oklch(0.62 0.24 25)    vermelho
  --color-warning   oklch(0.85 0.18 90)    amarelo
  --color-success   oklch(0.85 0.19 158)   verde
  --color-info      oklch(0.70 0.155 255)  azul info
  --kairus-purple   #AB53FF                token de brand (não usar em surfaces)
  --kairus-blue     #4A9EFF                token de brand (não usar em surfaces)
```

---

## 12. Classes utilitárias globais

Definidas em `src/app/globals.css`:

```tsx
// Texto com gradiente branco para transparente
<h1 className="gradient-text">Título</h1>

// Card com glassmorphism + hover
<div className="glass-card rounded-2xl p-6">...</div>

// Glassmorphism premium
<div className="glass rounded-xl p-4">...</div>

// Background de pontos
<div className="dot-grid h-full w-full">...</div>

// Gradiente rainbow de brand
<div className="kairus-gradient h-1 w-full rounded-full" />
```

---

## 13. Ícones disponíveis

O projeto usa **lucide-react** exclusivamente. Ícones já utilizados e seus contextos:

```
AlignJustify      → Views (nav)
BarChart2         → Analytics (nav e header dos cards)
Calendar          → Date picker (Analytics)
CheckCircle2      → Completion rate
CheckSquare       → Task approval
ChevronDown       → Dropdowns, expandir agente na sidebar
ChevronRight      → Agente colapsado na sidebar
ChevronsUpDown    → Botão de profile na sidebar
Download          → Export (Analytics)
Eye               → Mostrar/esconder senha
History           → Header de páginas do agente
Inbox             → Inbox (nav e empty state)
Keyboard          → Controle do flow canvas
LayoutGrid        → Agent templates (nav)
Lightbulb         → Banner informativo (Settings)
Link2             → Integrations (nav)
List              → Filtro Listing (Integrations)
ListTodo          → Tasks (nav e sub-nav do agente)
Maximize          → Fullscreen do flow canvas
MessageCircle     → Chat & support (sidebar bottom)
MessageSquare     → Chat do agente (sub-nav e nó trigger)
Minus             → Zoom out (flow)
MoreHorizontal    → Menu de 3 pontos
Network           → Header (ícone de grafo)
PanelLeft         → Header (toggle sidebar)
Paperclip         → Anexo (chat input)
Plus              → Adicionar (flow canvas e chat input)
Search            → Header direito e barras de pesquisa
Settings          → Configuration (sub-nav do agente)
Settings2         → Filtro Status nas Tasks
SlidersHorizontal → Filtro (Inbox e Tasks)
Tag               → Filtro Categories
ThumbsDown        → Feedback negativo
ThumbsUp          → Feedback positivo
Trash2            → Deletar (Account Settings)
Upload            → Upload foto (Account Settings)
Workflow          → Flow (sub-nav do agente)
X                 → Fechar banner
XCircle           → Tasks failed
Zap               → Botão Ask/Next (chat input)
```

Para usar um ícone novo:
```tsx
import { NomeDoIcone } from "lucide-react";
<NomeDoIcone size={16} className="text-[rgba(255,255,255,0.4)]" />
```

Tamanhos padrão: `16` para nav, `14` para labels pequenos, `20` para header, `40` para empty states.

---

## 14. Comandos de desenvolvimento

```bash
# Iniciar dev server (porta 3000 ou 3001)
npm run dev

# Build de produção (deve passar com 0 erros)
npm run build

# Verificar TypeScript sem gerar arquivos
npm run typecheck

# Lint
npm run lint

# Lint + typecheck + build (CI completo)
npm run check
```

### Verificar se está tudo OK antes de commitar

```bash
npm run check
# Deve retornar: 0 errors, 0 warnings
```

### Porta do dev server

O dev server roda em `http://localhost:3000` por padrão. Se a porta estiver ocupada, tenta `3001`, `3002`, etc.

---

## Dicas rápidas

**Mudar a largura da sidebar:**
Altere `"270px 1fr"` no `gridTemplateColumns` de todos os `page.tsx` e do `agent/[id]/layout.tsx`.

**Adicionar scroll numa tela que não tem:**
Troque `overflow-hidden` por `overflow-auto` no `<div className="flex-1 ...">` do `page.tsx`.

**Tornar um Content component interativo:**
Adicione `"use client"` na primeira linha do arquivo e use `useState`/`useEffect` normalmente.

**Adicionar um modal:**
Use um `useState(false)` para `isOpen` e renderize o modal condicionalmente com `fixed inset-0 z-50 flex items-center justify-center bg-black/60`.

**Testar uma rota de agente:**
Qualquer string funciona como `[id]`. Use `/agent/qualquer-coisa` e a sidebar vai expandir o sub-nav automaticamente.
