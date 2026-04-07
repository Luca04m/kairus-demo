'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  LayoutDashboard,
  DollarSign,
  Megaphone,
  Users,
  Inbox,
  ListTodo,
  Settings,
  Link2,
  Bot,
  Globe,
  Map,
  BarChart2,
  Plus,
  FileText,
  Home,
} from 'lucide-react'

interface Command {
  id: string
  label: string
  category: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Listen for Cmd+K globally
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const nav = useCallback(
    (path: string) => {
      router.push(path)
      setOpen(false)
    },
    [router],
  )

  const commands: Command[] = useMemo(
    () => [
      { id: 'home', label: 'Inicio', category: 'Navegacao', icon: <Home size={16} />, action: () => nav('/') },
      { id: 'dashboard', label: 'Dashboard', category: 'Navegacao', icon: <LayoutDashboard size={16} />, shortcut: '\u2318D', action: () => nav('/dashboard') },
      { id: 'financeiro', label: 'Financeiro', category: 'Navegacao', icon: <DollarSign size={16} />, shortcut: '\u2318\u21E7F', action: () => nav('/financeiro') },
      { id: 'marketing', label: 'Marketing', category: 'Navegacao', icon: <Megaphone size={16} />, shortcut: '\u2318\u21E7M', action: () => nav('/marketing') },
      { id: 'equipe', label: 'Equipe', category: 'Navegacao', icon: <Users size={16} />, shortcut: '\u2318E', action: () => nav('/equipe') },
      { id: 'inbox', label: 'Caixa de entrada', category: 'Navegacao', icon: <Inbox size={16} />, shortcut: '\u2318I', action: () => nav('/inbox') },
      { id: 'tasks', label: 'Tarefas', category: 'Navegacao', icon: <ListTodo size={16} />, shortcut: '\u2318T', action: () => nav('/tasks') },
      { id: 'integrations', label: 'Integracoes', category: 'Navegacao', icon: <Link2 size={16} />, action: () => nav('/integrations') },
      { id: 'agents', label: 'Meus Agentes', category: 'Navegacao', icon: <Bot size={16} />, action: () => nav('/agent-templates') },
      { id: 'world', label: 'World', category: 'Navegacao', icon: <Globe size={16} />, action: () => nav('/world') },
      { id: 'roadmap', label: 'Roadmap', category: 'Navegacao', icon: <Map size={16} />, action: () => nav('/roadmap') },
      { id: 'reports', label: 'Relatorios', category: 'Navegacao', icon: <BarChart2 size={16} />, shortcut: '\u2318\u21E7R', action: () => nav('/relatorios') },
      { id: 'settings', label: 'Configuracoes', category: 'Navegacao', icon: <Settings size={16} />, shortcut: '\u2318,', action: () => nav('/configuracoes') },
      { id: 'new-task', label: 'Criar tarefa', category: 'Acoes', icon: <Plus size={16} />, action: () => nav('/tasks') },
      { id: 'new-agent', label: 'Novo agente', category: 'Acoes', icon: <Bot size={16} />, action: () => nav('/agent-templates') },
      { id: 'new-report', label: 'Gerar relatorio', category: 'Acoes', icon: <FileText size={16} />, action: () => nav('/relatorios') },
    ],
    [nav],
  )

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  const flatFiltered = Object.values(grouped).flat()

  // Keyboard navigation inside palette
  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      flatFiltered[selectedIndex]?.action()
    }
  }

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!open) return null

  let flatIndex = -1

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,15,20,0.92)] backdrop-blur-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
          <Search size={18} className="text-[rgba(255,255,255,0.4)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Buscar comandos..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[rgba(255,255,255,0.3)] outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[10px] text-[rgba(255,255,255,0.35)]">
            ESC
          </kbd>
        </div>

        {/* Commands list */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2 scroll-smooth">
          {flatFiltered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-[rgba(255,255,255,0.35)]">
              Nenhum comando encontrado
            </p>
          )}

          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-[rgba(255,255,255,0.3)]">
                {category}
              </p>
              {cmds.map((cmd) => {
                flatIndex++
                const idx = flatIndex
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                      ${isSelected
                        ? 'bg-[rgba(99,102,241,0.15)] text-white'
                        : 'text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)]'
                      }
                    `}
                  >
                    <span className={`flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-[rgba(255,255,255,0.4)]'}`}>
                      {cmd.icon}
                    </span>
                    <span className="flex-1 text-sm">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-1.5 py-0.5 text-[10px] text-[rgba(255,255,255,0.3)]">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[rgba(255,255,255,0.06)] text-[10px] text-[rgba(255,255,255,0.25)]">
          <span>
            <kbd className="rounded border border-[rgba(255,255,255,0.1)] px-1 py-0.5 mr-1">&#8593;&#8595;</kbd>
            navegar
          </span>
          <span>
            <kbd className="rounded border border-[rgba(255,255,255,0.1)] px-1 py-0.5 mr-1">&#9166;</kbd>
            executar
          </span>
        </div>
      </div>
    </div>
  )
}
