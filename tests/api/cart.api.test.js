const { test, expect } = require('@playwright/test')

const { getAuthToken, getProductBody, getProductId, getCartBody, getCartId } = require('../../lib/helpers')
  
test.describe.parallel('Carts API', () => {
  let authorization
  
  test.beforeAll(async ({ request }) => {
    authorization = await getAuthToken(request)
  })
  
  test('retrieves the list of carts', async ({ request }) => {
    const response = await request.get('/carrinhos')
    
    await expect(response).toBeOK()
  })

  test('creates a cart successfully', async ({ request }) => {
    const id = await getProductId(request, authorization, getProductBody())

    const response = await request.post('/carrinhos', {
      data: getCartBody(id),
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())
    
    await expect(responseBody.message).toBe('Cadastro realizado com sucesso')
  })

  test('retrieves an existing cart by its id', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    const _id = await getCartId(request, authorization, getCartBody(idProduct))
    
    const response = await request.get(`/carrinhos/${_id}`)
    
    await expect(response).toBeOK()
  })
})
