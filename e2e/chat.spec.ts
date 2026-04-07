import { test, expect } from '@playwright/test'

test('homepage chat sends message and receives response', async ({ page }) => {
  await page.goto('/')

  // Find the chat textarea
  const textarea = page.locator('textarea').first()
  await expect(textarea).toBeVisible()

  // Type a message
  await textarea.fill('Qual o status do estoque?')

  // Press Enter to send
  await textarea.press('Enter')

  // Should see user message appear
  await expect(page.getByText('Qual o status do estoque?').first()).toBeVisible({ timeout: 3000 })

  // Should see AI response (wait up to 5s for typing delay)
  await expect(page.getByText('Entendido!').first()).toBeVisible({ timeout: 5000 })
})

test('agent chat sends message and receives response', async ({ page }) => {
  await page.goto('/agent/demo-agent')
  await page.waitForLoadState('networkidle')

  const textarea = page.locator('textarea').first()
  await expect(textarea).toBeVisible({ timeout: 5000 })

  await textarea.fill('Gere um relatório de vendas')
  await textarea.press('Enter')

  // Wait for the message to appear in the chat
  await expect(page.getByText('Entendido!').first()).toBeVisible({ timeout: 5000 })
})
