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

const login = async (page, email, password) => {
  await page.type('data-testid=email', email)
  await page.type('data-testid=senha', password)

  await page.click('data-testid=entrar')
}

const createUser = async (page, name, email, password) => {
  await page.type('data-testid=nome', name)
  await page.type('data-testid=email', email)
  await page.type('data-testid=password', password)
  await page.click('data-testid=checkbox')

  await page.click('data-testid=cadastrar')
}

const createProduct = async (page, name, price, description, qt) => {
  await page.type('data-testid=nome', name)
  await page.type('data-testid=preco', price)
  await page.type('data-testid=descricao', description)
  await page.type('data-testid=quantity', qt)

  await page.click('data-testid=cadastarProdutos')
}

const openHomepage = async (page, name, email, password) => {
  await page.goto('/cadastrarusuarios')
  await createUser(page, name, email, password)
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
  login,
  createUser,
  createProduct,
  openHomepage,
  getAuthToken
}
