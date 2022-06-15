const { test, expect } = require('@playwright/test')

const { getAuthToken, getProductBody } = require('../../lib/helpers')

const getProductId = async (request, authorization, body) => {
  const response = await request.post('/produtos', {
    data: body,
    headers: { 'Authorization': authorization }
  })
  const responseBody = JSON.parse(await response.text())

  return responseBody._id
}

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
})
