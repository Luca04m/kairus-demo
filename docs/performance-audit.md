# Performance Audit Report -- Kairus OS Demo

**Date:** 2026-04-06  
**Scope:** Bundle size, lazy loading, rendering, caching, assets  
**Status:** READ-ONLY analysis

---

## Executive Summary

**Overall Score: 3/10** -- The project has zero code-splitting, zero lazy loading, no image optimization, an external font CDN blocking render, no caching on API routes, and 51 files marked `"use client"` with almost no memoization. For a demo with 20+ pages and heavy deps (Recharts, Framer Motion, Lucide), this means the entire app ships as a single massive client bundle.

---

## 1. Bundle Analysis

**next.config.ts** is effectively empty -- only `devIndicators: false`. No bundle optimization configured.

**Heavy dependencies (all shipped eagerly):**
| Package | Approx. gzip size | Files importing it |
|---------|------------------|--------------------|
| recharts | ~150 KB | 3 (FinanceiroContent, MarketingContent, RoiContent) |
| framer-motion | ~35 KB | 2 direct + entire ds/ system uses motion components |
| lucide-react | ~5 KB per icon, 42 files | 42 files import individual icons |
| @supabase/supabase-js | ~60 KB | 7 files |
| zustand | ~3 KB | Minimal impact |

**Severity: CRITICAL** -- recharts alone adds ~150 KB gzipped. It is imported eagerly in page-level components.

**Recommendation:**
- Add `experimental.optimizePackageImports` for `lucide-react` and `recharts` in next.config.ts
- Enable `swcMinify: true` (default in Next 16, verify it is active)

---

## 2. Dynamic Imports / Code Splitting

**Finding: ZERO dynamic imports found.**

No usage of `next/dynamic`, `React.lazy()`, or `import()` anywhere in src/.

**Severity: CRITICAL** -- Every page loads the entire component tree. A user visiting `/login` downloads Recharts, WorldCanvas, SalesRoom, and all 20+ page components.

**Recommendation:**
- Wrap every page content component with `next/dynamic` + `ssr: false` where appropriate
- Priority targets: `FinanceiroContent`, `MarketingContent`, `RoiContent` (Recharts), `WorldCanvas`/`WorldView` (heavy canvas), `AgentFlowContent`

---

## 3. Image Optimization

**Finding: ZERO usage of `next/image`.**

- 5 files use `next/image` (AppSidebar, AgentChatContent, BeamHomeContent, FloatingNav, Hero) -- CORRECTION: these use the Image component from next/image, which is good.
- No raw `<img>` tags found -- also good.
- Public assets are minimal: 1 SVG logo, 1 WebP image (652 bytes), 1 WebM video (3.4 MB).

**Severity: LOW** -- The 3.4 MB video (`bg-beam-ai.webm`) is the only concern. It should be lazy loaded or only played on interaction.

**Recommendation:**
- Add `loading="lazy"` or intersection observer to the video element
- Consider converting to a lighter format or providing a poster frame

---

## 4. Lazy Loading

**Finding: NO lazy loading of any kind.**

Heavy components loaded eagerly on every page:
- **Charts** (Recharts): FinanceiroContent, MarketingContent, RoiContent -- all synchronous imports
- **World Canvas**: WorldCanvas, WorldView, Minimap, AgentSprite -- complex rendering loaded at startup
- **Sales Room**: ConversationView, ActivityFeed with Framer Motion
- **Roadmap**: TimelineView, EditItemForm, AddItemForm with complex state

**Severity: CRITICAL**

**Recommendation:**
```typescript
// Example fix for FinanceiroContent
const FinanceiroContent = dynamic(
  () => import('@/components/FinanceiroContent').then(m => ({ default: m.FinanceiroContent })),
  { loading: () => <Skeleton className="h-96" /> }
);
```

---

## 5. Re-render Risks

**Finding: 109 useMemo/useCallback occurrences across 35 files -- moderate coverage but gaps exist.**

**Problematic patterns identified:**
- **51 "use client" files** -- many are leaf components that could be server components
- **Hooks with large state**: `useWorld.ts` (7 memo calls -- complex), `useRoadmap.ts` (10 memo calls -- very complex state)
- **Missing memo on list items**: `RoomCard`, `RoadmapCard`, `SalesRoomPanel` -- rendered in lists without `React.memo`
- **AppShellClient** (4 memo calls) wraps the entire app -- any state change here re-renders everything

**Severity: MEDIUM** -- For a demo this is acceptable, but for production the World and Roadmap views would suffer.

**Recommendation:**
- Wrap list-item components (`RoomCard`, `RoadmapCard`) with `React.memo`
- Extract sidebar state from AppShellClient to prevent full-tree re-renders
- Audit `useWorld` and `useRoadmap` hooks for unnecessary state dependencies

---

## 6. Client vs Server Components

**Finding: 51 files use "use client" -- nearly every component.**

Page files (e.g., `dashboard/page.tsx`, `financeiro/page.tsx`) are server components but they immediately render a single `"use client"` component, making the server boundary meaningless.

**No data fetching happens in server components.** All API calls go through client-side hooks to `/api/*` routes, which then call Supabase. This is a double-hop pattern: Client -> Next API -> Supabase instead of Server Component -> Supabase directly.

**Severity: HIGH** -- The server component architecture is completely unused. Every page could benefit from server-side data fetching to eliminate loading states and reduce client JS.

**Recommendation:**
- Fetch data in page server components using Supabase server client
- Pass data as props to client components that need interactivity
- Convert static UI components (AppHeader, SidebarSection, etc.) to server components

---

## 7. Font Loading

**Finding: External CDN font with render-blocking behavior.**

```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
```

This is in `layout.tsx` `<head>` -- a render-blocking external stylesheet.

**Severity: HIGH** -- This blocks First Contentful Paint. The browser must download the CSS from fontshare.com before rendering any text.

**Recommendation:**
- Switch to `next/font` with local font files for zero-layout-shift loading:
```typescript
import localFont from 'next/font/local';
const satoshi = localFont({ src: './fonts/Satoshi-Variable.woff2', display: 'swap' });
```
- Or at minimum add `rel="preload"` and use `font-display: swap` (already present via `&display=swap` but the CSS fetch itself still blocks)

---

## 8. Caching Strategy

**Finding: ZERO caching anywhere.**

- No `Cache-Control` headers in any of the 29 API routes
- No `React.cache()` usage
- No `unstable_cache` or `revalidate` exports
- No ISR (Incremental Static Regeneration) configured

**Severity: MEDIUM** -- For a demo with mock data, this matters less. But API routes return the same mock data every time with no caching.

**Recommendation:**
- Add `export const revalidate = 3600` to pages with static mock data
- Add `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` to API routes
- Use `React.cache()` for repeated Supabase queries in server components

---

## 9. Third-Party Scripts

**Finding: Only one external resource -- the Fontshare CSS (covered in section 7).**

No analytics, no GTM, no external scripts, no tracking pixels.

**Severity: NONE** -- Clean on this front.

---

## 10. Prioritized Recommendations

| # | Action | Impact | Effort | Category |
|---|--------|--------|--------|----------|
| 1 | Add `next/dynamic` for chart components (Recharts) | **HIGH** -- saves ~150 KB from initial bundle | Low | Bundle |
| 2 | Switch to `next/font/local` for Satoshi | **HIGH** -- eliminates render-blocking request | Low | Font |
| 3 | Add `next/dynamic` for all page content components | **HIGH** -- enables route-based code splitting | Medium | Bundle |
| 4 | Move data fetching to server components | **HIGH** -- eliminates client-server double-hop, removes loading states | High | Architecture |
| 5 | Add `optimizePackageImports` for lucide-react | **MEDIUM** -- tree-shakes unused icons | Low | Bundle |
| 6 | Lazy-load the 3.4 MB background video | **MEDIUM** -- faster initial load on homepage | Low | Assets |
| 7 | Add `React.memo` to list-item components | **MEDIUM** -- reduces re-renders in lists | Low | Rendering |
| 8 | Add cache headers to API routes | **LOW** -- mock data, but good practice | Low | Caching |
| 9 | Convert static UI to server components | **LOW** -- reduces client JS marginally | Medium | Architecture |
| 10 | Add `revalidate` to static pages | **LOW** -- enables ISR for demo | Low | Caching |

### Estimated Bundle Impact

Implementing items 1, 3, and 5 would reduce the initial JS payload by an estimated **40-60%**, primarily from deferring Recharts (~150 KB), Framer Motion trees, and the World canvas system to route-level chunks.

---

## Files Analyzed

- `/Volumes/KINGSTON/kairus-demo/next.config.ts` -- empty config
- `/Volumes/KINGSTON/kairus-demo/package.json` -- dependency list
- `/Volumes/KINGSTON/kairus-demo/src/app/layout.tsx` -- root layout with blocking font
- `/Volumes/KINGSTON/kairus-demo/src/app/dashboard/page.tsx` -- thin server wrapper
- `/Volumes/KINGSTON/kairus-demo/src/app/api/dashboard/stats/route.ts` -- no caching
- 23 page files, 51 "use client" components, 29 API routes examined
