const { test, expect } = require('@playwright/test')
const {
  POST_SUCCESS,
  DELETE_SUCCESS,
  NO_CART,
  INVALID_TOKEN,
  REPLENISHED_STOCK
} = require('serverest/src/utils/constants')
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
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.CREATED)
    expect(cart.message).toEqual(POST_SUCCESS)
  })

  test('deletes an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(await cart.message).toEqual(DELETE_SUCCESS)
  })

  test('deletes an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(cart.message).toEqual(NO_CART)
  })

  test('fails to delete an order if authorization token is not provided', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': '' }
    })
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    expect(cart.message).toEqual(INVALID_TOKEN)
  })

  test('cancels an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(cart.message).toEqual(`${DELETE_SUCCESS}. ${REPLENISHED_STOCK}`)
  })

  test('cancels an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(cart.message).toEqual(NO_CART)
  })

  test('fails to cancel an order if authorization token is not provided', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': '' }
    })
    const cart = await response.json()

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    expect(cart.message).toEqual(INVALID_TOKEN)
  })
})
