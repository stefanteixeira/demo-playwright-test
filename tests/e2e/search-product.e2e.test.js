const { test, expect } = require('@playwright/test')

const {
  createUser,
  createProduct,
  getUserBody,
  getProductBody,
  login,
} = require('../../lib/helpers')

test.describe.parallel('Search product', () => {
  test.beforeEach(async ({ page }) => {
    const user = getUserBody()

    await page.goto('/cadastrarusuarios')

    await createUser(
      page,
      user.nome,
      user.email,
      user.password
    )

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')

    await page.goto('/login')

    await login(
      page,
      user.email,
      user.password
    )

    await expect(page).toHaveURL('/admin/home')
  })

  test('search a product successfully', async ({ page }) => {
    const product = getProductBody()

    await page.click('data-testid=cadastrarProdutos')

    await createProduct(
      page,
      product.nome,
      product.preco,
      product.descricao,
      product.quantidade
    )

    const cellLocator = page.locator('tr').filter({ hasText: product.nome })

    for (const value of Object.values(product)) {
      await expect(cellLocator.filter({ hasText: value })).toBeVisible()
    }
  })

  test('don\'t view a product in the listing of created products', async ({ page }) => {
    const product = getProductBody()

    await page.click('data-testid=listarProdutos')

    const cellLocator = page.locator('tr').filter({ hasText: product.nome })

    for (const value of Object.values(product)) {
      await expect(cellLocator.filter({ hasText: value })).not.toBeVisible()
    }
  })
})
