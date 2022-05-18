const { matchers } = require('expect-playwright')
const { expect } = require('@playwright/test')

expect.extend(matchers)

process.env.PLAYWRIGHT_EXPERIMENTAL_FEATURES = '1'

module.exports = {
  // retries: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'reports' }]],
  use: {
    baseURL: 'https://front.serverest.dev',
    browsers: ['chromium'],
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    bypassCSP: true,
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-gpu',
        '--disable-dev-shm-usage'
      ],
      headless: true
    }
  }
}
