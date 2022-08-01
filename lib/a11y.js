const { injectAxe, checkA11y } = require('axe-playwright')

const testA11y = async (page, context = undefined) => {
  await injectAxe(page)

  await checkA11y(page, context, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  })
}

module.exports = {
  testA11y
}
