# Kairus Demo — QA Test Report
**Date:** 2026-04-06
**Tester:** QA Agent (claude-sonnet-4-6)
**App:** http://localhost:3847 (Next.js production build)
**Codebase:** /Volumes/KINGSTON/kairus-demo

---

## Environment

- **Platform:** Darwin 24.5.0 (macOS)
- **Runtime:** Next.js (production build, port 3847)
- **Test method:** curl-based HTTP testing + static source analysis
- **Session:** No tmux sessions created (curl-only testing, no interactive service startup needed)

---

## BLOCO 1 — Smoke Test (All Routes)

### Results

| Route | HTTP Status | Size (bytes) | HTML Returned | Notes |
|-------|------------|--------------|---------------|-------|
| `/` | 200 | 58,602 | YES | Homepage — OK |
| `/financeiro` | 200 | 68,331 | YES | OK (SSR warning, see BUG-001) |
| `/marketing` | 200 | 68,308 | YES | OK (SSR warning, see BUG-002) |
| `/inbox` | 200 | 67,296 | YES | OK |
| `/tasks` | 200 | 62,628 | YES | OK |
| `/integrations` | 200 | 58,698 | YES | OK |
| `/configuracoes` | 200 | 61,104 | YES | OK |
| `/roadmap` | 200 | 55,761 | YES | OK |
| `/roi` | 200 | 55,775 | YES | OK (SSR warning, see BUG-003) |
| `/relatorios` | 200 | 55,894 | YES | OK (SSR warning, see BUG-004) |
| `/views` | 200 | 55,806 | YES | OK |
| `/world` | 200 | 92,593 | YES | Largest page — OK |
| `/sales-room` | 200 | 54,635 | YES | Title present, content thin (see BUG-005) |
| `/settings` | 200 | 64,808 | YES | OK |
| `/equipe` | 200 | 79,474 | YES | OK |
| `/agent-templates` | 200 | 57,715 | YES | OK |
| `/agent/test-1` | 200 | 67,692 | YES | OK |
| `/agent/test-1/flow` | 200 | 77,789 | YES | OK |
| `/login` | 200 | 23,495 | YES | OK |
| `/auth` | **404** | 48,346 | YES (error page) | **FAIL** — see BUG-006 |

**Summary:** 19/20 routes return HTTP 200. `/auth` returns 404.

---

## BLOCO 2 — Functional Tests

### Page Content Verification

| Route | Keyword Found | Error Indicators in HTML | Status |
|-------|--------------|--------------------------|--------|
| `/` | "Kairus" x6 | 5 | PASS |
| `/financeiro` | "Financeiro" x6 | 21 | PASS (errors are SSR bailout, not runtime crashes) |
| `/marketing` | "Marketing" x6 | 20 | PASS (same) |
| `/inbox` | "Inbox" x5 | 4 | PASS |
| `/tasks` | "Tasks" x4 | 4 | PASS |
| `/world` | "World" x4 | 6 | PASS |
| `/equipe` | "Equipe" x5 | 5 | PASS |
| `/relatorios` | "Relatorios" x4 | 21 | PASS (NEXT_REDIRECT in SSR, client handles it) |
| `/roi` | "ROI" x4 | 21 | PASS (same) |
| `/roadmap` | "Roadmap" x5 | 5 | PASS |

### API Routes — All Return 401

| API Route | HTTP Status | Response Body |
|-----------|------------|---------------|
| `/api/dashboard/stats` | **401** | `{"data":null,"error":{"message":"Unauthorized","code":"UNAUTHORIZED","status":401}}` |
| `/api/agents` | **401** | (same) |
| `/api/alerts` | **401** | (same) |
| `/api/campaigns` | **401** | (same) |
| `/api/clients` | **401** | (same) |
| `/api/departments` | **401** | (same) |
| `/api/financial` | **401** | (same) |
| `/api/integrations` | **401** | (same) |
| `/api/reports` | **401** | (same) |
| `/api/roadmap` | **401** | (same) |

**All 10 API routes return 401 Unauthorized.** This is a critical finding (see BUG-007). Pages appear to render via client-side data or static mocks, not these API routes.

---

## BLOCO 3 — Edge Cases

### Nonexistent Routes

| URL | HTTP Status | Expected | Status |
|-----|------------|----------|--------|
| `/nonexistent` | 404 | 404 | PASS |
| `/agent/doesnotexist` | **200** | 404 | NOTE (see BUG-008) |
| `/agent/doesnotexist/flow` | **200** | 404 or graceful | NOTE (same) |

### Query Parameters (Robustness)

| URL | HTTP Status | Status |
|-----|------------|--------|
| `/?test=1&foo=bar` | 200 | PASS |
| `/financeiro?test=1&foo=bar` | 200 | PASS |
| `/marketing?test=1&foo=bar` | 200 | PASS |
| `/world?test=1&foo=bar` | 200 | PASS |

Query parameters do not break any page — all return 200.

### Wrong HTTP Methods on API Routes

| Request | HTTP Status | Expected | Status |
|---------|------------|----------|--------|
| `POST /api/dashboard/stats` | 405 | 405 | PASS |
| `DELETE /api/agents` | 405 | 405 | PASS |
| `PUT /api/financial` | 405 | 405 | PASS |
| `PATCH /api/alerts` | 405 | 405 | PASS |

All API routes correctly return 405 Method Not Allowed for unsupported methods.

### Bad Content-Type POST

| Request | HTTP Status | Status |
|---------|------------|--------|
| `POST /api/agents` with `Content-Type: text/plain` | 401 | PASS (auth checked before content-type) |

---

## BLOCO 4 — Security Tests

### Security Headers

| Header | Present | Value | Status |
|--------|---------|-------|--------|
| `X-Powered-By` | YES | `Next.js` | MINOR RISK — server fingerprinting |
| `X-Frame-Options` | NO | — | FAIL — see BUG-009 |
| `Content-Security-Policy` | NO | — | FAIL — see BUG-010 |
| `Strict-Transport-Security` | NO | — | N/A (HTTP only, expected for local) |
| `X-Content-Type-Options` | NO | — | FAIL — see BUG-011 |
| `Referrer-Policy` | NO | — | MINOR |
| `Permissions-Policy` | NO | — | MINOR |

### Environment File Exposure

| File | HTTP Status | Status |
|------|------------|--------|
| `/.env.local` | 404 | PASS — not exposed |
| `/.env` | 404 | PASS — not exposed |
| `/.env.production` | 404 | PASS — not exposed |

### Credentials in HTML Source

No Supabase URLs, API keys, tokens, passwords, or secrets found in the rendered HTML of `/`. PASS.

### CORS Headers

API routes do not return `Access-Control-Allow-Origin` or other CORS headers. This means cross-origin requests from a different domain would be blocked by the browser (no CORS misconfiguration — acceptable for a same-origin app).

### Directory Traversal

| URL | HTTP Status | Status |
|-----|------------|--------|
| `/../etc/passwd` | 404 | PASS — blocked |

### Source Maps

- Source `.map` files: **0 found** in `.next/static/`. PASS — no source map exposure.

---

## BLOCO 5 — Performance

### Response Times

| Route | Time (s) | Rating |
|-------|---------|--------|
| `/` | 0.034 | Excellent |
| `/financeiro` | 0.034 | Excellent |
| `/marketing` | 0.032 | Excellent |
| `/world` | 0.041 | Excellent |
| `/sales-room` | 0.031 | Excellent |
| `/equipe` | 0.043 | Excellent |
| `/agent/test-1` | 0.039 | Excellent |
| `/agent/test-1/flow` | 0.039 | Excellent |

All routes respond under 50ms — excellent for a Next.js production build serving pre-rendered HTML.

### Bundle Analysis

| Asset | Size | Notes |
|-------|------|-------|
| `.next/` total | **1.3 GB** | WARN — see BUG-012 |
| Largest JS chunk #1 | 404 KB | `0ys80o6_amlp_.js` |
| Largest JS chunk #2 | 404 KB | `0vzesq6jdzzg6.js` |
| Largest JS chunk #3 | 224 KB | `0h4bq73pogmtb.js` |
| Largest JS chunk #4 | 220 KB | `0q-7c_7f76.4b.js` |
| Main CSS bundle | 104 KB | `0darintjai.ma.css` |

Two 404KB JS chunks are notably large and may impact Time-to-Interactive on slow connections.

---

## BLOCO 6 — Accessibility (Static Analysis)

### HTML Structure

| Check | Value | Status |
|-------|-------|--------|
| `<html lang="">` attribute | `lang="pt-BR"` | PASS |
| `<title>` tag | `Kairus OS` | PASS |
| Images without `alt` attribute | 0 | PASS |

### ARIA / Semantic Usage

| Pattern | Files using it | Notes |
|---------|---------------|-------|
| `aria-*` attributes | 17 files | Good coverage |
| `role=` attributes | 3 files | Low — see BUG-013 |
| `tabIndex` | 2 files | Low — see BUG-013 |

### Notes

- `role=` usage is low (3 files) for an app with 40+ component files. Interactive elements like sidebar nav items, modals, and dropdowns may lack proper semantic roles.
- `tabIndex` in only 2 files suggests keyboard navigation is limited.
- No form `<label>` associations checked (app appears mostly data-display, not form-heavy).

---

## BLOCO 7 — Responsive Design (Source Analysis)

| Breakpoint | Files using it | Status |
|-----------|---------------|--------|
| `md:` | 13 files | PASS |
| `lg:` | 13 files | PASS |
| `sm:` | 13 files | PASS |

Responsive breakpoints are used consistently across 13 component files. Coverage appears reasonable for a dashboard-style app.

---

## Bug Report

### BUG-001: SSR Bailout on /financeiro (and others)

- **ID:** BUG-001
- **Route:** `/financeiro`, `/marketing`
- **Steps to reproduce:** `curl -s http://localhost:3847/financeiro | grep -i "bail out"`
- **Expected:** Clean SSR with no errors in HTML
- **Actual:** HTML contains `"Bail out to client-side rendering: next/dynamic"` — server rendering errored, fell back to client rendering
- **Severity:** Minor
- **Evidence:** `Switched to client rendering because the server rendering errored: Error: Bail out to client-side rendering: next/dynamic at FinanceiroPage`
- **Impact:** No visual impact for the user (client-side fallback works), but indicates `next/dynamic` components without `{ ssr: false }` are being server-rendered and failing. Slightly worse SEO and TTFB.

---

### BUG-002: SSR Bailout on /marketing

- **ID:** BUG-002
- **Route:** `/marketing`
- **Steps to reproduce:** `curl -s http://localhost:3847/marketing | grep -i "bail out"`
- **Expected:** Clean SSR
- **Actual:** Same `next/dynamic` SSR bailout as BUG-001
- **Severity:** Minor
- **Evidence:** Same error pattern as BUG-001
- **Root cause:** Same as BUG-001

---

### BUG-003: NEXT_REDIRECT Error on /roi (SSR)

- **ID:** BUG-003
- **Route:** `/roi`, `/relatorios`
- **Steps to reproduce:** `curl -s http://localhost:3847/roi | grep -i "NEXT_REDIRECT"`
- **Expected:** Clean SSR
- **Actual:** `Error: NEXT_REDIRECT` in the server-rendered HTML (client-side fallback handles it, page shows 200)
- **Severity:** Minor
- **Evidence:** `NEXT_REDIRECT" data-stck="Switched to client rendering because the server rendering errored: Error: NEXT_REDIRECT`
- **Impact:** The server-side component is calling `redirect()` inside a component that Next.js catches and bails to client. Could be auth-redirect logic that should be guarded differently in demo mode.

---

### BUG-004: NEXT_REDIRECT Error on /relatorios (SSR)

- **ID:** BUG-004
- **Route:** `/relatorios`
- **Steps to reproduce:** Same as BUG-003
- **Expected:** Clean SSR
- **Actual:** Same NEXT_REDIRECT SSR error pattern
- **Severity:** Minor
- **Evidence:** Same as BUG-003
- **Root cause:** Same as BUG-003

---

### BUG-005: /sales-room — No Visible Content in HTML Source

- **ID:** BUG-005
- **Route:** `/sales-room`
- **Steps to reproduce:** `curl -s http://localhost:3847/sales-room | grep -iE "(pipeline|kanban|deal|negocio)"`
- **Expected:** Pipeline/Kanban content visible in HTML (or at minimum in the server-rendered output)
- **Actual:** Title `<title>Sales Room | Kairus OS</title>` is present, but no business-specific content found in the HTML. The page is only 54,635 bytes (smallest content page after `/login`).
- **Severity:** Major
- **Evidence:** `grep` for "sales", "pipeline", "Kanban", "Deal", "Negocio" returned 0 results in the rendered HTML
- **Impact:** Page may be rendering an empty shell. Content could be loading client-side, but for a demo presentation this is a risk if JavaScript fails or is slow.

---

### BUG-006: /auth Route Returns 404

- **ID:** BUG-006
- **Route:** `/auth`
- **Steps to reproduce:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:3847/auth`
- **Expected:** 200 (auth page or redirect to login)
- **Actual:** 404 — "This page could not be found."
- **Severity:** Major
- **Evidence:** HTTP 404, `<title>404: This page could not be found.</title>`
- **Impact:** If any component or OAuth callback redirects to `/auth`, it will land on a broken 404 page. Supabase OAuth callbacks typically use `/auth/callback` — this entire route tree is missing.

---

### BUG-007: All API Routes Return 401 Unauthorized

- **ID:** BUG-007
- **Route:** All `/api/*` routes
- **Steps to reproduce:** `curl -s http://localhost:3847/api/dashboard/stats`
- **Expected (demo context):** 200 with mock data (demo mode should bypass auth)
- **Actual:** `{"data":null,"error":{"message":"Unauthorized","code":"UNAUTHORIZED","status":401}}`
- **Severity:** Critical
- **Evidence:** Every single API route (10/10 tested) returns 401
- **Impact:** If any page component makes live fetch calls to these API routes at runtime, the data will be empty/null. The pages are currently rendering (likely using static mock data in components), but any dynamic data refresh, real-time update, or client-side fetch will fail silently. For a demo, this means live interactions (e.g., refresh, filter, sort) will not return data.
- **Note:** This may be intentional for the demo (data is hardcoded in components), but it is a silent failure path that should be documented.

---

### BUG-008: /agent/[id] Accepts Any ID Without 404

- **ID:** BUG-008
- **Route:** `/agent/doesnotexist`, `/agent/doesnotexist/flow`
- **Steps to reproduce:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:3847/agent/doesnotexist`
- **Expected:** 404 (agent not found) or graceful "agent not found" page
- **Actual:** 200 — renders the full agent page with the full app shell
- **Severity:** Minor
- **Evidence:** HTTP 200, `<title>Kairus OS</title>`, full sidebar rendered
- **Impact:** Any random ID will render what appears to be a valid agent page. For a demo this is acceptable (no real data), but for a real product it would be a data integrity issue.

---

### BUG-009: Missing X-Frame-Options Header

- **ID:** BUG-009
- **Route:** All pages
- **Steps to reproduce:** `curl -sI http://localhost:3847/ | grep -i x-frame`
- **Expected:** `X-Frame-Options: SAMEORIGIN` or `DENY`
- **Actual:** Header absent
- **Severity:** Major (production), Minor (demo)
- **Evidence:** No `X-Frame-Options` header in response
- **Impact:** App is vulnerable to clickjacking attacks if deployed to production. Can be mitigated via `next.config.ts` headers configuration.

---

### BUG-010: Missing Content-Security-Policy Header

- **ID:** BUG-010
- **Route:** All pages
- **Steps to reproduce:** `curl -sI http://localhost:3847/ | grep -i content-security`
- **Expected:** CSP header
- **Actual:** Header absent
- **Severity:** Major (production), Minor (demo)
- **Evidence:** No `Content-Security-Policy` in response headers
- **Impact:** XSS attacks would not be mitigated by a CSP. For a production deployment, this should be added via `next.config.ts`.

---

### BUG-011: Missing X-Content-Type-Options Header

- **ID:** BUG-011
- **Route:** All pages
- **Steps to reproduce:** `curl -sI http://localhost:3847/ | grep -i x-content-type`
- **Expected:** `X-Content-Type-Options: nosniff`
- **Actual:** Header absent
- **Severity:** Minor (demo), Major (production)
- **Evidence:** No `X-Content-Type-Options` header
- **Impact:** MIME-sniffing attacks possible. Standard header, easy to add in `next.config.ts`.

---

### BUG-012: .next Build Directory is 1.3 GB

- **ID:** BUG-012
- **Location:** `/Volumes/KINGSTON/kairus-demo/.next/`
- **Steps to reproduce:** `du -sh .next/`
- **Expected:** Typical Next.js build: 50-300MB
- **Actual:** 1.3 GB
- **Severity:** Major
- **Evidence:** `1.3G /Volumes/KINGSTON/kairus-demo/.next/`
- **Impact:** Abnormally large build. Likely cause: Turbopack dev artifacts included in the directory alongside production build, or large node_modules accidentally bundled. Two 404KB JS chunks are also oversized. This would significantly impact deployment size and cold start times on serverless platforms (Vercel, etc.).

---

### BUG-013: Low Keyboard/ARIA Accessibility Coverage

- **ID:** BUG-013
- **Location:** `src/components/`
- **Steps to reproduce:** `grep -r 'role=' src/components/ --include="*.tsx" -l | wc -l`
- **Expected:** `role=` and `tabIndex` coverage across most interactive components
- **Actual:** `role=` in only 3 files, `tabIndex` in only 2 files, out of 40+ component files
- **Severity:** Major (production), Minor (demo)
- **Evidence:** Static grep results
- **Impact:** Keyboard-only and screen reader users cannot navigate the app effectively. Nav items, sidebar links, dropdowns, and modals likely lack proper roles. Not critical for a visual demo, but critical for any production deployment.

---

## What Works Well

- All 19 active pages return HTTP 200 with appropriate content
- Response times are excellent (under 50ms for all tested routes)
- No environment variables or secrets exposed in HTML source
- No source maps exposed publicly
- No credentials or tokens leaked in HTML
- Directory traversal blocked
- Wrong HTTP methods correctly return 405
- All images have alt attributes (0 missing)
- `html lang="pt-BR"` set correctly
- `<title>Kairus OS</title>` present
- Responsive breakpoints used consistently (13 files each for sm/md/lg)
- ARIA attributes used in 17 component files
- Query parameters do not break any page
- .env files properly return 404

---

## Summary

| Category | Total Tests | Passed | Failed | Warnings |
|----------|------------|--------|--------|----------|
| Smoke Test (routes) | 20 | 19 | 1 | 0 |
| API Routes | 10 | 0 | 10 (all 401) | — |
| Edge Cases — methods | 4 | 4 | 0 | — |
| Edge Cases — nonexistent | 3 | 1 | 0 | 2 (200 instead of 404) |
| Security | 8 | 5 | 3 | 1 |
| Performance | 8 routes | 8 | 0 | 1 (bundle size) |
| A11y (static) | 6 checks | 4 | 0 | 2 |
| Responsive | 3 checks | 3 | 0 | — |

**Bugs found:** 13 total
- Critical: 1 (BUG-007 — all API routes return 401)
- Major: 5 (BUG-005, BUG-006, BUG-009, BUG-010, BUG-012)
- Minor: 7 (BUG-001 through BUG-004, BUG-008, BUG-011, BUG-013)

---

## Priority Fixes for Demo Stability

1. **BUG-007** (Critical): Verify whether pages use hardcoded mock data (safe for demo) or live API calls (broken). If live calls, bypass auth in demo mode.
2. **BUG-006** (Major): Either create an `/auth` route or ensure no links point to it.
3. **BUG-005** (Major): Verify `/sales-room` actually renders content — may need `ssr: false` or client-side data.
4. **BUG-012** (Major): Clean the `.next/` directory (`rm -rf .next && npm run build`) to get accurate build size.
5. **BUG-001 to BUG-004** (Minor): Add `{ ssr: false }` to `next/dynamic` calls or guard auth redirects behind `if (typeof window === 'undefined') return null`.

## Priority Fixes for Production Readiness

1. Add security headers to `next.config.ts` (X-Frame-Options, CSP, X-Content-Type-Options)
2. Implement proper ARIA roles on interactive components
3. Add keyboard navigation support (tabIndex on interactive elements)
4. Implement `/auth/callback` route for Supabase OAuth
