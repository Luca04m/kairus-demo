<objective>
Aplicar o wrapper "floating card" da tela Home em TODAS as outras telas do clone Beam AI.
A tela Home está correta. Todas as outras telas estão sem o tratamento visual de card flutuante.
</objective>

<context>
## O problema exato

A tela **Home** (`src/app/page.tsx`) envolve seu conteúdo assim:
```tsx
<div className="flex h-full flex-col overflow-hidden px-4 pb-4 md:pl-0">
  <main className="mt-4 flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(29,40,58,0.6)] bg-[rgba(29,40,58,0.08)]">
    <AppHeader />
    <HomeContent />
  </main>
</div>
```

Isso cria:
- 16px de padding nas laterais e base (`px-4 pb-4`)
- Um container flutuante arredondado (`rounded-2xl`) com border sutil e bg levemente escuro
- O conteúdo "flutua" dentro da página em vez de ir edge-to-edge

Todas as outras telas usam isso:
```tsx
<div className="flex h-full flex-col overflow-hidden border-l border-[#1d283a]">
```
Que é flat, sem arredondamento, sem padding — visualmente diferente da Home.

## Arquivos que PRECISAM ser alterados

1. `src/app/inbox/page.tsx`
2. `src/app/tasks/page.tsx`
3. `src/app/agent-templates/page.tsx`
4. `src/app/integrations/page.tsx`
5. `src/app/views/page.tsx`
6. `src/app/settings/page.tsx`
7. `src/app/agent/[id]/layout.tsx` ← layout compartilhado das rotas `/agent/[id]/*`

## Arquivo que NÃO deve ser alterado
- `src/app/page.tsx` (Home) — está correto, não tocar
</context>

<requirements>
Para CADA arquivo listado acima:

1. Leia o arquivo
2. Substitua o bloco:
   ```tsx
   <div className="flex h-full flex-col overflow-hidden border-l border-[#1d283a]">
     {/* children */}
   </div>
   ```
   Por:
   ```tsx
   <div className="flex h-full flex-col overflow-hidden px-4 pb-4 md:pl-0">
     <main className="mt-4 flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(29,40,58,0.6)] bg-[rgba(29,40,58,0.08)]">
       {/* children (mantendo exatamente o que estava dentro) */}
     </main>
   </div>
   ```
3. Preserve TODOS os filhos do div original — apenas troca o wrapper externo

**IMPORTANTE para `agent/[id]/layout.tsx`:**
O layout atual tem:
```tsx
<div className="h-screen bg-[#020817]">
  <div className="h-full w-full grid" style={{ gridTemplateColumns: "270px 1fr" }}>
    <AppSidebar />
    <div className="flex h-full flex-col overflow-hidden border-l border-[#1d283a]">
      {children}
    </div>
  </div>
</div>
```

Deve ficar:
```tsx
<div className="h-screen bg-[#020817]">
  <div className="h-full w-full grid" style={{ gridTemplateColumns: "270px 1fr" }}>
    <AppSidebar />
    <div className="flex h-full flex-col overflow-hidden px-4 pb-4 md:pl-0">
      <main className="mt-4 flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(29,40,58,0.6)] bg-[rgba(29,40,58,0.08)]">
        {children}
      </main>
    </div>
  </div>
</div>
```
</requirements>

<verification>
1. Execute `npm run build` — deve passar com 0 errors
2. Execute `npm run typecheck` — deve passar
3. Navegue para `http://localhost:3000/inbox` e confirme que o conteúdo está dentro de um container arredondado igual à Home
4. Repita para `/tasks`, `/agent-templates`, `/integrations`, `/views`, `/settings`
5. Repita para `/agent/demo-agent` (e sub-rotas tasks, flow, settings, analytics)

Done when: todas as rotas mostram o mesmo floating card visual da Home — arredondado, com padding, sem border-l flat.
</verification>

<success_criteria>
- Nenhuma tela usa `border-l border-[#1d283a]` como separador direto do sidebar
- Todas as telas (exceto Home que já está correta) têm `rounded-2xl border border-[rgba(29,40,58,0.6)]` no container principal
- `npm run build` passa com 0 errors
- Visual identico da Home aplicado em todas as rotas
</success_criteria>
