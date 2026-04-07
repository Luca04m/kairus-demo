import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../useSettingsStore'

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetSettings()
  })

  it('has correct default values', () => {
    const state = useSettingsStore.getState()
    expect(state.idioma).toBe('Português (BR)')
    expect(state.notificacoesEmail).toBe(true)
    expect(state.autonomiaAgente).toBe('Moderado')
    expect(state.aprovacaoManual).toBe(true)
    expect(state.doisFatores).toBe(false)
  })

  it('updates a setting via setSetting', () => {
    useSettingsStore.getState().setSetting('idioma', 'English')
    expect(useSettingsStore.getState().idioma).toBe('English')
  })

  it('updates boolean toggles', () => {
    useSettingsStore.getState().setSetting('notificacoesEmail', false)
    expect(useSettingsStore.getState().notificacoesEmail).toBe(false)

    useSettingsStore.getState().setSetting('doisFatores', true)
    expect(useSettingsStore.getState().doisFatores).toBe(true)
  })

  it('resets to defaults after changes', () => {
    useSettingsStore.getState().setSetting('idioma', 'English')
    useSettingsStore.getState().setSetting('notificacoesEmail', false)
    useSettingsStore.getState().setSetting('doisFatores', true)

    useSettingsStore.getState().resetSettings()

    const state = useSettingsStore.getState()
    expect(state.idioma).toBe('Português (BR)')
    expect(state.notificacoesEmail).toBe(true)
    expect(state.doisFatores).toBe(false)
  })

  it('preserves unrelated settings when updating one', () => {
    useSettingsStore.getState().setSetting('idioma', 'Español')
    const state = useSettingsStore.getState()
    expect(state.notificacoesEmail).toBe(true)
    expect(state.autonomiaAgente).toBe('Moderado')
  })
})
