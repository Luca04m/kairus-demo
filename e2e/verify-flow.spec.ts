import { test } from '@playwright/test'
import path from 'path'

test('verify flow page renders content', async ({ page }) => {
  await page.goto('/agent/demo-agent/flow')
  await page.waitForLoadState('networkidle')
  const skip = page.getByText('Pular tour')
  if (await skip.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skip.click()
    await page.waitForTimeout(500)
  }
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.resolve('docs/screenshots-check/fix-flow-final.png'), fullPage: true })
})
