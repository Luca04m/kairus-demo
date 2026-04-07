import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

import { KeyboardShortcuts } from '../KeyboardShortcuts'

describe('KeyboardShortcuts', () => {
  it('mounts without error and renders nothing visible', () => {
    const { container } = render(<KeyboardShortcuts />)
    expect(container.innerHTML).toBe('')
  })
})
