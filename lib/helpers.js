const { faker } = require('@faker-js/faker')

const getUserBody = () => {
  return {
    nome: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true'
  }
}

const getProductBody = () => {
  return {
    nome: `${faker.commerce.product()} SKU: ${faker.finance.account(8)}`,
    preco: faker.commerce.price(100, 200, 0),
    descricao: faker.commerce.productDescription(10),
    quantidade: faker.random.numeric(2)
  }
}

const getProductId = async (request, authorization, body) => {
  const response = await request.post('/produtos', {
    data: body,
    headers: { 'Authorization': authorization }
  })
  const responseBody = await response.json()
  return responseBody._id
}

const getCartBody = (_id) => {
  return {
    produtos: [
      {
        idProduto: _id,
        quantidade: 1
      }
    ]
  }
}

const getCartId = async (request, authorization, body) => {
  const response = await request.post('/carrinhos', {
    data: body,
    headers: { 'Authorization': authorization }
  })
  const responseBody = await response.json()
  return responseBody._id
}

const createUser = async page => {
  await page.type('data-testid=nome', faker.name.findName())
  await page.type('data-testid=email', faker.internet.email())
  await page.type('data-testid=password', faker.internet.password())
  await page.click('data-testid=checkbox')

  await page.click('data-testid=cadastrar')
}

const openHomepage = async page => {
  await page.goto('/cadastrarusuarios')
  await createUser(page)
  await page.waitForNavigation()
}

const getAuthToken = async request => {
  const body = getUserBody()
  const loginBody = {
    email: body.email,
    password: body.password
  }

  await request.post('/usuarios', { data: body })
  const response = await request.post('/login', { data: loginBody })
  const responseBody = await response.json()

  return responseBody.authorization
}

module.exports = {
  getUserBody,
  getProductBody,
  getProductId,
  getCartBody,
  getCartId,
  createUser,
  openHomepage,
  getAuthToken
}
