import { test } from '@playwright/test'
import path from 'path'

const pages = [
  { route: '/', name: 'home' },
  { route: '/dashboard', name: 'dashboard' },
  { route: '/financeiro', name: 'financeiro' },
  { route: '/marketing', name: 'marketing' },
  { route: '/inbox', name: 'inbox' },
  { route: '/tasks', name: 'tasks' },
  { route: '/equipe', name: 'equipe' },
  { route: '/configuracoes', name: 'configuracoes' },
  { route: '/integrations', name: 'integrations' },
  { route: '/settings', name: 'settings' },
  { route: '/views', name: 'views' },
  { route: '/relatorios', name: 'relatorios' },
  { route: '/roi', name: 'roi' },
  { route: '/agent/demo-agent', name: 'agent-chat' },
  { route: '/agent/demo-agent/tasks', name: 'agent-tasks' },
  { route: '/agent/demo-agent/flow', name: 'agent-flow' },
  { route: '/agent/demo-agent/settings', name: 'agent-settings' },
  { route: '/agent/demo-agent/analytics', name: 'agent-analytics' },
  { route: '/world', name: 'world' },
  { route: '/sales-room', name: 'sales-room' },
  { route: '/roadmap', name: 'roadmap' },
]

const outDir = path.resolve('docs/screenshots-check')

for (const { route, name } of pages) {
  test(`screenshot: ${name}`, async ({ page }) => {
    // Dismiss onboarding if present
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    const skip = page.getByText('Pular tour')
    if (await skip.isVisible({ timeout: 1000 }).catch(() => false)) {
      await skip.click()
      await page.waitForTimeout(500)
    }
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true })
  })
}
