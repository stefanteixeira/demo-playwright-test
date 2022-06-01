const { faker } = require('@faker-js/faker')

const getUserBody = () => {
  return {
    nome: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true'
  }
}

module.exports = {
  getUserBody
}
