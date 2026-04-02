export const NAV_LINKS = [
  { label: "Tokens", href: "#tokens" },
  { label: "Typography", href: "#typography" },
  { label: "Colors", href: "#colors" },
  { label: "Components", href: "#components" },
  { label: "Patterns", href: "#patterns" },
  { label: "Elevation", href: "#elevation" },
  { label: "Radius", href: "#radius" },
  { label: "Glass", href: "#glass" },
  { label: "Effects", href: "#effects" },
  { label: "Motion", href: "#motion" },
  { label: "Sidebar", href: "#sidebar" },
];

export interface ColorGroupItem {
  name: string;
  value: string;
  bg: string;
  glow?: string;
  border?: boolean;
}

export interface ColorGroup {
  title: string;
  items: ColorGroupItem[];
}

export const COLOR_GROUPS: ColorGroup[] = [
  {
    title: "Text Hierarchy",
    items: [
      { name: "Primary", value: "white/95%", bg: "rgba(255,255,255,0.95)" },
      { name: "Secondary", value: "white/80%", bg: "rgba(255,255,255,0.80)" },
      { name: "Muted", value: "white/60%", bg: "rgba(255,255,255,0.60)" },
      { name: "Disabled", value: "white/40%", bg: "rgba(255,255,255,0.40)" },
    ],
  },
  {
    title: "Backgrounds",
    items: [
      { name: "Base", value: "#000", bg: "#000000", border: true },
      { name: "Surface", value: "white/3%", bg: "rgba(255,255,255,0.03)", border: true },
      { name: "Card", value: "white/5%", bg: "rgba(255,255,255,0.05)", border: true },
      { name: "Elevated", value: "white/8%", bg: "rgba(255,255,255,0.08)", border: true },
      { name: "Overlay", value: "white/12%", bg: "rgba(255,255,255,0.12)", border: true },
    ],
  },
  {
    title: "Brand",
    items: [
      { name: "Green", value: "var(--kairus-green)", bg: "var(--kairus-green)", glow: "rgba(64,255,213,0.4)" },
      { name: "Blue", value: "var(--kairus-blue)", bg: "var(--kairus-blue)", glow: "rgba(74,158,255,0.4)" },
      { name: "Purple", value: "var(--kairus-purple)", bg: "var(--kairus-purple)", glow: "rgba(171,83,255,0.4)" },
    ],
  },
  {
    title: "Semantic",
    items: [
      { name: "Success", value: "var(--color-success)", bg: "var(--color-success)" },
      { name: "Danger", value: "var(--color-danger)", bg: "var(--color-danger)" },
      { name: "Warning", value: "var(--color-warning)", bg: "var(--color-warning)" },
      { name: "Info", value: "var(--color-info)", bg: "var(--color-info)" },
    ],
  },
];

export const CARDS_DATA = [
  { badge: "Core", badgeVariant: "green" as const, title: "Orquestração", desc: "Motor central que coordena agentes, workflows e tasks em sequência ou paralelo." },
  { badge: "Framework", badgeVariant: "blue" as const, title: "Agentes", desc: "Personas especializadas com escopo, autoridade e comandos próprios para cada domínio." },
  { badge: "Automation", badgeVariant: "purple" as const, title: "Workflows", desc: "Pipelines multi-fase que encadeiam tasks, quality gates e handoffs entre agentes." },
  { badge: "Teams", badgeVariant: "default" as const, title: "Squads", desc: "Coleções temáticas de agentes que operam como unidades especializadas de trabalho." },
];

export const BADGE_VARIANTS = {
  green: "bg-kairus-green/15 text-kairus-green",
  blue: "bg-kairus-blue/15 text-kairus-blue",
  purple: "bg-kairus-purple/15 text-kairus-purple",
  default: "bg-white/10 text-white/60",
} as const;

export const SPACING_SCALE = [
  { px: 4, label: "4px" }, { px: 8, label: "8px" }, { px: 12, label: "12px" },
  { px: 16, label: "16px" }, { px: 24, label: "24px" }, { px: 32, label: "32px" },
  { px: 48, label: "48px" }, { px: 64, label: "64px" }, { px: 96, label: "96px" },
];

export const TOKENS_DATA = [
  { name: "--background", value: "#000000", note: "Pure black canvas" },
  { name: "--foreground", value: "oklch(0.985 0 0)", note: "Primary text" },
  { name: "--card", value: "oklch(1 0 0 / 5%)", note: "Card surface" },
  { name: "--border", value: "oklch(1 0 0 / 10%)", note: "Default border" },
  { name: "--accent", value: "oklch(0.7 0.15 250)", note: "Interactive accent" },
  { name: "--destructive", value: "oklch(0.704 0.191 22.216)", note: "Danger actions" },
  { name: "--muted-foreground", value: "oklch(1 0 0 / 50%)", note: "Secondary text" },
  { name: "--kairus-green", value: "#40FFD5", note: "Brand primary" },
  { name: "--kairus-blue", value: "#4A9EFF", note: "Brand secondary" },
  { name: "--kairus-purple", value: "#AB53FF", note: "Brand tertiary" },
  { name: "--radius", value: "0.625rem (10px)", note: "Base radius token" },
  { name: "--font-sans", value: "Inter", note: "All UI text" },
  { name: "--font-mono", value: "JetBrains Mono", note: "Code & specs" },
];
