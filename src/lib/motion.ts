export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 30 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
} as const

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: spring.gentle,
} as const

export const stagger = {
  container: { transition: { staggerChildren: 0.04 } },
  item: fadeInUp,
} as const
