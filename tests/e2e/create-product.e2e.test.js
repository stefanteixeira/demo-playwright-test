const { test, expect } = require('@playwright/test')

const { createUser, getProductBody } = require('../../lib/helpers')

test.describe('Create product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastrarusuarios')
    await createUser(page)

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')
  })

  test('creates a product successfully', async ({ page }) => {
    const product = getProductBody()
    await page.click('data-testid=cadastrarProdutos') 

    await page.type('data-testid=nome', product.nome)
    await page.type('data-testid=preco', product.preco)
    await page.type('data-testid=descricao', product.descricao)
    await page.type('data-testid=quantity', product.quantidade)

    await page.click('data-testid=cadastarProdutos')

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/listarprodutos')

    const cellLocator = page.locator('tr').filter({ hasText: product.nome })

    for (const value of Object.values(product)) {
      await expect(cellLocator.filter({ hasText: value })).toBeVisible()
    }
  })
})
