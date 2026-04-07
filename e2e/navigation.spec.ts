import { test, expect } from '@playwright/test'

test('sidebar navigation works on desktop', async ({ page }) => {
  // Use desktop viewport to ensure sidebar is visible
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')

  // Dismiss onboarding tour if visible
  const skipButton = page.getByText('Pular tour')
  if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipButton.click()
    await page.waitForTimeout(300)
  }

  // Navigate to Financeiro
  const financeiroLink = page.locator('a[href="/financeiro"]').first()
  await expect(financeiroLink).toBeVisible({ timeout: 5000 })
  await financeiroLink.click()
  await expect(page).toHaveURL('/financeiro')

  // Navigate to Inbox
  const inboxLink = page.locator('a[href="/inbox"]').first()
  await expect(inboxLink).toBeVisible({ timeout: 5000 })
  await inboxLink.click()
  await expect(page).toHaveURL('/inbox')

  // Navigate to Tasks
  const tasksLink = page.locator('a[href="/tasks"]').first()
  await expect(tasksLink).toBeVisible({ timeout: 5000 })
  await tasksLink.click()
  await expect(page).toHaveURL('/tasks')

  // Navigate back to Dashboard
  const dashboardLink = page.locator('a[href="/dashboard"]').first()
  await expect(dashboardLink).toBeVisible({ timeout: 5000 })
  await dashboardLink.click()
  await expect(page).toHaveURL('/dashboard')
})
