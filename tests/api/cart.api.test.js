const { test, expect } = require('@playwright/test')
const { POST_SUCESS } = require('serverest/src/utils/constants')

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
    const idProduct = await getProductId(request, authorization, getProductBody())
    const _id = await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.get(`/carrinhos/${_id}`)

    await expect(response).toBeOK()
  })

  test('creates a cart successfully', async ({ request }) => {
    const authorization = await getAuthToken(request)
    const idProduct = await getProductId(request, authorization, getProductBody())

    const response = await request.post('/carrinhos', {
      data: getCartBody(idProduct),
      headers: { 'Authorization': authorization }
    })
    const responseBody = JSON.parse(await response.text())

    await expect(response).toBeOK()
    expect(responseBody.message).toEqual(POST_SUCESS)
  })

  test('delete an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Registro excluído com sucesso')
  })

  test('delete an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Não foi encontrado carrinho para esse usuário')
  })

  test('delete an order without a token', async ({ request }) => {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { 'Authorization': '' }
    })

    await expect(response).not.toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
  })

  test('cancel an order successfully', async ({ request }) => {
    const idProduct = await getProductId(request, authorization, getProductBody())
    await getCartId(request, authorization, getCartBody(idProduct))

    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Registro excluído com sucesso. Estoque dos produtos reabastecido')
  })

  test('cancel an order without a cart', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': authorization }
    })

    await expect(response).toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Não foi encontrado carrinho para esse usuário')
  })

  test('cancel an order without a token', async ({ request }) => {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { 'Authorization': '' }
    })

    await expect(response).not.toBeOK()

    const responseBody = JSON.parse(await response.text())

    await expect(responseBody.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
  })
})
