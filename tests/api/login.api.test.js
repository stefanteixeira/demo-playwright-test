const { test, expect } = require('@playwright/test')

const { getUserBody } = require('../../lib/helpers')

test.describe.parallel('Login API', () => {
  let body

  test.beforeEach(async ({ request }) => {
    body = getUserBody()

    await request.post('/usuarios', { data: body })
  })

  test('performs a successful login if user data is valid', async ({ request }) => {
    const loginBody = {
      email: body.email,
      password: body.password
    }

    const response = await request.post('/login', { data: loginBody })

    await expect(response).toBeOK()
  })

  test('fails to login if user email is invalid', async ({ request }) => {
    const loginBody = {
      email: 'invalid@email.com',
      password: body.password
    }

    const response = await request.post('/login', { data: loginBody })

    await expect(response).not.toBeOK()
  })

  test('fails to login if user password is invalid', async ({ request }) => {
    const loginBody = {
      email: body.email,
      password: 'invalid-password'
    }

    const response = await request.post('/login', { data: loginBody })

    await expect(response).not.toBeOK()
  })
})
