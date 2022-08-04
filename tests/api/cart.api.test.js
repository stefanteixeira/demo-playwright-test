const { test, expect } = require('@playwright/test')
const { POST_SUCESS, DELETE_SUCESS, SEM_CARRINHO, TOKEN_INVALID, ESTOQUE_REABASTECIDO } = require('serverest/src/utils/constants')
const { StatusCodes } = require('http-status-codes')

const { getAuthToken, getProductBody, getProductId, getCartBody, getCartId } = require('../../lib/helpers')

test.describe.parallel('Carts API', () => {
  let authorization

  test.beforeAll(async ({ request }) => {
    authorization = await getAuthToken(request)
  })

  test('retrieves the list of carts', async ({ request }) => {
    const response = await request.get('/carrinhos')

    expect(response.status()).toEqual(StatusCodes.OK)
  })

  test('retrieves an existing cart by its id', async ({ request }) => {
    const productId = await getProductId(request, authorization, getProductBody())
    const cartId = await getCartId(request, authorization, getCartBody(productId))

    const response = await request.get(`/carrinhos/${cartId}`)

    expect(response.status()).toEqual(StatusCodes.OK)
  })

  test('creates a cart successfully', async ({ request }) => {
    const authorization = await getAuthToken(request)
    const productId = await getProductId(request, authorization, getProductBody())

    const response = await request.post('/carrinhos', {
      data: getCartBody(productId),
      headers: { 'Authorization': authorization }
    })

    expect(response.status()).toEqual(StatusCodes.CREATED)

    const cart = await response.json()

    expect(cart.message).toEqual(POST_SUCESS)
  })

  test('deletes an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })

    expect(response.status()).toEqual(StatusCodes.OK)

    const cart = await response.json()

    expect(await cart.message).toEqual(DELETE_SUCESS)
  })

  test('deletes an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })

    expect(response.status()).toEqual(StatusCodes.OK)

    const cart = await response.json()

    expect(cart.message).toEqual(SEM_CARRINHO)
  })

  test('fails to delete an order if authorization token is not provided', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': '' }
    })

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)

    const cart = await response.json()

    expect(cart.message).toEqual(TOKEN_INVALID)
  })

  test('cancels an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })

    expect(response.status()).toEqual(StatusCodes.OK)

    const cart = await response.json()

    expect(cart.message).toEqual(`${DELETE_SUCESS}. ${ESTOQUE_REABASTECIDO}`)
  })

  test('cancels an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })

    expect(response.status()).toEqual(StatusCodes.OK)

    const cart = await response.json()

    expect(cart.message).toEqual(SEM_CARRINHO)
  })

  test('fails to cancel an order if authorization token is not provided', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': '' }
    })

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)

    const cart = await response.json()

    expect(cart.message).toEqual(TOKEN_INVALID)
  })
})
