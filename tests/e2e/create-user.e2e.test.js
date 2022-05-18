const { test, expect } = require('@playwright/test')
const { faker } = require('@faker-js/faker')

const { createUser } = require('../lib/helpers')

test.describe.parallel('Create user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastrarusuarios')
  })

  test('shows error message when no fields are set', async ({ page }) => {
    await page.click('data-testid=cadastrar')

    const errors = page.locator('role=alert')
    await expect(errors).toHaveCount(3)
  })

  test('creates an user successfully', async ({ page }) => {
    await createUser(page)

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')
  })
})
