const { test, expect } = require('@playwright/test')
const { faker } = require('@faker-js/faker')

const { createUser } = require('../lib/helpers')

test.describe('Create product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastrarusuarios')
    await createUser(page)
  })

  test('product registration with image upload', async ({ page }) => {

    await expect(page).toHaveURL('/admin/home')

    await page.click('data-testid=cadastrarProdutos') 

    await expect(page).toHaveURL('/admin/cadastrarprodutos')

    const nameProduct = await page.type('data-testid=nome', faker.commerce.product())
    await page.type('data-testid=preco', faker.finance.account(length = 3))
    await page.fill('data-testid=descricao', faker.commerce.productDescription(length = 10))
    await page.type('data-testid=quantity', faker.finance.account(length = 3))

    await page.setInputFiles('data-testid=imagem', '.\fixtures\61H4JKOKu3L._AC_SX522_.jpg')
    //const imageProduct = await page.('data-testid=imagem'); ///
    //const imageUpload = await imageProduct.$('xpath=..')
    //const figureUpload = await imageUpload.$$('figure')

    //expect($figureUpload)
    await page.pause()
   
  
  



    
  })
})