const { test, expect } = require('@playwright/test')
const { faker } = require('@faker-js/faker')

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
    await page.type('data-testid=nome', faker.name.findName())
    await page.type('data-testid=email', faker.internet.email())
    await page.type('data-testid=password', faker.internet.password())
    await page.click('data-testid=checkbox')

    await page.click('data-testid=cadastrar')

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')
  })
})
