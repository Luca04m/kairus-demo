# KAIRUS OS DEMO — CODE PATTERNS AUDIT REPORT
Generated: 2026-04-06

---

## 1. NAMING CONVENTIONS

### File Naming
- **Components**: PascalCase + Content suffix pattern
  - Examples: HomeContent.tsx, AgentAnalyticsContent.tsx, EquipeContent.tsx
  - Utilities: kebab-case (e.g., useSupabaseQuery.ts, LoadingSkeleton)
  - API routes: lowercase with [id] dynamic segments (route.ts pattern)
  - Design system folder: 'ds' with PascalCase components inside

### Component Naming
- React Functional Components: PascalCase (exported as default or named)
- Props interfaces: ComponentName + Props suffix (ErrorBoundaryProps)
- State interfaces: ComponentName + State suffix (ErrorBoundaryState)

### Variable & Function Naming
- camelCase for all variables, functions, constants
- Portuguese language used throughout (agentes, departamento, severidade, etc.)
- Type unions with underscores: "ativo" | "pausado" | "arquivado"
- Environment variables: NEXT_PUBLIC_ prefix (Supabase)
- Private methods: arrow functions with underscore prefix (handleReset)

### Constants & Enums
- Type literals: all lowercase with pipes (DepartmentDomain, AlertSeverity)
- Color maps: camelCase keys with object structure (kpiAccentColor, severidadeCor)
- Config objects: all lowercase and kebab-keys in string form ("critico", "alto")

---

## 2. COMPONENT PATTERNS

### Export Strategy
- **Default exports**: Most components (AppHeader, ErrorBoundary, HomeContent)
- **Named exports**: Utility components (getRouteTitle, SkeletonRow)
- **Barrel exports**: lib/squads/index.ts re-exports types and functions organized by domain

### Props Pattern
- Strongly typed with TypeScript interfaces
- Optional props use ? syntax with defaults in function signatures
- Children prop: children?: ReactNode in most containers
- Destructuring in function parameters

### Component Structure (Functional)
```typescript
"use client";

import { useCallback } from "react";
import { CONSTANTS } from "@/data/mrlion";
import { useSupabaseQuery } from "@/lib/useSupabaseQuery";

export function HomeContent() {
  const [data, setData] = useState();
  const { data: result, loading } = useSupabaseQuery({...});
  
  const fetchData = useCallback(async () => {...}, []);
  
  return <div>...</div>;
}
```

### Composition Patterns
- Custom hooks for data fetching (useSupabaseQuery)
- Wrapper components (ErrorBoundary as class component)
- Layout composition: AppHeader → Content containers
- Skeleton loaders as fallback UI during loading state

### Class Components
- ErrorBoundary extends Component<Props, State>
- Private arrow function methods for event handlers
- Error lifecycle: getDerivedStateFromError, componentDidCatch

---

## 3. STYLING PATTERNS

### Tailwind + Utilities
- **cn() utility**: clsx + tailwind-merge pattern
  ```typescript
  import { clsx, type ClassValue } from "clsx"
  import { twMerge } from "tailwind-merge"
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

### Color & Styling
- **RGBA-based theme**: rgba(255,255,255,0.X) for opacity tiers
  - Base: rgba(255,255,255,0.4) for secondary text
  - Subtle: rgba(255,255,255,0.05) for borders
  - Accent: rgba(255,255,255,0.08) for hover backgrounds
- **Hardcoded colors**: #22c55e, #6366f1, #ec4899, #f59e0b, #06b6d4
- **No CVA usage detected** — all classes inline

### Common Class Patterns
- **Glass cards**: rounded-xl p-5 with glass-card class (custom CSS)
- **Borders**: 1px solid [rgba(255,255,255,0.08)]
- **Transitions**: transition-colors/all duration-150
- **Flexbox layouts**: flex items-center justify-center gap-X
- **Responsive**: hidden sm:block, grid-cols-2 md:grid-cols-3 lg:grid-cols-5
- **Text hierarchy**: text-xs/sm/lg with text-white and rgba variants

### Glass/Gradient Effects
- Custom glass-card class (CSS defined elsewhere)
- Gradient overlays: background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))"
- Inline style gradients mixed with className

### Loading States
- **Skeleton components**: KpiGridSkeleton, AgentGridSkeleton, SkeletonRow
- **Conditional rendering**: {loading ? <Skeleton /> : <Content />}
- **Array.from() pattern** for generating skeletons: Array.from({ length: 5 })

---

## 4. UI PATTERNS

### shadcn/ui Usage
- Package included but minimal direct usage in sampled components
- Base-UI (@base-ui/react) preferred for primitive components

### Custom Components
- SkeletonRow: generic loading placeholder
- AppHeader: with badge, search, sign-out buttons
- AppSidebar: navigation with sections (Vendas, Financeiro, Sistema)
- LoadingSkeleton exports: KpiGridSkeleton, AgentGridSkeleton

### Layout Patterns
- **App Shell**: AppShellClient wraps main content with header/sidebar
- **Page structure**: Page component returns <AppHeader> + flex-1 overflow-auto <Content>
- **Card grids**: grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4
- **Sections**: Separated with border-t border-[rgba(255,255,255,0.06)]

### Data Display
- **Avatar circles**: h-7 w-7 with initials and dynamic background colors
- **Status indicators**: h-1.5 w-1.5 rounded-full with animation
- **Badges**: h-5 w-5 rounded-full flex items-center justify-center
- **Lists**: flex-col gap-3 for vertical stacking

---

## 5. ANIMATION PATTERNS

### Framer Motion (Predefined)
```typescript
// src/lib/motion.ts
export const spring = {
  gentle: { type: "spring", stiffness: 120, damping: 30 },
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 25 },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: spring.gentle,
}

export const stagger = {
  container: { transition: { staggerChildren: 0.04 } },
  item: fadeInUp,
}
```

### Inline Animations (CSS)
- Pulse animation on status dots: animation: "pulseSoft 1.6s ease-in-out infinite"
- Applied conditionally: style={isCritico ? { animation: "pulseSoft..." } : undefined}
- tw-animate-css package dependency for custom animations

### Animation Consistency
- Consistent spring parameters across all fade-in animations
- 0.04s stagger interval for list items
- Gentle damping (30) for smoothness
- No ad-hoc animation — all patterns predefined in motion.ts

---

## 6. ERROR HANDLING PATTERNS

### Error Boundary
```typescript
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State { ... }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }
}
```

### API Error Handling
- Try/catch with console.error logging
- Structured error response: { data: null, error: { message, code, status } }
- Type guards: isAuthError(result) checks instanceof NextResponse
- Fallback to mock data if API fails (useSupabaseQuery pattern)

### Supabase Errors
- Check error objects: if (error) { console.error(...); return errorResponse(...); }
- Custom error classes: SquadError, AgentError, DepartmentError with code + details
- Auth context returns NextResponse on error, client checks with isAuthError()

### Error UI
- Glass-card error modal with icon, message, retry button
- Fallback prop allows custom error UI
- Portuguese error message: "Algo deu errado"
- Graceful degradation to mock data

---

## 7. TYPESCRIPT PATTERNS

### Type Usage
- **interface for objects**: DepartmentRow, AgentRow, AuthContext
- **type for unions & literals**: DepartmentDomain, AgentStatus, AlertSeverity
- **Generic types**: UseSupabaseQueryOptions<TMock, TApi>
- **Utility types**: Awaited<ReturnType<...>>, Record<string, unknown>

### Strict Mode
- tsconfig.json: "strict": true
- All function parameters typed
- No implicit any detected
- Return types explicit on public functions

### Generics
- useSupabaseQuery<TMock, TApi = TMock> with optional transform
- Generic constraint patterns in lib/squads for reusable utilities
- Optional generic with default: TApi = TMock

### Type Inference
- type SquadWithAgents extends SquadRow — extending row types
- Exported type unions for domain inference (DOMAIN_SQUAD_MAP)
- Helper types: AgentWithRelations, DepartmentWithCounts

---

## 8. CODE ORGANIZATION

### Folder Structure
- src/components/ — page content components (AppHeader, HomeContent, etc.)
- src/components/ds/ — design system components
- src/components/roadmap/ — feature-specific components
- src/lib/api/ — auth helpers, error responses
- src/lib/supabase/ — Supabase client, middleware, server utilities
- src/lib/squads/ — business domain (types, agents, departments, realtime)
- src/app/ — Next.js App Router pages and API routes

### Barrel Exports
- lib/squads/index.ts: comprehensive re-export of types and functions
- Organized by domain: registry, agents, departments, realtime, seed
- Selective exports: types exported separately from implementations

### Co-located Tests
- No test files detected in sampled components
- No jest.config or test setup visible

### Shared Utils
- cn() utility in lib/utils.ts (clsx + tailwind-merge)
- useSupabaseQuery custom hook in lib/useSupabaseQuery.ts
- motion presets in lib/motion.ts
- API helpers in lib/api/auth.ts (getAuthContext, errorResponse, parsePagination)

### Supabase Abstraction
- lib/supabase/client.ts — client-side Supabase instance
- lib/supabase/server.ts — server-side Supabase instance
- Separate contexts for SSR and client rendering

---

## 9. RECURRING ANTI-PATTERNS & INCONSISTENCIES

### Detected Issues

1. **Inline RGBA colors**: Hardcoded rgba(255,255,255,0.X) throughout
   - Should be extracted to CSS variables or Tailwind theme config
   - Example: 40+ instances of rgba(255,255,255,0.4)
   - Recommendation: Create Tailwind color aliases

2. **Inline style objects**: Mixed style={{...}} with className
   - Example: background gradients, dynamic animations
   - Recommendation: Use CSS-in-JS or Tailwind plugins

3. **No CVA usage despite class-variance-authority dependency**
   - Variants defined inline, not centralized
   - Example: loading ? <Skeleton /> vs actual state-based variants
   - Recommendation: Implement CVA for button, card, and badge variants

4. **Mock data interspersed with API logic**
   - KPIS_VISAO_GERAL, ATIVIDADE_RECENTE constants mixed with fetch logic
   - Recommendation: Move to separate data/mocks.ts file

5. **Portuguese + English hybrid**
   - Portuguese variable names (departamento, severidade) mixed with English types
   - Exception: API responses use Portuguese keys
   - Recommendation: Standardize on domain language (Portuguese) or English

6. **Type unions as string literals**
   - Alert severity: "critico" | "alto" | "medio" | "baixo" | "info"
   - Recommendation: Consider enum for safer handling

7. **No global error boundary detected**
   - ErrorBoundary component exists but unclear if wrapping root layout
   - Recommendation: Wrap in layout.tsx

### Code Quality Wins

- Strong TypeScript adoption (strict mode enabled)
- Consistent naming conventions
- Custom hook abstraction for data fetching
- Graceful fallback pattern (mock data)
- Organized barrel exports in lib/squads
- Predefined motion/animation constants
- Class component error handling

---

## SUMMARY TABLE

| Pattern | Adoption | Consistency | Notes |
|---------|----------|-------------|-------|
| Naming (PascalCase components) | 100% | High | Consistent across sampled files |
| TypeScript (strict mode) | 100% | High | All parameters typed |
| Tailwind + cn() | 100% | High | Consistent utility usage |
| Custom hooks | 1 (useSupabaseQuery) | High | Could expand |
| Error classes | 3 (SquadError, etc.) | High | Domain-specific |
| Framer Motion | Predefined only | High | spring.ts constants reused |
| Glass aesthetics | 100% | High | rgba theme consistent |
| Barrel exports | In lib/squads | Partial | Not used elsewhere |
| Error Boundary | 1 component | Unclear | Placement unknown |
| Mock data fallback | 100% (in queries) | High | Robust pattern |

---

## RECOMMENDATIONS

1. **Extract RGBA theme** → Tailwind theme extend or CSS variables
2. **Implement CVA** for common components (Button, Card, Badge, Status)
3. **Consolidate mock data** → Separate data/mocks.ts file
4. **Add global error boundary** → Root layout wrapper
5. **Expand barrel exports** → Apply pattern to components/ui/, components/roadmap/
6. **Add test structure** → Co-located .test.tsx files near components
7. **Standardize language** → Choose either Portuguese or English, not hybrid
8. **Create animation registry** → Expand motion.ts with page-level animations
9. **Document glass-card** → Add CSS definition clarity
10. **Type enum consideration** → Replace string union types with TypeScript enums for safety

---

## FILES SAMPLED

- /src/components/AppHeader.tsx
- /src/components/AppSidebar.tsx
- /src/components/ErrorBoundary.tsx
- /src/components/HomeContent.tsx
- /src/lib/utils.ts
- /src/lib/motion.ts
- /src/lib/useSupabaseQuery.ts
- /src/lib/squads/types.ts
- /src/lib/squads/index.ts
- /src/lib/api/auth.ts
- /src/app/dashboard/page.tsx
- /src/app/api/agents/route.ts
- tsconfig.json
- package.json

**Total patterns analyzed**: 9 major categories, 50+ specific conventions identified
