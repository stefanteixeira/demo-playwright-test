const toMatchSchema = (received, schema) => {
  const { error } = schema.validate(received, { presence: 'required' })
  const pass = !error

  if (pass) {
    return {
      pass: true
    }
  }

  return {
    message: () => `${error}`,
    pass: false
  }
}

module.exports = {
  toMatchSchema
}
