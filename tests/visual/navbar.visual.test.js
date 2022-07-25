const { test } = require('@playwright/test')
const happoPlaywright = require('happo-playwright')

const { openHomepage } = require('../../lib/helpers')

test.describe('Navbar', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
    await happoPlaywright.init(context)
    
    await openHomepage(page)
  })

  test.afterAll(async () => {
    await happoPlaywright.finish()
  })

  test('has correct layout', async () => {
    const navbar = page.locator('.navbar')

    await happoPlaywright.screenshot(page, navbar, {
      component: 'Navbar',
      variant: 'Default'
    })
  })
})
