# Kairus Demo — Performance & Build Report

**Data:** 2026-04-06  
**Stack:** Next.js 16.2.1 / React 19.2.4 / Tailwind 4 / TypeScript 5

---

## 1. Build Metrics

| Diretorio | Tamanho |
|-----------|---------|
| `.next/` (total) | 1.2 GB |
| `.next/static/` | 2.8 MB |
| `.next/server/` | 24 MB |
| `.next/cache/` | 208 KB |

---

## 2. JavaScript Bundle Analysis

Total JS chunks: **2,740 KB** (~2.7 MB)

### Top 20 Chunks (by size)

| Arquivo | Tamanho |
|---------|---------|
| `0ys80o6_amlp_.js` | 404 KB |
| `0vzesq6jdzzg6.js` | 404 KB |
| `0h4bq73pogmtb.js` | 224 KB |
| `0q-7c_7f76.4b.js` | 220 KB |
| `0kt_.0j901zal.js` | 136 KB |
| `0gqs69nzb16qg.js` | 136 KB |
| `081g~h0v~2~6z.js` | 136 KB |
| `03~yq9q893hmn.js` | 112 KB |
| `08thzmsbcbhqy.js` | 92 KB |
| `0w2x~-3f4_5s8.js` | 56 KB |
| `0scqmcffbq-lu.js` | 52 KB |
| `0cje14_narrpx.js` | 52 KB |
| `15-8sg4d.1pqt.js` | 48 KB |
| `04c.vmoizu191.js` | 48 KB |
| `0~ms5zn2f356-.js` | 40 KB |
| `0y1kg9rz14g9g.js` | 40 KB |
| `0y6cub8ld05-b.js` | 36 KB |
| `0~0sxm04ywxk4.js` | 32 KB |
| `0qqvktheigdbo.js` | 32 KB |
| `0noquf695b24f.js` | 32 KB |

> Os 2 maiores chunks (404 KB cada) provavelmente contem Recharts e Framer Motion.

---

## 3. CSS Bundle Analysis

| Arquivo | Tamanho |
|---------|---------|
| `0darintjai.ma.css` | 104 KB |

Single CSS bundle — Tailwind 4 com purge eficiente. **Bom resultado.**

---

## 4. Server-Side Page Sizes (HTML)

| Pagina | Tamanho |
|--------|---------|
| `/world` | 84 KB |
| `/equipe` | 68 KB |
| `/dashboard` | 60 KB |
| `/settings` | 56 KB |
| `/inbox` | 56 KB |
| `/tasks` | 52 KB |
| `/` (index) | 52 KB |
| `/configuracoes` | 52 KB |
| `/roadmap` | 48 KB |
| `/integrations` | 48 KB |
| `/agent-templates` | 48 KB |
| `/sales-room` | 44 KB |
| `/marketing` | 44 KB |
| `/financeiro` | 44 KB |
| `/views` | 40 KB |
| `/roi` | 40 KB |
| `/relatorios` | 40 KB |
| `/login` | 16 KB |

> `/world` e a pagina mais pesada (84 KB) — contém pixel sprites e mapa interativo.

---

## 5. Dependencies Analysis

### Production Dependencies (14)

| Dependencia | Versao | Imports | Proposito | Bundle Impact |
|-------------|--------|---------|-----------|---------------|
| `next` | 16.2.1 | 48 | Framework | Core (tree-shaken) |
| `react` | 19.2.4 | 69 | UI library | Core (~6 KB gzip) |
| `react-dom` | 19.2.4 | 0* | React DOM renderer | Core (~130 KB gzip) |
| `framer-motion` | 12.38.0 | 11 | Animacoes | ~45 KB gzip |
| `lucide-react` | 1.6.0 | 38 | Icones | Tree-shaken (~2 KB/icon) |
| `recharts` | 2.15.0 | 3 | Graficos | ~150 KB gzip |
| `zustand` | 5.0.12 | 4 | State management | ~2 KB gzip |
| `@supabase/ssr` | 0.10.0 | 3 | Auth SSR | ~8 KB gzip |
| `@supabase/supabase-js` | 2.101.1 | 2 | Supabase client | ~30 KB gzip |
| `class-variance-authority` | 0.7.1 | 5 | Variant styling | ~2 KB gzip |
| `clsx` | 2.1.1 | 1 | Class merging | <1 KB gzip |
| `tailwind-merge` | 3.5.0 | 1 | TW class merge | ~5 KB gzip |
| `@base-ui/react` | 1.3.0 | 1 | Button primitive | ~10 KB gzip |
| `tw-animate-css` | 1.4.0 | 1** | CSS animations | CSS-only |
| `shadcn` | 4.1.0 | 0 | CLI tool | N/A (CLI only) |
| `agentic-flow` | 2.0.7 | 0 | Agent orchestration | N/A (unused) |

\* `react-dom` e importado implicitamente pelo Next.js  
\** Importado via `globals.css`

### Dependencias Potencialmente Removiveis

| Dependencia | Razao | Economia Estimada |
|-------------|-------|-------------------|
| `agentic-flow` | **Zero imports em src/** — nao utilizado | ~0 KB (nao bundled) |
| `shadcn` | **CLI tool** — deveria estar em devDependencies | 0 KB (CLI only) |
| `@supabase/ssr` + `@supabase/supabase-js` | Demo mode — auth desabilitada. Manter se planeja reativar. | ~38 KB gzip |

---

## 6. Code Quality Metrics

| Metrica | Valor |
|---------|-------|
| **Total LOC** (TS/TSX) | 22,990 |
| **Components** (`src/components/`) | 72 |
| **Hooks** (`src/hooks/`) | 3 |
| **Stores** (`src/stores/`) | 5 |
| **Type files** (`src/types/`) | 17 |
| **API routes** | 27 |

### Arquivos Acima de 500 Linhas (violam regra do projeto)

| Arquivo | Linhas | Status |
|---------|--------|--------|
| `src/types/database.ts` | 1,033 | Excede 2x o limite |
| `src/components/FinanceiroContent.tsx` | 777 | Excede 1.5x |
| `src/components/world/pixel-sprites.ts` | 585 | Excede levemente |
| `src/data/world-layout.ts` | 522 | Excede levemente |

> 4 arquivos excedem o limite de 500 linhas definido no CLAUDE.md.

---

## 7. Assets Analysis

| Arquivo | Tamanho |
|---------|---------|
| `public/videos/bg-beam-ai.webm` | 3.3 MB |
| `public/kairus-logo.svg` | 4 KB |
| `public/images/sphere.webp` | 4 KB |

> Total assets: **~3.3 MB** — dominado pelo video de background. Imagens otimizadas (webp/svg).

---

## 8. Resumo e Recomendacoes

### Pontos Positivos
- CSS bundle enxuto (104 KB) — Tailwind purge eficiente
- Assets leves — uso adequado de webp/svg
- Tree-shaking funcionando (lucide-react com 38 arquivos mas impacto baixo)
- Boa separacao de componentes (72 components, 5 stores, 17 type files)

### Pontos de Atencao
1. **Build total de 1.2 GB** — normal para Next.js 16 com cache; `.next/static` e `.next/server` sao razoaveis
2. **2 chunks de 404 KB** — provavelmente Recharts + Framer Motion. Considerar dynamic import para paginas que nao usam graficos
3. **`agentic-flow`** deve ser removido do package.json (zero uso)
4. **`shadcn`** deve ser movido para devDependencies (CLI tool)
5. **4 arquivos excedem 500 linhas** — `database.ts` (1033 LOC) e o pior caso
6. **Video de 3.3 MB** pode impactar FCP — considerar lazy loading ou poster image

### Bundle Size Estimado (gzip, client)

| Categoria | Estimativa |
|-----------|------------|
| React + React DOM | ~136 KB |
| Recharts | ~150 KB |
| Framer Motion | ~45 KB |
| Supabase | ~38 KB |
| Outros (zustand, cva, etc.) | ~20 KB |
| **Total estimado** | **~389 KB gzip** |

> Para um demo com 20+ paginas interativas, o tamanho esta dentro do aceitavel. Otimizacoes de dynamic import reduziriam o first-load JS significativamente.
