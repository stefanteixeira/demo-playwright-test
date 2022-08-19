const { test, expect } = require('@playwright/test')
const { StatusCodes } = require('http-status-codes')
const { 
  LOGIN_SUCCESS, 
  LOGIN_FAIL 
} = require('serverest/src/utils/constants')
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
    const login = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(login.message).toEqual(LOGIN_SUCCESS)
  })

  test('fails to login if user email is invalid', async ({ request }) => {
    const loginBody = {
      email: 'invalid@email.com',
      password: body.password
    }

    const response = await request.post('/login', { data: loginBody })
    const login = await response.json()

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    expect(login.message).toEqual(LOGIN_FAIL)
  })

  test('fails to login if user password is invalid', async ({ request }) => {
    const loginBody = {
      email: body.email,
      password: 'invalid-password'
    }

    const response = await request.post('/login', { data: loginBody })
    const login = await response.json()

    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    expect(login.message).toEqual(LOGIN_FAIL)
  })
})
