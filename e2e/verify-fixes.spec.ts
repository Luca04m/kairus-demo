import { test } from '@playwright/test'
import path from 'path'

const outDir = path.resolve('docs/screenshots-check')

const pages = [
  { route: '/agent/demo-agent/flow', name: 'fix-agent-flow' },
  { route: '/agent/demo-agent/analytics', name: 'fix-agent-analytics' },
  { route: '/agent/demo-agent/settings', name: 'fix-agent-settings' },
  { route: '/agent/demo-agent/tasks', name: 'fix-agent-tasks' },
  { route: '/agent/demo-agent', name: 'fix-agent-chat' },
  { route: '/inbox', name: 'fix-inbox' },
]

for (const { route, name } of pages) {
  test(`verify fix: ${name}`, async ({ page }) => {
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
