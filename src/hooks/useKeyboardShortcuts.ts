'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Global keyboard shortcuts for navigation.
 * Cmd/Ctrl + key triggers route changes.
 */
export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return

      // Skip when typing in inputs
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
        return

      switch (e.key) {
        case 'k': // Cmd+K — handled by CommandPalette
          return
        case 'd': // Cmd+D — dashboard
          e.preventDefault()
          router.push('/dashboard')
          break
        case 'i': // Cmd+I — inbox
          e.preventDefault()
          router.push('/inbox')
          break
        case 't': // Cmd+T — tasks
          e.preventDefault()
          router.push('/tasks')
          break
        case 'e': // Cmd+E — equipe
          e.preventDefault()
          router.push('/equipe')
          break
        case 'f': // Cmd+Shift+F — financeiro
          if (e.shiftKey) {
            e.preventDefault()
            router.push('/financeiro')
          }
          break
        case 'm': // Cmd+Shift+M — marketing
          if (e.shiftKey) {
            e.preventDefault()
            router.push('/marketing')
          }
          break
        case 'r': // Cmd+Shift+R — relatorios
          if (e.shiftKey) {
            e.preventDefault()
            router.push('/relatorios')
          }
          break
        case ',': // Cmd+, — configuracoes
          e.preventDefault()
          router.push('/configuracoes')
          break
        case '.': // Cmd+. — agent
          e.preventDefault()
          router.push('/agent')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
