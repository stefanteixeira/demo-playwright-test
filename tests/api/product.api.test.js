const { test, expect } = require('@playwright/test')
const { StatusCodes } = require('http-status-codes')
const {
  POST_SUCESS,
  DELETE_SUCESS,
  PUT_SUCESS,
  TOKEN_INVALID,
  NOME_JA_USADO,
  IDPRODUTO_INVALIDO
} = require('serverest/src/utils/constants')
const { getAuthToken, getProductBody, getProductId, getUserBody } = require('../../lib/helpers')

test.describe.parallel('Product API', () => {
  let authorization

  test.beforeAll(async ({ request }) => {
    authorization = await getAuthToken(request)
  })

  test('retrieves the list of products', async ({ request }) => {
    const response = await request.get('/produtos')

    expect(response.status()).toEqual(StatusCodes.OK)
  })

  test('returns an empty list when a product does not exist', async ({ request }) => {
    const name = getProductBody().nome

    const response = await request.get('/produtos', {
      params: {
        nome: name
      }
    })

    const product = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(product.produtos).toHaveLength(0)
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

  test('fails to retrieve a product when it does not exist', async ({ request }) => {
    const _id = getUserBody().password
    const response = await request.get(`/produtos/${_id}`)

    const product = await response.json()

    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    expect(product.message).toEqual(IDPRODUTO_INVALIDO)
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
