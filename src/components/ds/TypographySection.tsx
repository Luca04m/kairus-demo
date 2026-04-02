import { Section } from "@/components/ds/Section";

const TYPESCALE = [
  { label: "Hero — Inter 600 / 48px / -1.24px / 1.08", className: "gradient-text", tokenFont: "var(--text-hero)", tokenTracking: "var(--tracking-hero)", text: "Orquestrar é simples" },
  { label: "H2 — Inter 600 / 31px / -0.875px / 1.2", className: "text-white/90", tokenFont: "var(--text-h2)", tokenTracking: "var(--tracking-h2)", text: "Agentes inteligentes" },
  { label: "H3 — Inter 500 / 24px / -0.24px / 1.2", className: "text-white/90", tokenFont: "var(--text-h3)", tokenTracking: "var(--tracking-h3)", text: "Workflows automatizados" },
  { label: "Body — Inter 400 / 16px / normal / 1.5", className: "text-white/80", tokenFont: "var(--text-body)", tokenTracking: undefined, text: "A Kairus orquestra agentes de IA para automatizar workflows complexos de desenvolvimento. Cada agente possui uma persona, escopo e autoridade definidos, garantindo execução precisa e coordenada de tarefas que envolvem múltiplos domínios." },
  { label: "Body Small — Inter 400 / 14px / -0.16px / 1.5", className: "text-white/80", tokenFont: "var(--text-body-sm)", tokenTracking: "var(--tracking-body-sm)", text: "Texto secundário com informações complementares sobre configuração e status dos agentes." },
  { label: "Label — Inter 500 / 13px / 0.14em / uppercase", className: "text-white/60", tokenFont: "var(--text-label)", tokenTracking: "var(--tracking-label)", text: "SECTION LABEL", uppercase: true },
  { label: "Caption — Inter 400 / 11px", className: "text-white/50", tokenFont: "var(--text-caption)", tokenTracking: undefined, text: "Última atualização: 01 Abr 2026 · v1.0.0 · Kairus OS" },
];

export function TypographySection() {
  return (
    <Section id="typography" label="Tokens" heading="Typography">
      <div className="flex flex-col gap-10">
        {TYPESCALE.map((item) => (
          <div key={item.label} className="border-b border-white/5 pb-8">
            <p className="text-xs text-white/50 mb-2 font-mono">{item.label}</p>
            <p className={item.className} style={{ font: item.tokenFont, letterSpacing: item.tokenTracking, textTransform: item.uppercase ? "uppercase" : undefined } as React.CSSProperties}>{item.text}</p>
          </div>
        ))}
        <div>
          <p className="text-xs text-white/50 mb-2 font-mono">Mono — JetBrains Mono 400 / 14px</p>
          <p className="text-accent font-mono" style={{ font: "var(--text-body-sm)" }}>const agent = new KairusAgent()</p>
        </div>
      </div>
    </Section>
  );
}
