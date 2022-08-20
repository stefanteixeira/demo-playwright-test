const Joi = require('joi')

const PRODUCT_SCHEMA = Joi.object({
  nome: Joi.string(),
  preco: Joi.number(),
  descricao: Joi.string(),
  quantidade: Joi.number(),
  _id: Joi.string()
})

module.exports = {
  PRODUCT_SCHEMA
}
