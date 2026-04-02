<objective>
Você é o avaliador de fidelidade visual do clone Beam AI. Sua tarefa é identificar TODOS os gaps visuais entre o clone atual e as referências reais do Beam AI, e depois corrigir cada gap encontrado. Não declare nada correto sem verificação visual direta.
</objective>

<context>
## Estrutura do projeto
- Working directory: `/Volumes/KINGSTON/repos/website-cloner`
- Screenshots reais do Beam AI (ground truth): `./output/screenshots/clone-01-home.png` … `clone-12-account-settings.png`
- Código clone: `./src/`

## Layout de referência — o que a tela Home fez CERTO
A tela Home (`src/app/page.tsx`) tem a estrutura correta:
```tsx
<div className="h-screen bg-[#020817]" style={{ backgroundImage: "radial-gradient(45% 250px at 50% 0px, rgba(136, 145, 243, 0.15) 18.31%, rgba(0, 4, 96, 0) 92.85%)" }}>
  <div className="h-full w-full grid" style={{ gridTemplateColumns: "270px 1fr" }}>
    <AppSidebar />
    <div className="flex h-full flex-col overflow-hidden px-4 pb-4 md:pl-0">
      <main className="mt-4 flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(29,40,58,0.6)] bg-[rgba(29,40,58,0.08)]">
        <AppHeader />
        <HomeContent />
      </main>
    </div>
  </div>
</div>
```

**Isto é DIFERENTE das outras telas.** A Home tem:
1. `radial-gradient` no background da página
2. `px-4 pb-4 md:pl-0` padding ao redor da área de conteúdo
3. Container `rounded-2xl` flutuante com border sutil

As outras telas (Inbox, Tasks, Agent Templates, etc.) NÃO têm esse container flutuante — elas usam `border-l border-[#1d283a]` flat. Isso está CORRETO baseado nas screenshots reais.

## O problema reportado
O usuário diz que todas as telas além da Home têm gaps visuais. A Home está correta. As demais estão incorretas em estrutura, componentes, ou detalhes visuais.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, lucide-react. NUNCA adicionar novas dependências.
</context>

<phase_1_visual_capture>
## Fase 1 — Captura do clone atual (FAZER PRIMEIRO)

Antes de qualquer análise, capture screenshots do clone rodando localmente:
1. Verifique se o dev server está rodando: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
2. Se não estiver rodando, inicie com `npm run dev` em background e aguarde 5s
3. Use o browser tool para navegar e capturar cada rota:

| Rota | Screenshot destino |
|------|-------------------|
| `http://localhost:3000/` | `./output/screenshots/current-home.png` |
| `http://localhost:3000/inbox` | `./output/screenshots/current-inbox.png` |
| `http://localhost:3000/tasks` | `./output/screenshots/current-tasks.png` |
| `http://localhost:3000/agent-templates` | `./output/screenshots/current-agent-templates.png` |
| `http://localhost:3000/integrations` | `./output/screenshots/current-integrations.png` |
| `http://localhost:3000/views` | `./output/screenshots/current-views.png` |
| `http://localhost:3000/agent/demo-agent` | `./output/screenshots/current-agent-chat.png` |
| `http://localhost:3000/agent/demo-agent/tasks` | `./output/screenshots/current-agent-tasks.png` |
| `http://localhost:3000/agent/demo-agent/flow` | `./output/screenshots/current-agent-flow.png` |
| `http://localhost:3000/agent/demo-agent/settings` | `./output/screenshots/current-agent-settings.png` |
| `http://localhost:3000/agent/demo-agent/analytics` | `./output/screenshots/current-agent-analytics.png` |
| `http://localhost:3000/settings` | `./output/screenshots/current-account-settings.png` |

Para cada rota: navegue, aguarde o carregamento completo, então capture.
</phase_1_visual_capture>

<phase_2_gap_analysis>
## Fase 2 — Análise de gaps (POR TELA)

Para cada tela, carregue o par de imagens:
- Ground truth: `./output/screenshots/clone-XX-[name].png`
- Clone atual: `./output/screenshots/current-[name].png`

Analise cada par e documente gaps na seguinte estrutura:

```
### [ScreenName]
GROUND TRUTH: clone-XX-[name].png
CLONE ATUAL:  current-[name].png

GAPS ENCONTRADOS:
- [ ] GAP-[N]: [descrição precisa do gap — ex: "header missing 'Network' icon button"]
- [ ] GAP-[N]: [...]

STATUS: ✅ PASS | ⚠️ MINOR | ❌ CRITICAL
```

### Checklist obrigatório por tela (verificar CADA item):

**Layout structure:**
- [ ] Grid sidebar (270px) + content está correto?
- [ ] Separação sidebar/content: `border-l border-[#1d283a]` flat (não rounded)?
- [ ] Header presente com ícones corretos?
- [ ] Breadcrumb no header (para rotas de agente) correto?
- [ ] Badge "% 0" no header (apenas para rotas `/agent/[id]/*`) presente?

**Sidebar:**
- [ ] "Untitled Agent" tem chevron DOWN quando em rota de agente, RIGHT quando não?
- [ ] Sub-nav do agente (Chat, Tasks, Flow, Learning, Configuration, Analytics) visível quando em rota `/agent/[id]/*`?
- [ ] Item ativo está highlighted com `bg-[rgba(29,40,58,0.5)]`?
- [ ] Sidebar tem exatamente: Luca (topo) → Beam AI → Inbox → Tasks → Agent templates → Integrations → Views → [separator] → Your Agents → Untitled Agent → [footer] → Chat & support → Luca Moreno?

**Conteúdo específico — verificar contra ground truth:**
- [ ] Inbox: 3 painéis? (sidebar + lista ~240px + main area)?
- [ ] Tasks: header "Tasks" + subtitle + filter tabs (Status, Agent) + search + View button + empty state?
- [ ] Agent Templates: grid de cards com "Create agent" buttons?
- [ ] Integrations: abas (Connections, Available integrations) + grid de cards de integração?
- [ ] Views: layout da página?
- [ ] Agent Chat: "What can I help with?" centered + input + "Ask" button + chevron?
- [ ] Agent Tasks: breadcrumb "Untitled agent > Tasks" + "Create task" button + filtros?
- [ ] Agent Flow: canvas área + "Trigger" node centralizado + zoom controls (bottom-left)?
- [ ] Agent Settings: título "Configuration" + 5 abas (Settings, Memory, Task Context, Tools, Interface) + form fields?
- [ ] Agent Analytics: stat cards (Tasks analyzed, Open tasks, etc.) + gráficos?
- [ ] Account Settings: "Account settings" heading + avatar upload + Email field + Full Name field + password section?
</phase_2_gap_analysis>

<phase_3_fix_all_gaps>
## Fase 3 — Corrigir TODOS os gaps (SOMENTE em `./src/`)

Após a análise, corrija cada gap identificado. Regras de correção:

### Regras MUST:
1. NUNCA modificar `page.tsx` (Home) — está correto
2. NUNCA adicionar dependências em package.json
3. NUNCA adicionar autenticação ou chamadas de API reais
4. SEMPRE manter todos os dados como mock/estático
5. Para cada componente alterado: releia o arquivo antes de editar
6. Corrija estrutura antes de detalhes (layout > spacing > cores > ícones)

### Ordem de prioridade de correção:
1. **Crítico**: layout structure incorreto (colunas erradas, container errado)
2. **Crítico**: componentes ausentes (painéis faltando, headers errados)
3. **Major**: conteúdo errado (texto, ícones, botões incorretos)
4. **Minor**: espaçamentos, cores, tamanhos de fonte

### Padrão de correção para cada arquivo:
```
1. Read [arquivo]
2. Compare com ground truth
3. Identificar exatamente O QUE mudar
4. Edit apenas as linhas necessárias
5. Verificar que o resto não foi quebrado
```

### Gaps conhecidos para verificar obrigatoriamente:

**A. Todas as rotas de agente: verificar badge no AppHeader**
- `agent/[id]/page.tsx` → AppHeader deve ter `badge="% 0"`
- `agent/[id]/tasks/page.tsx` → AppHeader deve ter `badge="% 0"` (verificar se presente)
- `agent/[id]/flow/page.tsx` → AppHeader deve ter `badge="% 0"` (verificar se presente)
- `agent/[id]/settings/page.tsx` → AppHeader deve ter `badge="% 0"` (verificar se presente)
- `agent/[id]/analytics/page.tsx` → AppHeader deve ter `badge="% 0"` (verificar se presente)

**B. Sidebar — sub-nav do agente**
- Verificar se o link para `/agent/${AGENT_ID}/settings` está marcado como ativo quando em `/agent/[id]/settings` (o route é `/settings` mas o sidebar item é "Configuration")
- Verificar se "Learning" rota existe ou deve navegar para rota placeholder

**C. Inbox — 3 painéis**
- Verificar se a divisão sidebar + painel-lista (240px) + main-area está 100% fiel ao ground truth
- O painel-lista deve ter: "Inbox" heading + filter icon + meatball menu — sem items (vazio)
- O main area deve ter: empty state centralizado ("You have received" + "0 new notifications")

**D. Agent Flow — canvas com zoom controls**
- Ground truth mostra zoom controls no canto inferior esquerdo: `+`, `-`, fit, minimap (4 botões)
- Verificar se AgentFlowContent.tsx tem esses 4 botões

**E. Agent Analytics — stat cards header row**
- Ground truth mostra: "Analytics" heading + date range "March 2nd, 2026 - April 2nd, 2026" + time filter buttons (Last 3 months, Last 30 Day, Last 7 days)
- Verificar se AgentAnalyticsContent.tsx tem esses elementos

**F. Agent Settings — tabs corretos**
- Ground truth clone-10 mostra 5 abas
- Verificar se os rótulos das abas correspondem exatamente ao ground truth
</phase_3_fix_all_gaps>

<phase_4_verification>
## Fase 4 — Verificação final

Após todas as correções:

1. **Build check:**
```bash
cd /Volumes/KINGSTON/repos/website-cloner && npm run build
```
MUST pass com 0 errors. Se falhar, corrija antes de prosseguir.

2. **Type check:**
```bash
npm run typecheck
```
MUST pass.

3. **Screenshot final:** Capture todas as rotas novamente e salve como `./output/screenshots/fixed-[name].png`. Compare visualmente com ground truth.

4. **Report final:**
```
## Gap Audit Report

| Screen | Gaps encontrados | Gaps corrigidos | Status |
|--------|-----------------|-----------------|--------|
| Home   | 0               | 0               | ✅ PASS |
| Inbox  | X               | X               | ...    |
| ...    | ...             | ...             | ...    |

TOTAL: X gaps encontrados, X corrigidos
Build: PASS / FAIL
```
</phase_4_verification>

<constraints>
- SOMENTE modificar arquivos em `./src/` — NUNCA tocar config, package.json, ou arquivos raiz
- NUNCA adicionar dark mode toggle, autenticação, ou features não presentes no ground truth
- Se screenshot de ground truth for ambíguo/ilegível: anotar como "UNCLEAR" e fazer best effort baseado no design system existente
- Parar e reportar se: build falhar mais de 2 vezes, screenshot não carregar, ou rota retornar 404
- Output de progresso após cada tela: `✅ [ScreenName] — [N gaps corrigidos]`
</constraints>

<success_criteria>
- `npm run build` passa com 0 errors
- Cada tela tem layout estruturalmente idêntico ao ground truth
- Sidebar ativo correto em todas as rotas
- Badge "% 0" presente em todas as rotas `/agent/[id]/*`
- Nenhum componente renderiza conteúdo visivelmente incorreto vs ground truth
- Screenshots `fixed-*.png` visualmente próximos de `clone-*.png` (ground truth)
</success_criteria>
