import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EmptyState } from '../ui/empty-state'

describe('EmptyState', () => {
  it('renders default title and description', () => {
    render(<EmptyState />)
    expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument()
    expect(screen.getByText('Ainda nao existem registros para exibir.')).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    render(<EmptyState title="Sem tarefas" description="Crie sua primeira tarefa" />)
    expect(screen.getByText('Sem tarefas')).toBeInTheDocument()
    expect(screen.getByText('Crie sua primeira tarefa')).toBeInTheDocument()
  })

  it('renders action button and fires callback', () => {
    const onAction = vi.fn()
    render(<EmptyState actionLabel="Criar" onAction={onAction} />)
    const btn = screen.getByRole('button', { name: 'Criar' })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('does not render action button when no actionLabel', () => {
    render(<EmptyState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
