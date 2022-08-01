const { test } = require('@playwright/test')
const happoPlaywright = require('happo-playwright')

test.describe('Login page', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
    await happoPlaywright.init(context)
  })

  test.afterAll(async () => {
    await happoPlaywright.finish()
  })

  test('has correct form layout', async () => {
    await page.goto('/login')

    const form = page.locator('form')

    await happoPlaywright.screenshot(page, form, {
      component: 'Login Form',
      variant: 'Default'
    })
  })
})
