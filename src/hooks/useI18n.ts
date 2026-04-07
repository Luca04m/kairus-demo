'use client'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { t as translate, resolveLocale } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

export function useI18n() {
  const idioma = useSettingsStore(s => s.idioma)
  const locale: Locale = resolveLocale(idioma)

  function t(key: string): string {
    return translate(key, locale)
  }

  return { t, locale }
}
