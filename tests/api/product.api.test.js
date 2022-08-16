const { test, expect } = require('@playwright/test')
const { StatusCodes } = require('http-status-codes')
const { POST_SUCESS, DELETE_SUCESS, PUT_SUCESS, TOKEN_INVALID, NOME_JA_USADO } = require('serverest/src/utils/constants')
const { getAuthToken, getProductBody, getProductId } = require('../../lib/helpers')

test.describe.parallel('Product API', () => {
  let authorization

  test.beforeAll(async ({ request }) => {
    authorization = await getAuthToken(request)
  })

  test('retrieves the list of products', async ({ request }) => {
    const response = await request.get('/produtos')

    expect(response.status()).toEqual(StatusCodes.OK)
  })

  test('creates a product successfully', async ({ request }) => {
    const response = await request.post('/produtos', {
      data: getProductBody(),
      headers: { 'Authorization': authorization }
    })
    const product = await response.json()

    expect(response.status()).toEqual(StatusCodes.CREATED)
    expect(product.message).toEqual(POST_SUCESS)
  })

  test('retrieves an existing product by its id', async ({ request }) => {
    const _id = await getProductId(request, authorization, getProductBody())
    const response = await request.get(`/produtos/${_id}`)

    expect(response.status()).toEqual(StatusCodes.OK)
  })

  test('deletes a product successfully', async ({ request }) => {
    const _id = await getProductId(request, authorization, getProductBody())
    const response = await request.delete(`/produtos/${_id}`, {
      headers: { 'Authorization': authorization }
    })
    const product = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(product.message).toEqual(DELETE_SUCESS)
  })

  test('fails to delete a product when access token is not provided', async ({ request }) => {
    const _id = await getProductId(request, authorization, getProductBody())

    const response = await request.delete(`/produtos/${_id}`)
    const product = await response.json()

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    expect(product.message).toEqual(TOKEN_INVALID)
  })

  test('edits a product successfully', async ({ request }) => {
    const _id = await getProductId(request, authorization, getProductBody())
    const editProduct = getProductBody()

    const response = await request.put(`/produtos/${_id}`, {
      data: editProduct,
      headers: { 'Authorization': authorization }
    })
    const product = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(product.message).toEqual(PUT_SUCESS)
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
    const productJson = await response.json()

    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    expect(productJson.message).toEqual(NOME_JA_USADO)
  })
})
