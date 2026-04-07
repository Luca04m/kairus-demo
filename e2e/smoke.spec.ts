import { test, expect } from '@playwright/test'

const routes = [
  '/',
  '/dashboard',
  '/financeiro',
  '/marketing',
  '/equipe',
  '/sales-room',
  '/world',
  '/tasks',
  '/agent-templates',
  '/roadmap',
  '/integrations',
  '/configuracoes',
  '/inbox',
  '/settings',
  '/views',
  '/relatorios',
  '/roi',
  '/login',
  '/agent/demo-agent',
]

for (const route of routes) {
  test(`${route} returns 200 and renders`, async ({ page }) => {
    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
    // Page should have content
    await expect(page.locator('body')).not.toBeEmpty()
  })
}
