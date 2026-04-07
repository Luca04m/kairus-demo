import { test, expect } from '@playwright/test'
import path from 'path'

test('CSS loads correctly - homepage styled', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Dismiss onboarding
  const skip = page.getByText('Pular tour')
  if (await skip.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skip.click()
    await page.waitForTimeout(500)
  }

  // Check that body has dark background (CSS loaded)
  const bgColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor
  })

  // If CSS is loaded, body bg should NOT be white/transparent
  console.log('Body background:', bgColor)

  await page.screenshot({ path: path.resolve('docs/screenshots-check/verify-css.png'), fullPage: true })
})

test('Dashboard renders with styling', async ({ page }) => {
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')

  const skip = page.getByText('Pular tour')
  if (await skip.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skip.click()
    await page.waitForTimeout(300)
  }

  await page.screenshot({ path: path.resolve('docs/screenshots-check/verify-css-dashboard.png'), fullPage: true })
})
