const { test, expect } = require('@playwright/test')
const { faker } = require('@faker-js/faker')

const { createUser } = require('../../lib/helpers')

const product = {
  name: `${faker.commerce.product()} SKU: ${faker.finance.account(8)}`,
  price: faker.commerce.price(100, 200, 0),
  description: faker.commerce.productDescription(10),
  quantity: faker.random.numeric(2)
}

test.describe('Create product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastrarusuarios')
    await createUser(page)

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/home')
  })

  test('creates a product successfully', async ({ page }) => {
    await page.click('data-testid=cadastrarProdutos') 

    await page.type('data-testid=nome', product.name)
    await page.type('data-testid=preco', product.price)
    await page.type('data-testid=descricao', product.description)
    await page.type('data-testid=quantity', product.quantity)

    await page.click('data-testid=cadastarProdutos')

    await page.waitForNavigation()
    await expect(page).toHaveURL('/admin/listarprodutos')

    const cellLocator = page.locator('tr').filter({ hasText: product.name })

    for (const value of Object.values(product)) {
      await expect(cellLocator.filter({ hasText: value })).toBeVisible()
    }
  })
})
