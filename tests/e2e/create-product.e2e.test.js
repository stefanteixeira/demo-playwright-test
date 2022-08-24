const { test, expect } = require('@playwright/test')

const {
  createUser,
  getProductBody,
  createProduct,
  getUserBody
} = require('../../lib/helpers')

test.describe('Create product', () => {
  test.beforeEach(async ({ page }) => {
    const user = getUserBody()

    await page.goto('/cadastrarusuarios')
    await createUser(
      page,
      user.nome,
      user.email,
      user.password,
      user.administrador
    )

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')
  })

  test('creates a product successfully', async ({ page }) => {
    const product = getProductBody()

    await page.click('data-testid=cadastrarProdutos')

    await createProduct(
      page,
      product.nome,
      product.preco,
      product.descricao,
      product.quantidade
    )

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/listarprodutos')

    const cellLocator = page.locator('tr').filter({ hasText: product.nome })

    for (const value of Object.values(product)) {
      await expect(cellLocator.filter({ hasText: value })).toBeVisible()
    }
  })
})
