"use client";
import { useTabState } from "@/hooks/useTabState";
import {
  Bell,
  Brain,
  Shield,
  Link2,
  CreditCard,
  ChevronDown,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";

// ─── Toggle Component ───────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      data-state={checked ? "checked" : "unchecked"}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[#22c55e]" : "bg-[rgba(255,255,255,0.12)]"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Styled Select ───────────────────────────────────────────────────────────

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none focus:border-[rgba(99,102,241,0.5)]"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)]"
      />
    </div>
  );
}

// ─── Row helpers ─────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.4)]">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-medium text-white">{label}</p>
      <StyledSelect value={value} onChange={onChange} options={options} />
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5">
      <h3 className="mb-5 text-sm font-semibold text-white">{title}</h3>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[rgba(255,255,255,0.06)]" />;
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "inteligencia", label: "Inteligência", icon: Brain },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "integracoes", label: "Integrações", icon: Link2 },
  { id: "plano", label: "Plano", icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Panels ──────────────────────────────────────────────────────────────────

function NotificacoesPanel() {
  const s = useSettingsStore();

  return (
    <SectionCard title="Preferências de notificação">
      <ToggleRow
        label="Notificações por email"
        description="Receba atualizações e alertas no seu e-mail"
        checked={s.notificacoesEmail}
        onChange={() => s.setSetting("notificacoesEmail", !s.notificacoesEmail)}
      />
      <Divider />
      <ToggleRow
        label="Notificações push"
        description="Notificações em tempo real no navegador"
        checked={s.notificacoesPush}
        onChange={() => s.setSetting("notificacoesPush", !s.notificacoesPush)}
      />
      <Divider />
      <ToggleRow
        label="Alertas críticos"
        description="Avisos imediatos sobre falhas ou anomalias"
        checked={s.alertasCriticos}
        onChange={() => s.setSetting("alertasCriticos", !s.alertasCriticos)}
      />
      <Divider />
      <ToggleRow
        label="Resumo diário"
        description="Resumo das atividades do dia às 18h"
        checked={s.resumoDiario}
        onChange={() => s.setSetting("resumoDiario", !s.resumoDiario)}
      />
      <Divider />
      <ToggleRow
        label="Relatórios semanais"
        description="Relatório consolidado toda segunda-feira"
        checked={s.relatoriosSemanais}
        onChange={() => s.setSetting("relatoriosSemanais", !s.relatoriosSemanais)}
      />
    </SectionCard>
  );
}

function InteligenciaPanel() {
  const s = useSettingsStore();

  return (
    <SectionCard title="Comportamento dos agentes">
      <SelectRow
        label="Nível de autonomia"
        value={s.autonomiaAgente}
        onChange={(v) => s.setSetting("autonomiaAgente", v)}
        options={["Conservador", "Moderado", "Agressivo"]}
      />
      <Divider />
      <ToggleRow
        label="Aprovação manual para ações críticas"
        description="Requer confirmação antes de executar ações irreversíveis"
        checked={s.aprovacaoManual}
        onChange={() => s.setSetting("aprovacaoManual", !s.aprovacaoManual)}
      />
      <Divider />
      <ToggleRow
        label="Aprendizado contínuo"
        description="Agentes aprendem com feedback e histórico de decisões"
        checked={s.aprendizadoContinuo}
        onChange={() => s.setSetting("aprendizadoContinuo", !s.aprendizadoContinuo)}
      />
      <Divider />
      <SelectRow
        label="Idioma de comunicação"
        value={s.idioma}
        onChange={(v) => s.setSetting("idioma", v)}
        options={["Português (BR)", "English", "Español"]}
      />
    </SectionCard>
  );
}

function SegurancaPanel() {
  const s = useSettingsStore();

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Autenticação e acesso">
        <ToggleRow
          label="Autenticação de dois fatores"
          description="Adicione uma camada extra de segurança à sua conta"
          checked={s.doisFatores}
          onChange={() => s.setSetting("doisFatores", !s.doisFatores)}
        />
        <Divider />
        <ToggleRow
          label="Log de auditoria"
          description="Registre todas as ações realizadas na plataforma"
          checked={s.logAuditoria}
          onChange={() => s.setSetting("logAuditoria", !s.logAuditoria)}
        />
      </SectionCard>

      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Gerenciar acessos</p>
            <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.4)]">
              Controle permissões de usuários e tokens de API
            </p>
          </div>
          <div className="relative group">
            <button
              disabled
              className="rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-medium text-[rgba(255,255,255,0.5)] cursor-not-allowed"
            >
              Gerenciar acessos
            </button>
            <span className="pointer-events-none absolute right-0 top-full mt-1 z-10 whitespace-nowrap rounded-md bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] px-2 py-1 text-xs text-[rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              Disponível em breve
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const INTEGRATIONS = [
  { name: "Meta Ads", status: "Conectado", color: "green" },
  { name: "Shopify", status: "Conectado", color: "green" },
  { name: "WhatsApp", status: "Conectado", color: "green" },
  { name: "Google Analytics", status: "Pendente", color: "amber" },
] as const;

function IntegracoesPanel() {
  return (
    <SectionCard title="Conexões ativas">
      {INTEGRATIONS.map((item, i) => (
        <div key={item.name}>
          {i > 0 && <Divider />}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)]">
                <Link2 size={15} className="text-[rgba(255,255,255,0.5)]" />
              </div>
              <p className="text-sm font-medium text-white">{item.name}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                item.color === "green"
                  ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e]"
                  : "bg-[rgba(245,158,11,0.12)] text-[#f59e0b]"
              }`}
            >
              {item.color === "green" ? (
                <CheckCircle2 size={11} />
              ) : (
                <Clock size={11} />
              )}
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

function PlanoPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white">Plano atual</h3>
          <span className="inline-flex items-center rounded-full bg-[rgba(99,102,241,0.15)] px-3 py-1 text-xs font-semibold text-[#818cf8]">
            Profissional
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[rgba(255,255,255,0.6)]">Agentes ativos</p>
            <p className="text-sm font-medium text-white">4 / 5</p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-1.5 rounded-full bg-[#818cf8]"
              style={{ width: "80%" }}
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <p className="text-sm text-[rgba(255,255,255,0.6)]">Tarefas este mês</p>
            <p className="text-sm font-medium text-white">347</p>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">Próximo faturamento</p>
              <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.5)]">01/05/2026</p>
            </div>
            <p className="text-sm font-semibold text-white">R$ 7.500<span className="text-xs font-normal text-[rgba(255,255,255,0.4)]">/mês</span></p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-medium text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
          Gerenciar plano
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ConfiguracoesContent() {
  const [activeTab, setActiveTab] = useTabState<TabId>("kairus-config-tab", "notificacoes");

  const panelMap: Record<TabId, React.ReactNode> = {
    notificacoes: <NotificacoesPanel />,
    inteligencia: <InteligenciaPanel />,
    seguranca: <SegurancaPanel />,
    integracoes: <IntegracoesPanel />,
    plano: <PlanoPanel />,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Configurações</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">
          Gerencie suas preferências e configurações da plataforma
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <nav className="flex w-44 flex-shrink-0 flex-col gap-1" role="tablist" aria-label="Configuracoes">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${id}`}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-[rgba(255,255,255,0.08)] text-white"
                    : "text-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.7)]"
                }`}
              >
                <Icon size={15} className={active ? "text-white" : "text-[rgba(255,255,255,0.5)]"} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0" role="tabpanel" id={`panel-${activeTab}`} aria-label={activeTab}>{panelMap[activeTab]}</div>
      </div>
    </div>
  );
}
