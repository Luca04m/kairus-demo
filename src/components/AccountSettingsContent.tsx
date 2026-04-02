"use client";
import { Upload, Trash2, Eye, Lock, Check, Globe, AlertTriangle } from "lucide-react";

export function AccountSettingsContent() {
  return (
    <div className="p-6 max-w-2xl relative pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Configurações da conta</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">Gerencie as informações do seu perfil e configurações</p>
      </div>

      <div className="flex flex-col gap-1">

        {/* ── Profile section ── */}
        <div className="glass-card rounded-xl p-5 mb-2">
          <label className="block text-sm font-medium text-white mb-4">Foto de perfil</label>
          <div className="flex items-center gap-5">
            {/* Avatar with gradient */}
            <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(168,85,247,0.6) 100%)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-xl font-bold text-white">CM</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[rgba(255,255,255,0.55)]">Luca Moreno</p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                  <Upload size={13} />
                  <span>Enviar foto</span>
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* ── Email ── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-1.5">E-mail</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
            <input
              readOnly
              value="carlos.moreno@kairus.ai"
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] pl-9 pr-3 py-2 text-sm text-[rgba(255,255,255,0.4)] outline-none cursor-not-allowed"
            />
          </div>
          <p className="mt-1.5 text-xs text-[rgba(255,255,255,0.3)] flex items-center gap-1">
            <Lock size={11} />
            Gerenciado pelo provedor de identidade
          </p>
        </div>

        {/* ── Full Name ── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-1.5">Nome completo</label>
          <input
            defaultValue="Luca Moreno"
            className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)]"
          />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* ── Password section ── */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5 mb-2">
          <h3 className="text-sm font-semibold text-white mb-4">Senha</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-[rgba(255,255,255,0.7)] mb-1.5">Nova senha</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Senha"
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 pr-9 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.35)] hover:text-white transition-colors">
                  <Eye size={15} />
                </button>
              </div>
              {/* Password strength indicator */}
              <div className="mt-2 flex gap-1">
                <div className="h-1 flex-1 rounded-full bg-[rgba(34,197,94,0.7)]" />
                <div className="h-1 flex-1 rounded-full bg-[rgba(34,197,94,0.7)]" />
                <div className="h-1 flex-1 rounded-full bg-[rgba(245,158,11,0.5)]" />
                <div className="h-1 flex-1 rounded-full bg-[rgba(255,255,255,0.1)]" />
              </div>
              <p className="mt-1 text-xs text-[rgba(255,255,255,0.3)]">8 caracteres mínimos</p>
            </div>
            <div>
              <label className="block text-sm text-[rgba(255,255,255,0.7)] mb-1.5">Confirmar senha</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 pr-9 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.35)] hover:text-white transition-colors">
                  <Eye size={15} />
                </button>
              </div>
            </div>
            <button className="w-fit rounded-lg bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm font-medium text-[#080808] hover:bg-[rgba(255,255,255,0.75)] transition-colors">
              Atualizar senha
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* ── Theme selector ── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-3">Tema da interface</label>
          <div className="flex gap-3">
            {/* Dark card — active */}
            <div className="relative flex-1 rounded-xl border border-[rgba(99,102,241,0.6)] bg-[rgba(99,102,241,0.08)] p-3 cursor-pointer">
              {/* Mini preview */}
              <div className="rounded-lg bg-[#0d0d0f] border border-[rgba(255,255,255,0.06)] p-2 mb-2 h-14 overflow-hidden">
                <div className="h-1.5 w-10 rounded bg-[rgba(255,255,255,0.15)] mb-1.5" />
                <div className="h-1 w-14 rounded bg-[rgba(255,255,255,0.08)] mb-1" />
                <div className="h-1 w-10 rounded bg-[rgba(255,255,255,0.08)]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white">Escuro</span>
                <Check size={13} className="text-[rgba(99,102,241,0.9)]" />
              </div>
            </div>
            {/* Light card */}
            <div className="relative flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-3 cursor-pointer hover:border-[rgba(255,255,255,0.15)] transition-colors">
              {/* Mini preview */}
              <div className="rounded-lg bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)] p-2 mb-2 h-14 overflow-hidden">
                <div className="h-1.5 w-10 rounded bg-[rgba(0,0,0,0.2)] mb-1.5" />
                <div className="h-1 w-14 rounded bg-[rgba(0,0,0,0.1)] mb-1" />
                <div className="h-1 w-10 rounded bg-[rgba(0,0,0,0.1)]" />
              </div>
              <span className="text-xs font-medium text-[rgba(255,255,255,0.5)]">Claro</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* ── Idioma ── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-1.5 flex items-center gap-1.5">
            <Globe size={14} className="text-[rgba(255,255,255,0.4)]" />
            Idioma
          </label>
          <div className="relative">
            <select className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none appearance-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)] cursor-pointer">
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es">Español</option>
            </select>
            <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-4" />

        {/* ── Zona de perigo ── */}
        <div className="rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.04)] p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={15} className="text-[rgba(239,68,68,0.7)]" />
            <h3 className="text-sm font-semibold text-[rgba(239,68,68,0.85)]">Zona de perigo</h3>
          </div>
          <p className="text-xs text-[rgba(255,255,255,0.35)] mb-4">Ações irreversíveis. Proceda com cuidado.</p>
          <button className="rounded-lg border border-[rgba(239,68,68,0.3)] px-4 py-2 text-sm text-[rgba(239,68,68,0.75)] hover:bg-[rgba(239,68,68,0.08)] hover:border-[rgba(239,68,68,0.5)] transition-colors">
            Excluir conta
          </button>
        </div>

      </div>

      {/* ── Floating save button ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button className="flex items-center gap-2 rounded-xl bg-[rgba(255,255,255,0.92)] px-6 py-2.5 text-sm font-semibold text-[#080808] shadow-lg hover:bg-white transition-colors">
          <Check size={15} />
          Salvar alterações
        </button>
      </div>
    </div>
  );
}
