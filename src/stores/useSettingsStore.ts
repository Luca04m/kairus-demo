import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Notification settings
  notificacoesEmail: boolean
  notificacoesPush: boolean
  alertasCriticos: boolean
  resumoDiario: boolean
  relatoriosSemanais: boolean
  // AI settings
  autonomiaAgente: string
  idioma: string
  // Agent toggles
  aprovacaoManual: boolean
  aprendizadoContinuo: boolean
  // Security
  doisFatores: boolean
  logAuditoria: boolean
  // Actions
  setSetting: <K extends keyof Omit<SettingsState, 'setSetting' | 'resetSettings'>>(
    key: K,
    value: SettingsState[K],
  ) => void
  resetSettings: () => void
}

const defaultSettings = {
  notificacoesEmail: true,
  notificacoesPush: true,
  alertasCriticos: true,
  resumoDiario: false,
  relatoriosSemanais: true,
  autonomiaAgente: 'Moderado',
  idioma: 'Português (BR)',
  aprovacaoManual: true,
  aprendizadoContinuo: true,
  doisFatores: false,
  logAuditoria: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value } as Partial<SettingsState>),
      resetSettings: () => set(defaultSettings),
    }),
    { name: 'kairus-settings' },
  ),
)
