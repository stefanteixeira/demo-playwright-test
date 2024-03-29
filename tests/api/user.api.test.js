const { test, expect } = require('@playwright/test')
const { StatusCodes } = require('http-status-codes')
const { 
  POST_SUCCESS,
  EMAIL_ALREADY_USED,
  USER_NOT_FOUND,
  DELETE_SUCCESS,
  PUT_SUCCESS
} = require('serverest/src/utils/constants')
const { getUserBody } = require('../../lib/helpers')

const getUserId = async (request, body) => {
  const response = await request.post('/usuarios', { data: body })
  const responseBody = await response.json()

  return responseBody._id
}

test.describe.parallel('User API', () => {
  test('retrieves the list of users', async ({ request }) => {
    const response = await request.get('/usuarios')

    expect(response.status()).toEqual(StatusCodes.OK)
  })

  test('creates a user successfully', async ({ request }) => {
    const response = await request.post('/usuarios', { data: getUserBody() })
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.CREATED)
    expect(responseBody.message).toEqual(POST_SUCCESS)
  })

  test('fails to create a user if it already exists', async ({ request }) => {
    const body = getUserBody()
    await request.post('/usuarios', { data: body })

    const response = await request.post('/usuarios', { data: body })
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    expect(responseBody.message).toEqual(EMAIL_ALREADY_USED)
  })

  test('retrieves an existing user by its id', async ({ request }) => {
    const _id = await getUserId(request, getUserBody())

    const response = await request.get(`/usuarios/${_id}`)
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(responseBody._id).toEqual(_id)
  })

  test('fails to retrieve a user if it does not exist', async ({ request }) => {
    const response = await request.get('/usuarios/nonExistingId')
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    expect(responseBody.message).toEqual(USER_NOT_FOUND)
  })

  test('deletes a user successfully', async ({ request }) => {
    const _id = await getUserId(request, getUserBody())

    const response = await request.delete(`/usuarios/${_id}`)
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(responseBody.message).toEqual(DELETE_SUCCESS)
  })

  test('edits a user successfully', async ({ request }) => {
    const _id = await getUserId(request, getUserBody())
    const editBody = getUserBody()

    const response = await request.put(`/usuarios/${_id}`, { data: editBody })
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.OK)
    expect(responseBody.message).toEqual(PUT_SUCCESS)
  })

  test('creates a user by editing a non-existing one', async ({ request }) => {
    const editBody = getUserBody()

    const response = await request.put('/usuarios/nonExistingId', { data: editBody })
    const responseBody = await response.json()

    expect(response.status()).toEqual(StatusCodes.CREATED)
    expect(responseBody.message).toEqual(POST_SUCCESS)
  })
})
