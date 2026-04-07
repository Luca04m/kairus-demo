"use client";
import { useState, useMemo } from "react";
import { Upload, Trash2, Eye, EyeOff, Lock, Check, Globe } from "lucide-react";
import { DEMO_USER } from "@/lib/constants";

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'Fraca', color: 'rgba(239,68,68,0.7)' }
  if (score === 2) return { score, label: 'Razoavel', color: 'rgba(245,158,11,0.7)' }
  if (score === 3) return { score, label: 'Boa', color: 'rgba(34,197,94,0.6)' }
  return { score, label: 'Forte', color: 'rgba(34,197,94,0.9)' }
}

export function AccountSettingsContent() {
  const [photoMsg, setPhotoMsg] = useState("");
  const [nome, setNome] = useState<string>(DEMO_USER.name);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [idioma, setIdioma] = useState("pt-BR");
  const [saved, setSaved] = useState(false);

  const strength = useMemo(() => getPasswordStrength(novaSenha), [novaSenha]);
  const passwordTooShort = novaSenha.length > 0 && novaSenha.length < 8;
  const passwordsMatch = novaSenha === confirmarSenha;
  const canSavePassword = !novaSenha || (novaSenha.length >= 8 && passwordsMatch);

  function showPhotoFeedback(msg: string) {
    setPhotoMsg(msg);
    setTimeout(() => setPhotoMsg(""), 2000);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 max-w-2xl relative pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Configuracoes da conta</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)]">Gerencie as informacoes do seu perfil e configuracoes</p>
      </div>

      <div className="flex flex-col gap-1">

        {/* -- Profile section -- */}
        <div className="glass-card rounded-xl p-5 mb-2">
          <label className="block text-sm font-medium text-white mb-4">Foto de perfil</label>
          <div className="flex items-center gap-5">
            {/* Avatar with gradient */}
            <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(168,85,247,0.6) 100%)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-xl font-bold text-white">{DEMO_USER.initials}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[rgba(255,255,255,0.55)]">{DEMO_USER.name}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showPhotoFeedback("Foto atualizada")}
                  className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                >
                  <Upload size={13} />
                  <span>Enviar foto</span>
                </button>
                <button
                  onClick={() => showPhotoFeedback("Foto removida")}
                  className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {photoMsg && (
                <p className="text-xs text-emerald-400 animate-pulse">{photoMsg}</p>
              )}
            </div>
          </div>
        </div>

        {/* -- Divider -- */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* -- Email -- */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-1.5">E-mail</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)]" />
            <span className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] pl-9 pr-3 py-2 text-sm text-[rgba(255,255,255,0.4)] block">{DEMO_USER.email}</span>
          </div>
          <p className="mt-1.5 text-xs text-[rgba(255,255,255,0.5)] flex items-center gap-1">
            <Lock size={11} />
            Gerenciado pelo provedor de identidade
          </p>
        </div>

        {/* -- Full Name -- */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-1.5">Nome completo</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)]"
          />
        </div>

        {/* -- Divider -- */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* -- Password section -- */}
        <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5 mb-2">
          <h3 className="text-sm font-semibold text-white mb-4">Senha</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-[rgba(255,255,255,0.7)] mb-1.5">Nova senha</label>
              <div className="relative">
                <input
                  type={showPass1 ? "text" : "password"}
                  placeholder="Senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 pr-9 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass1((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                >
                  {showPass1 ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength indicator */}
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-1 flex-1 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: strength.score >= level ? strength.color : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className={`text-xs ${passwordTooShort ? 'text-red-400' : 'text-[rgba(255,255,255,0.5)]'}`}>
                  {passwordTooShort ? 'Minimo 8 caracteres' : '8 caracteres minimos'}
                </p>
                {strength.label && (
                  <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-[rgba(255,255,255,0.7)] mb-1.5">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showPass2 ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 pr-9 text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass2((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                >
                  {showPass2 ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmarSenha && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-400">As senhas nao coincidem</p>
              )}
              {confirmarSenha && passwordsMatch && novaSenha.length >= 8 && (
                <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                  <Check size={11} />
                  Senhas coincidem
                </p>
              )}
            </div>
          </div>
        </div>

        {/* -- Divider -- */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* -- Theme selector -- */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-3">Tema da interface</label>
          <div className="flex gap-3">
            {/* Dark card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setTheme("dark")}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTheme("dark"); } }}
              className={`relative flex-1 rounded-xl p-3 cursor-pointer transition-all ${
                theme === "dark"
                  ? "border border-[rgba(99,102,241,0.6)] bg-[rgba(99,102,241,0.08)]"
                  : "border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.15)]"
              }`}
            >
              {/* Mini preview */}
              <div className="rounded-lg bg-[#0d0d0f] border border-[rgba(255,255,255,0.06)] p-2 mb-2 h-14 overflow-hidden">
                <div className="h-1.5 w-10 rounded bg-[rgba(255,255,255,0.15)] mb-1.5" />
                <div className="h-1 w-14 rounded bg-[rgba(255,255,255,0.08)] mb-1" />
                <div className="h-1 w-10 rounded bg-[rgba(255,255,255,0.08)]" />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${theme === "dark" ? "text-white" : "text-[rgba(255,255,255,0.5)]"}`}>Escuro</span>
                {theme === "dark" && <Check size={13} className="text-[rgba(99,102,241,0.9)]" />}
              </div>
            </div>
            {/* Light card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setTheme("light")}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTheme("light"); } }}
              className={`relative flex-1 rounded-xl p-3 cursor-pointer transition-all ${
                theme === "light"
                  ? "border border-[rgba(99,102,241,0.6)] bg-[rgba(99,102,241,0.08)]"
                  : "border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.15)]"
              }`}
            >
              {/* Mini preview */}
              <div className="rounded-lg bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)] p-2 mb-2 h-14 overflow-hidden">
                <div className="h-1.5 w-10 rounded bg-[rgba(0,0,0,0.2)] mb-1.5" />
                <div className="h-1 w-14 rounded bg-[rgba(0,0,0,0.1)] mb-1" />
                <div className="h-1 w-10 rounded bg-[rgba(0,0,0,0.1)]" />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${theme === "light" ? "text-white" : "text-[rgba(255,255,255,0.5)]"}`}>Claro</span>
                {theme === "light" && <Check size={13} className="text-[rgba(99,102,241,0.9)]" />}
              </div>
            </div>
          </div>
        </div>

        {/* -- Divider -- */}
        <div className="h-px bg-[rgba(255,255,255,0.05)] my-2" />

        {/* -- Idioma -- */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-1.5 flex items-center gap-1.5">
            <Globe size={14} className="text-[rgba(255,255,255,0.4)]" />
            Idioma
          </label>
          <div className="relative">
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-white outline-none appearance-none transition-all focus:border-[rgba(99,102,241,0.6)] focus:ring-1 focus:ring-[rgba(99,102,241,0.2)] cursor-pointer"
            >
              <option value="pt-BR">Portugues (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es">Espanol</option>
            </select>
            <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] pointer-events-none" />
          </div>
        </div>


      </div>

      {/* -- Save button -- */}
      <div className="sticky bottom-6 z-50 flex justify-center">
        <button
          onClick={handleSave}
          disabled={!canSavePassword}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg transition-colors ${
            canSavePassword
              ? 'bg-[rgba(255,255,255,0.92)] text-[#080808] hover:bg-white cursor-pointer'
              : 'bg-[rgba(255,255,255,0.3)] text-[rgba(8,8,8,0.5)] cursor-not-allowed'
          }`}
        >
          <Check size={15} />
          {saved ? "Salvo" : "Salvar alteracoes"}
        </button>
      </div>
    </div>
  );
}
