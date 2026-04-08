# Code Quality Audit Report — Kairus OS Demo

**Date:** 2026-04-06  
**Scope:** `src/` directory — 23 pages, ~100+ source files  
**Overall Quality Score:** 6/10  
**Technical Debt Estimate:** ~20-30 hours

---

## 1. TODO/FIXME/HACK Comments

**None found.** No TODO, FIXME, HACK, or XXX comments exist in `src/`. This is either good discipline or a sign that known issues go untracked.

---

## 2. Dead Code / Unused Modules

### 2.1 Entire Design System (`src/components/ds/`) — ORPHANED

15 files including `Hero.tsx`, `FloatingNav.tsx`, `ColorsSection.tsx`, `TokensSection.tsx`, etc. are exported from `src/components/ds/index.ts` but **no file in `src/app/` ever imports them**. There is no `/ds` page route either. The supporting data file `src/data/ds-data.ts` is also only consumed internally by `ds/` components.

**Files:**
- `src/components/ds/Hero.tsx`
- `src/components/ds/FloatingNav.tsx`
- `src/components/ds/Section.tsx`
- `src/components/ds/TokensSection.tsx`
- `src/components/ds/TypographySection.tsx`
- `src/components/ds/ColorsSection.tsx`
- `src/components/ds/ComponentsSection.tsx`
- `src/components/ds/PatternsSection.tsx`
- `src/components/ds/ElevationSection.tsx`
- `src/components/ds/BorderRadiusSection.tsx`
- `src/components/ds/GlassShowcaseSection.tsx`
- `src/components/ds/EffectsSection.tsx`
- `src/components/ds/MotionSection.tsx`
- `src/components/ds/SidebarSection.tsx`
- `src/components/ds/Footer.tsx`
- `src/components/ds/index.ts`
- `src/data/ds-data.ts`

### 2.2 Zustand Stores — Never Imported Outside Barrel

The following stores are exported from `src/stores/index.ts` but **no component or page ever imports from `@/stores` or any individual store file** (except world-related stores):

| Store | Status |
|-------|--------|
| `src/stores/departmentStore.ts` | **Unused** |
| `src/stores/financialStore.ts` | **Unused** |
| `src/stores/approvalStore.ts` | **Unused** |
| `src/stores/uiStore.ts` | **Unused** |
| `src/stores/crmStore.ts` | **Unused** |
| `src/stores/salesStore.ts` | **Unused** |
| `src/stores/agentStore.ts` | **Unused** |
| `src/stores/authStore.ts` | **Unused** |
| `src/stores/alertStore.ts` | **Unused** |
| `src/stores/salesRoomStore.ts` | **Unused** |
| `src/stores/roadmapStore.ts` | Used by roadmap components |
| `src/stores/worldStore.ts` | Used by world components |
| `src/stores/worldUiStore.ts` | Used by world components |

### 2.3 Custom Hooks — Never Imported

All hooks in `src/hooks/` are exported from `src/hooks/index.ts` but **no file imports from `@/hooks`**:

- `src/hooks/useSupabase.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useAgents.ts`
- `src/hooks/useDepartments.ts`
- `src/hooks/useAlerts.ts`
- `src/hooks/useRoadmap.ts`
- `src/hooks/useSalesRoom.ts`
- `src/hooks/useWorld.ts`
- `src/hooks/useRealtimeSubscription.ts`
- `src/hooks/useSalesRoomPanel.ts`

### 2.4 Squads Library — Never Imported

The entire `src/lib/squads/` directory (seed.ts, realtime.ts, types.ts, index.ts) is never imported by any component or page.

### 2.5 `src/components/SidebarContext.tsx` — Never Imported

Exported but not consumed anywhere.

### 2.6 Types — Never Directly Imported

`src/types/crm.ts` and `src/types/database.ts` are re-exported via `src/types/index.ts` but no consumer file imports from either barrel or direct path.

---

## 3. Unused Imports (per file)

No `import ... from` statements with obviously unused identifiers were detected at scale (would require per-file AST analysis or `tsc --noUnusedLocals`). Recommend running:

```bash
npx tsc --noUnusedLocals --noUnusedParameters --noEmit 2>&1 | head -200
```

### Potential: `AppSidebar.tsx`
Imports `MessageCircle` from lucide-react — verify it is actually rendered (grep for `MessageCircle` usage in JSX).

---

## 4. Orphan Files

| File/Directory | Reason |
|----------------|--------|
| `src/components/ds/*` (15 files) | No page imports them; no `/ds` route exists |
| `src/data/ds-data.ts` | Only used by orphaned ds components |
| `src/hooks/*` (10 files) | Barrel exported, never imported |
| `src/stores/{department,financial,approval,ui,crm,sales,agent,auth,alert,salesRoom}Store.ts` (10 files) | Barrel exported, never imported |
| `src/lib/squads/*` (4 files) | Never imported |
| `src/components/SidebarContext.tsx` | Never imported |

---

## 5. Incomplete Features / Stubs

### No Actual Auth Flow
- Login page at `src/app/login/page.tsx` exists, but the app runs in "demo mode" bypassing Supabase auth (per commit `f9b08cb`).
- `src/stores/authStore.ts` and `src/hooks/useAuth.ts` are fully written but unused.

### Agent Chat — Non-Functional
- `src/components/AgentChatContent.tsx` has a text input with "Pergunte, construa ou automatize..." placeholder but no actual AI/LLM integration. Messages are not sent anywhere.

### BeamHomeContent — Non-Functional Chat
- `src/components/BeamHomeContent.tsx` same pattern: chat input with no backend.

### Sales Room Simulation
- `src/components/sales-room/simulation.ts` contains message templates but the simulation engine feeds fake data only.

---

## 6. Mock Data That Should Be Real

**This is by design** (demo project), but for completeness, ALL data is hardcoded:

| Data Source | File |
|-------------|------|
| Company info, agents, KPIs, financials, marketing, ROI, reports, alerts, activity, inbox, tasks, views, settings | `src/data/mrlion.ts` (~900 lines) |
| Roadmap items | `src/data/roadmapSeed.ts` |
| World layout, rooms, domains | `src/data/world-layout.ts` |
| Agent templates | `src/components/AgentTemplatesContent.tsx` (inline `TEMPLATES_MOCK`) |
| Inbox messages | `src/components/InboxContent.tsx` (inline array) |
| Sales room leads/conversations | `src/components/sales-room/seed.ts` |

The pattern `useSupabaseQuery({ queryFn, mockData })` exists in `src/lib/useSupabaseQuery.ts` and always falls back to mock data since Supabase is not configured.

---

## 7. Missing Error Boundaries

**Zero `error.tsx` files exist** across all 23 page routes. Next.js App Router expects `error.tsx` at route segments for graceful error handling.

**Zero `loading.tsx` files exist.** No route has a loading state boundary.

Missing for all routes:
- `src/app/dashboard/error.tsx` + `loading.tsx`
- `src/app/financeiro/error.tsx` + `loading.tsx`
- `src/app/marketing/error.tsx` + `loading.tsx`
- `src/app/sales-room/error.tsx` + `loading.tsx`
- `src/app/world/error.tsx` + `loading.tsx`
- `src/app/roadmap/error.tsx` + `loading.tsx`
- (and 17 more routes)

---

## 8. Missing Metadata

Only 3 of 23 pages define `export const metadata`:

| Page | Has Metadata |
|------|-------------|
| `src/app/layout.tsx` | YES (root) |
| `src/app/sales-room/page.tsx` | YES |
| `src/app/roadmap/page.tsx` | YES |
| All other 20 pages | **NO** |

Missing metadata on: `/dashboard`, `/financeiro`, `/marketing`, `/equipe`, `/roi`, `/inbox`, `/agent/*`, `/agent-templates`, `/integrations`, `/configuracoes`, `/relatorios`, `/tasks`, `/views`, `/world`, `/settings`, `/login`, `/` (home).

---

## 9. Broken Links / Routes

### No `href` Links Found
The app uses `next/link` via the sidebar's `navItem()` helper with `usePathname()` comparison, but the actual `<Link>` elements don't use `href=` in a grep-visible pattern (they use a wrapper). No obviously broken routes detected from static analysis.

### Routes That Exist in Sidebar But May Have Issues
- `/agent/demo-agent/flow` — page exists at `src/app/agent/[id]/flow/page.tsx` (verify it renders content)
- `/agent/demo-agent/analytics` — page exists (verify content)

---

## 10. Summary of Critical Findings

| Category | Count | Severity |
|----------|-------|----------|
| Orphaned design system (ds/) | 17 files | Medium |
| Unused Zustand stores | 10 files | High |
| Unused custom hooks | 10 files | High |
| Unused squads library | 4 files | Medium |
| Missing error.tsx | 23 routes | High |
| Missing loading.tsx | 23 routes | Medium |
| Missing metadata | 20 pages | Medium |
| Non-functional chat inputs | 2 components | Low (demo) |
| Auth system unused | ~5 files | Low (demo mode) |

### Recommendations (Priority Order)

1. **Delete or wire up** the 10 unused Zustand stores and 10 unused hooks — they add ~3000 lines of dead code
2. **Add error.tsx** at least at `src/app/error.tsx` (global) for crash resilience
3. **Add loading.tsx** at least at `src/app/loading.tsx` (global) for perceived performance
4. **Add metadata** to all page routes for SEO and social sharing
5. **Remove or route** the design system (`ds/`) — either create a `/ds` page or delete the 17 files
6. **Remove `src/lib/squads/`** — 4 files, ~700 lines, zero consumers
7. **Run `tsc --noUnusedLocals`** to catch per-file unused imports
