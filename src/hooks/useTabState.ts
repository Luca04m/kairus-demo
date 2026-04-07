'use client'
import { useState, useCallback } from 'react'

/**
 * Persists tab state in sessionStorage so it survives navigation.
 */
export function useTabState<T extends string>(
  key: string,
  defaultTab: T,
): [T, (tab: T) => void] {
  const [tab, setTabState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultTab
    return (sessionStorage.getItem(key) as T) ?? defaultTab
  })

  const setTab = useCallback(
    (newTab: T) => {
      setTabState(newTab)
      sessionStorage.setItem(key, newTab)
    },
    [key],
  )

  return [tab, setTab]
}
