import { test, expect } from '@playwright/test'

const pages = ['/', '/dashboard', '/financeiro', '/inbox', '/tasks', '/configuracoes']

for (const page of pages) {
  test(`visual snapshot: ${page}`, async ({ page: p }) => {
    await p.goto(page)
    await p.waitForLoadState('networkidle')
    await expect(p).toHaveScreenshot(`${page.replace(/\//g, '_') || 'home'}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })
}
