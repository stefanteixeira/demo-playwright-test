const { test } = require('@playwright/test')
const happoPlaywright = require('happo-playwright')

const { openHomepage, getUserBody } = require('../../lib/helpers')

test.describe('Navbar', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    const user = getUserBody()

    context = await browser.newContext()
    page = await context.newPage()
    await happoPlaywright.init(context)
    
    await openHomepage(
      page,
      user.nome,
      user.email,
      user.password
    )
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
