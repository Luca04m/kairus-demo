<objective>
Elevar o Kairus Design System de score 62/100 para nível Apple (85+).
Este projeto é um design system showcase em Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui.
O projeto roda em /Volumes/KINGSTON/repos/website-cloner/.
Há 7 domínios de trabalho abaixo. Execute TODOS — sem exceção, sem pular nenhum item.
Ao final, CADA arquivo modificado DEVE passar typecheck e lint. O dev server DEVE continuar funcionando.
</objective>

<context>
Stack: Next.js 16.2.1, React 19.2.4, Tailwind CSS 4, shadcn/ui (base-nova), motion/react, CVA, Lucide icons.
Arquivos-chave para ler ANTES de começar:
- src/app/globals.css (tokens, glass classes, keyframes, reduced-motion)
- src/app/page.tsx (page principal — 14 seções)
- src/app/layout.tsx (fonts, metadata, dark class)
- src/components/ds/*.tsx (16 componentes de showcase)
- src/components/ui/button.tsx (único componente shadcn existente)
- src/data/ds-data.ts (dados e tipos)
- src/lib/utils.ts (cn utility)

Leia TODOS esses arquivos antes de fazer qualquer modificação.
Imports DEVEM usar alias @/ (absolute imports). Nunca usar imports relativos como ../../.
</context>

<requirements>

## 1. TOKEN CONSOLIDATION (globals.css)

### 1a. Migrar brand colors de hex para oklch
Atualmente em :root e .dark, as brand colors usam hex:
```
--kairus-green: #0DB88C;   → converter para oklch()
--kairus-blue: #2B7FE0;    → converter para oklch()
--kairus-purple: #8A3AD9;  → converter para oklch()
--color-success: #12B86A;  → converter para oklch()
--color-danger: #E03E3E;   → converter para oklch()
--color-warning: #D4AD04;  → converter para oklch()
--color-info: #2B7FE0;     → converter para oklch()
```
Fazer o mesmo para as versões .dark. Usar valores oklch perceptualmente equivalentes.

### 1b. Criar spacing tokens
Adicionar no @theme inline:
```
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-24: 96px;
```

### 1c. Criar elevation/shadow tokens
Adicionar como CSS custom properties em :root e .dark:
```
--shadow-xs: 0 1px 2px -1px rgba(0,0,0,0.3);
--shadow-sm: 0 2px 8px -2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 16px -4px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 32px -8px rgba(0,0,0,0.5);
--shadow-xl: 0 16px 48px -12px rgba(0,0,0,0.6);
--shadow-glow-green: 0 0 20px oklch(from var(--kairus-green) l c h / 0.3);
--shadow-glow-blue: 0 0 20px oklch(from var(--kairus-blue) l c h / 0.3);
--shadow-glow-purple: 0 0 20px oklch(from var(--kairus-purple) l c h / 0.3);
```

### 1d. Criar opacity tokens
Adicionar no :root:
```
--opacity-solid: 1;
--opacity-high: 0.95;
--opacity-medium: 0.7;
--opacity-low: 0.5;
--opacity-subtle: 0.4;
--opacity-ghost: 0.25;
--opacity-faint: 0.1;
```

### 1e. Criar motion/spring tokens
Adicionar no :root:
```
--spring-gentle: 200 20;
--spring-snappy: 400 17;
--spring-bouncy: 600 15;
--duration-micro: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
```

## 2. FLUID TYPOGRAPHY (globals.css)

Substituir os tokens de typography existentes (--text-hero, --text-h2, etc.) por versões com clamp():
```
--text-hero: 600 clamp(2.5rem, 5vw + 1rem, 4.5rem)/1.08 var(--font-inter), system-ui, sans-serif;
--text-h2: 600 clamp(1.5rem, 2.5vw + 0.5rem, 1.9375rem)/1.2 var(--font-inter), system-ui, sans-serif;
--text-h3: 500 clamp(1.25rem, 2vw + 0.25rem, 1.5rem)/1.2 var(--font-inter), system-ui, sans-serif;
```
Manter --text-body, --text-body-sm, --text-label, --text-caption como estão (não precisam de fluid).

Na Hero.tsx: remover `text-5xl md:text-7xl` e `tracking-[-3px]` hardcoded. Usar os tokens:
```tsx
style={{ font: 'var(--text-hero)', letterSpacing: 'var(--tracking-hero)' }}
```

Na Section.tsx: remover `text-3xl` do h2. Usar:
```tsx
style={{ font: 'var(--text-h2)', letterSpacing: 'var(--tracking-h2)' }}
```

## 3. COMPONENT LIBRARY (src/components/ui/)

Criar estes componentes seguindo o padrão CVA do Button existente. Cada componente DEVE:
- Usar @base-ui/react como primitive quando disponível (ou forwardRef se não)
- Usar CVA para variantes
- Usar cn() de @/lib/utils
- Exportar o componente E as variants
- Aceitar className como prop
- Ter data-slot attribute

### 3a. Card (src/components/ui/card.tsx)
```tsx
// Variantes: default (glass-card), elevated (glass), surface (glass-surface), ghost (glass-light)
// Sizes: sm (p-4 rounded-xl), default (p-6 rounded-2xl), lg (p-8 rounded-3xl)
// Subcomponentes: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// O glass effect DEVE vir dos CSS classes já existentes (.glass-card, .glass, etc.)
// Hover: border-color transition usando spring (via CSS transition já que é micro-feedback)
```

### 3b. Badge (src/components/ui/badge.tsx)
```tsx
// Variantes: default (bg-white/10 text-white/60), green, blue, purple, success, danger, warning
// Cada variant usa a brand color correspondente com 15% bg e cor no texto
// Sizes: sm (text-[10px] px-2 py-0.5), default (text-[11px] px-2.5 py-1)
// Opcional: dot prop — mostra um dot indicator colorido com glow
```

### 3c. Input (src/components/ui/input.tsx)
```tsx
// Base: glass-light, h-11, rounded-xl, border border-white/10, focus:border-white/25
// Sizes: sm (h-9 text-xs), default (h-11 text-sm), lg (h-12 text-base)
// States: default, error (border-danger), disabled (opacity-50)
// DEVE ter label associado via htmlFor (a11y)
```

### 3d. Select (src/components/ui/select.tsx)
```tsx
// Wrapper em torno de <select> nativo com styled container
// Base: glass-light, h-11, rounded-xl, com custom chevron SVG (não appearance-none sem arrow)
// Incluir um SVG chevron-down posicionado absolute à direita
// States: default, error, disabled
```

### 3e. Barrel export — Criar src/components/ui/index.ts
```tsx
export { Button, buttonVariants } from "./button"
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants } from "./card"
export { Badge, badgeVariants } from "./badge"
export { Input } from "./input"
export { Select } from "./select"
```

### 3f. Migrar ComponentsSection.tsx
Substituir TODOS os elementos inline por componentes reais:
- `<button className="inline-flex h-11...">Primary</button>` → `<Button>Primary</Button>`
- `<button className="glass-light...">Secondary</button>` → `<Button variant="outline">Secondary</Button>`
- `<button className="...text-white/60...">Ghost</button>` → `<Button variant="ghost">Ghost</Button>`
- `<button className="...bg-kairus-blue...">Accent</button>` → criar variant "accent" no Button se não existir, ou usar className
- `<button className="...bg-danger...">Destructive</button>` → `<Button variant="destructive">Destructive</Button>`
- Cards inline → `<Card>` com `<CardHeader>`, `<CardTitle>`, `<CardDescription>`
- Badges inline → `<Badge variant="green">Green</Badge>`
- Input inline → `<Input placeholder="Search agents..." />`
- Select inline → `<Select>` component

NÃO criar variantes que não existem no design — usar className override quando necessário.
O visual DEVE permanecer idêntico ao atual. Só muda a implementação, não a aparência.

## 4. SPRING MOTION EVERYWHERE

### 4a. Criar motion presets (src/lib/motion.ts)
```tsx
export const spring = {
  gentle: { type: "spring" as const, stiffness: 200, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 17 },
  bouncy: { type: "spring" as const, stiffness: 600, damping: 15 },
} as const

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: spring.gentle,
} as const

export const stagger = {
  container: { transition: { staggerChildren: 0.06 } },
  item: fadeInUp,
} as const
```

### 4b. Staggered scroll reveals em TODAS as seções
Modificar Section.tsx para aceitar uma prop `animated?: boolean` (default true).
Quando animated=true, o wrapper dos children usa motion.div com whileInView + stagger.
Cada seção em page.tsx fica automaticamente animada ao scroll.

Implementação em Section.tsx:
```tsx
"use client";
import { motion } from "motion/react";
import { spring, stagger } from "@/lib/motion";

export function Section({ id, label, heading, children, first, animated = true }: Props) {
  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated ? {
    initial: "initial",
    whileInView: "animate",
    viewport: { once: true, margin: "-100px" },
    variants: stagger.container,
  } : {};

  return (
    <section id={id} className={`py-24 md:py-32 ${first ? "" : "border-t border-white/5"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring.gentle}>
          <p className="text-sm font-medium tracking-widest uppercase text-white/25 mb-3">{label}</p>
          <h2 style={{ font: 'var(--text-h2)', letterSpacing: 'var(--tracking-h2)' }} className="gradient-text">{heading}</h2>
        </motion.div>
        <Wrapper {...wrapperProps}>
          {children}
        </Wrapper>
      </div>
    </section>
  );
}
```

### 4c. glass-card hover — migrar de CSS transition para spring
Em globals.css, REMOVER a transition da .glass-card:
```css
/* REMOVER esta linha da .glass-card: */
transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```
Substituir por uma transition mais curta apenas para border-color (micro-feedback < 100ms é OK em CSS):
```css
transition: border-color 0.15s ease, box-shadow 0.15s ease;
```
NOTA: Manter como CSS transition porque glass-card é usado em muitos lugares e wrapping todos em motion.div seria over-engineering. A regra spring aplica-se a INTERACTIVE elements (buttons, links), não a hover decorativo de cards.

### 4d. Hero CTAs com spring
Modificar Hero.tsx — tornar "use client" e wrapping os CTAs em motion.a:
```tsx
<motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy} ...>Explore Tokens</motion.a>
<motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy} ...>View Source</motion.a>
```

### 4e. FloatingNav links com spring
Os nav links no FloatingNav.tsx DEVEM ter micro-spring no hover. Adicionar:
```tsx
<motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring.snappy} ...>
```

### 4f. MotionSection.tsx — Atualizar para usar os presets
Importar os spring presets de @/lib/motion e usar em vez de inline:
```tsx
transition={spring.gentle}  // em vez de { type: "spring", stiffness: 300, damping: 24 }
transition={spring.snappy}  // em vez de { type: "spring", stiffness: 400, damping: 17 }
```

## 5. ACCESSIBILITY FIXES

### 5a. Contrast ratios
Em TODOS os componentes ds/*.tsx, substituir:
- `text-white/40` → `text-white/50` (minimum) nos textos que precisam ser legíveis
- `text-white/25` → `text-white/40` para labels de seção (Section.tsx label)
- MANTER `text-white/40` e `text-white/50` APENAS onde são decorativos (aria-hidden, bordas visuais)
- O objetivo: ratio mínimo 4.5:1 para text normal, 3:1 para large text (>= 18px bold ou >= 24px)

Verificar CADA instância e decidir: é texto legível ou decorativo? Se legível, garantir contraste.

### 5b. Botões com type="button"
Em ComponentsSection.tsx e GlassShowcaseSection.tsx, todos os `<button>` e `<motion.button>` que NÃO são submit DEVEM ter `type="button"` explícito.

### 5c. Focus trap no mobile nav
Em FloatingNav.tsx, quando mobileOpen=true:
- Adicionar onKeyDown handler no overlay div
- Escape fecha o menu: `if (e.key === 'Escape') setMobileOpen(false)`
- Adicionar focus trap básico: o primeiro e último item do menu devem cycle com Tab
- Implementação mínima: useEffect que foca o primeiro link quando abre, e onKeyDown no container

### 5d. Skip-to-content
Em layout.tsx, como primeiro filho do body (antes do {children}):
```tsx
<a href="#tokens" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg">
  Skip to content
</a>
```

### 5e. aria-current fix
Em FloatingNav.tsx, mudar `aria-current="true"` para `aria-current="page"` (semanticamente correto para nav).

### 5f. Select com custom arrow acessível
O novo Select component (item 3d) DEVE ter um SVG chevron visível, não apenas `appearance-none` sem indicador visual.

## 6. PERFORMANCE

### 6a. Tree-shake motion imports
Em MotionSection.tsx, trocar:
```tsx
import { motion } from "motion/react";
```
Por:
```tsx
import { m } from "motion/react";
```
E renomear todas as referências de `motion.div` → `m.div`, `motion.button` → `m.button`, etc.
Fazer o mesmo em TODOS os arquivos que importam motion (Section.tsx, Hero.tsx, FloatingNav.tsx).

NOTA: Verificar se `m` é exportado por `motion/react`. Se NÃO for (depende da versão), manter `motion` e adicionar um comentário: `// motion/react: m export not available in this version`.

### 6b. Hero image com sizes
Em Hero.tsx, adicionar `sizes` prop ao Image:
```tsx
<Image src="/kairus-logo.svg" alt="Kairus logo" width={120} height={120} sizes="120px" className="mb-2" priority />
```

### 6c. Lazy sections
As seções abaixo do fold (da 5a em diante: PatternsSection, ElevationSection, BorderRadiusSection, GlassShowcaseSection, EffectsSection, MotionSection, SidebarSection, Footer) DEVEM usar dynamic import com next/dynamic:

Em page.tsx:
```tsx
import dynamic from "next/dynamic";

// Eager (above fold)
import { FloatingNav, Hero, TokensSection, TypographySection, ColorsSection, ComponentsSection } from "@/components/ds";

// Lazy (below fold)
const PatternsSection = dynamic(() => import("@/components/ds/PatternsSection").then(m => ({ default: m.PatternsSection })));
const ElevationSection = dynamic(() => import("@/components/ds/ElevationSection").then(m => ({ default: m.ElevationSection })));
const BorderRadiusSection = dynamic(() => import("@/components/ds/BorderRadiusSection").then(m => ({ default: m.BorderRadiusSection })));
const GlassShowcaseSection = dynamic(() => import("@/components/ds/GlassShowcaseSection").then(m => ({ default: m.GlassShowcaseSection })));
const EffectsSection = dynamic(() => import("@/components/ds/EffectsSection").then(m => ({ default: m.EffectsSection })));
const MotionSection = dynamic(() => import("@/components/ds/MotionSection").then(m => ({ default: m.MotionSection })));
const SidebarSection = dynamic(() => import("@/components/ds/SidebarSection").then(m => ({ default: m.SidebarSection })));
const Footer = dynamic(() => import("@/components/ds/Footer").then(m => ({ default: m.Footer })));
```

NOTA: Para o dynamic import funcionar, cada componente lazy DEVE ter named export. Verificar que cada arquivo exporta `export function NomeSection()` (não default export). Se algum usar default, ajustar o import accordingly.

## 7. STRUCTURAL CLEANUP

### 7a. Barrel export de /components/ds
Verificar que src/components/ds/index.ts existe e exporta TODOS os 15 componentes. Se já existe, manter. Se não, criar.

### 7b. Data separation
Se src/data/ds-data.ts contém TIPOS e DADOS misturados:
- Mover interfaces/types para src/types/ds.ts
- Manter apenas dados em src/data/ds-data.ts
- Atualizar imports em todos os consumers

Se os tipos já estão separados ou são poucos (< 5 types), NÃO separar — não vale o churn.

</requirements>

<implementation>
ORDEM DE EXECUÇÃO (respeitar dependências):

1. Ler TODOS os arquivos listados em <context>
2. Token consolidation (globals.css) — itens 1a-1e
3. Fluid typography (globals.css + Hero.tsx + Section.tsx) — item 2
4. Motion presets (src/lib/motion.ts) — item 4a
5. Component library (src/components/ui/*) — itens 3a-3e
6. Section.tsx animated (depende de motion presets) — item 4b
7. Spring motion nos componentes (depende de motion presets) — itens 4c-4f
8. Migrar ComponentsSection para usar componentes reais — item 3f
9. A11y fixes — todos os itens 5
10. Performance — itens 6a-6c
11. Lazy loading em page.tsx — item 6c
12. Structural cleanup — itens 7a-7b

REGRAS INVIOLÁVEIS:
- NÃO mudar a aparência visual. O design DEVE permanecer idêntico ao atual.
- NÃO adicionar features que não existem no design atual.
- NÃO criar novos componentes além dos listados (Card, Badge, Input, Select).
- NÃO instalar novas dependências npm.
- NÃO modificar package.json, next.config.ts, postcss.config.mjs, ou components.json.
- NÃO tocar em arquivos que não foram mencionados neste prompt.
- Se uma instrução específica causar erro de TypeScript, adaptar a implementação para que funcione — mas manter a intenção original.
- Imports DEVEM usar @/ (absolute). Nunca ../ ou ./ para imports cross-directory.
</implementation>

<output>
Arquivos a CRIAR:
- src/lib/motion.ts (spring presets)
- src/components/ui/card.tsx
- src/components/ui/badge.tsx
- src/components/ui/input.tsx
- src/components/ui/select.tsx
- src/components/ui/index.ts (barrel)
- src/types/ds.ts (APENAS se types e data estão misturados em ds-data.ts)

Arquivos a MODIFICAR:
- src/app/globals.css (tokens: oklch, spacing, shadows, opacity, motion, fluid typography)
- src/app/layout.tsx (skip-to-content link)
- src/app/page.tsx (lazy imports para seções below-fold)
- src/components/ds/Section.tsx (animated prop, motion wrapper, fluid typography)
- src/components/ds/Hero.tsx ("use client", motion springs nos CTAs, fluid typography, Image sizes)
- src/components/ds/FloatingNav.tsx (spring nos links, focus trap, aria-current fix, Escape handler)
- src/components/ds/ComponentsSection.tsx (migrar para componentes reais, type="button")
- src/components/ds/GlassShowcaseSection.tsx (type="button")
- src/components/ds/MotionSection.tsx (usar presets de @/lib/motion, tree-shake)
- src/components/ds/ColorsSection.tsx (contrast fix se necessário)
- src/components/ds/index.ts (verificar completude)
- src/data/ds-data.ts (separar types se misturados)
</output>

<verification>
Após TODAS as modificações, executar nesta ordem:

1. `npx tsc --noEmit` — DEVE passar sem erros
2. `npm run lint` — DEVE passar (ou apenas warnings não-críticos)
3. `npm run build` — DEVE completar com sucesso
4. Verificar visualmente: abrir http://localhost:3001/ e confirmar que o layout, cores, e conteúdo estão idênticos ao original. Se o dev server não estiver rodando, iniciar com `npm run dev -- --port 3001`.

Se qualquer verificação falhar, corrigir o erro e re-verificar.
NÃO declarar completo até que TODAS as 4 verificações passem.
</verification>

<success_criteria>
- ZERO erros de TypeScript
- ZERO erros de lint críticos
- Build completa com sucesso
- 4 novos componentes UI (Card, Badge, Input, Select) com CVA + variants
- Barrel export funcional em /components/ui/index.ts
- TODAS as brand/semantic colors em oklch (zero hex em :root e .dark)
- Spring presets centralizados em /lib/motion.ts
- Scroll reveal animado em TODAS as seções via Section.tsx
- Spring motion em Hero CTAs e FloatingNav links
- Skip-to-content link no layout
- Focus trap no mobile nav
- Contrast ratios corrigidos (text-white/40 legível → text-white/50)
- Lazy loading para seções below-fold
- Visual IDÊNTICO ao original — nenhuma mudança perceptível na aparência
</success_criteria>
