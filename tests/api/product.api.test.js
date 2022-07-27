const { test, expect } = require('@playwright/test')

const { getAuthToken, getProductBody, getProductId } = require('../../lib/helpers')

test.describe.parallel('Product API', () => {
  let authorization

  test.beforeAll(async ({ request }) => {
    authorization = await getAuthToken(request)
  })

  test('retrieves the list of products', async ({ request }) => {
    const response = await request.get('/produtos')

    await expect(response).toBeOK()
  })

  test('creates a product successfully', async ({ request }) => {
    const response = await request.post('/produtos', {
      data: getProductBody(),
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()
  })

  test('retrieves an existing product by its id', async ({ request }) => {
    const id = await getProductId(request, authorization, getProductBody())
    const response = await request.get(`/produtos/${id}`)

    await expect(response).toBeOK()
  })

  test('deletes a product successfully', async ({ request }) => {
    const id = await getProductId(request, authorization, getProductBody())
    const response = await request.delete(`/produtos/${id}`, {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()
  })

  test('fails to delete a product when access token is not provided', async ({ request }) => {
    const id = await getProductId(request, authorization, getProductBody())
    const response = await request.delete(`/produtos/${id}`)

    await expect(response.status()).toEqual(401)
  })
  
  test('edits a product successfully', async ({ request }) => { 
    const id = await getProductId(request, authorization, getProductBody())
    const editProduct = getProductBody()

    const response = await request.put(`/produtos/${id}`, {
      data: editProduct, 
      headers: { 'Authorization': authorization }
    })
  
    await expect(response).toBeOK()
  })

  test('fails to edit a product if other product with the same name already exists', async ({ request }) => { 
    const product = getProductBody()
    await request.post('/produtos', {
      data: product,
      headers: { 'Authorization': authorization }
    })    

    const { nome, ...rest } = getProductBody()
    const editProduct = {
      nome: product.nome, 
      ...rest
    }
    const response = await request.put('/produtos/nonExistingId', {
      data: editProduct,
      headers: { 'Authorization': authorization }
    })
    
    await expect(response.status()).toEqual(400)
  })
})
