const { test, expect } = require('@playwright/test')
const { POST_SUCESS } = require('serverest/src/utils/constants')
const { StatusCodes } = require('http-status-codes')

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

  test('retrieves an existing cart by its id', async ({ request }) => {
    const productId = await getProductId(request, authorization, getProductBody())
    const cartId = await getCartId(request, authorization, getCartBody(productId))

    const response = await request.get(`/carrinhos/${cartId}`)

    await expect(response).toBeOK()
  })

  test('creates a cart successfully', async ({ request }) => {
    const authorization = await getAuthToken(request)
    const productId = await getProductId(request, authorization, getProductBody())

    const response = await request.post('/carrinhos', {
      data: getCartBody(productId),
      headers: { 'Authorization': authorization }
    })
    const responseBody = JSON.parse(await response.text())

    await expect(response).toBeOK()
    expect(responseBody.message).toEqual(POST_SUCESS)
  })

  test('deletes an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Registro excluído com sucesso')
  })

  test('deletes an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Não foi encontrado carrinho para esse usuário')
  })

  test('fails to delete an order if authorization token is not provided', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': '' }
    })

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
  })

  test('cancels an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Registro excluído com sucesso. Estoque dos produtos reabastecido')
  })

  test('cancels an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Não foi encontrado carrinho para esse usuário')
  })

  test('fails to cancel an order if authorization token is not provided', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': '' }
    })

    await expect(response).not.toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
  })
})
