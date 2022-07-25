const { test, expect } = require('@playwright/test')

const { createUser } = require('../../lib/helpers')
const { testA11y } = require('../../lib/a11y')

test.describe.parallel('Create user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastrarusuarios')
  })

  test('shows error message when no fields are set', async ({ page }) => {
    await page.click('data-testid=cadastrar')

    const errors = page.locator('role=alert')
    await expect(errors).toHaveCount(3)
  })

  test('creates a user successfully', async ({ page }) => {
    await createUser(page)

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')
  })

  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('has no a11y issues in the form', async ({ page }) => {
    await testA11y(page, '.form')
  })
})
