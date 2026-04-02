import { Section } from "@/components/ds/Section";
import { TOKENS_DATA } from "@/data/ds-data";

export function TokensSection() {
  return (
    <Section id="tokens" label="Tokens" heading="Design Tokens" first>
      <div className="glass-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-white/50">Token</th>
              <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-white/50 hidden sm:table-cell">Value</th>
              <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-white/50 hidden md:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS_DATA.map((t, i) => (
              <tr key={t.name} className={i !== 0 ? "border-t border-white/5" : ""}>
                <td className="px-6 py-4"><code className="text-accent text-xs font-mono">{t.name}</code></td>
                <td className="px-6 py-4 hidden sm:table-cell"><code className="text-white/50 text-xs font-mono">{t.value}</code></td>
                <td className="px-6 py-4 text-white/50 text-xs hidden md:table-cell">{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
