const { test, expect } = require('@playwright/test')

const { getUserBody } = require('../../lib/helpers')

const getUserId = async (request, body) => {
  const response = await request.post('/usuarios', { data: body })
  const responseBody = JSON.parse(await response.text())

  return responseBody._id
}

test.describe.parallel('User API', () => {
  test('retrieves the list of users', async ({ request }) => {
    const response = await request.get('/usuarios')

    await expect(response).toBeOK()
  })

  test('creates an user successfully', async ({ request }) => {
    const response = await request.post('/usuarios', { data: getUserBody() })

    await expect(response).toBeOK()
  })

  test('fails to create an user if it already exists', async ({ request }) => {
    const body = getUserBody()
    await request.post('/usuarios', { data: body })

    const response = await request.post('/usuarios', { data: body })

    await expect(response).not.toBeOK()
  })

  test('retrieves an existing user by its id', async ({ request }) => {
    const id = await getUserId(request, getUserBody())

    const response = await request.get(`/usuarios/${id}`)

    await expect(response).toBeOK()
  })

  test('fails to retrieve an user if it does not exist', async ({ request }) => {
    const response = await request.get('/usuarios/nonExistingId')

    await expect(response).not.toBeOK()
  })
})
