const { RemoteBrowserTarget } = require('happo.io');

module.exports = {
  apiKey: process.env.HAPPO_API_KEY,
  apiSecret: process.env.HAPPO_API_SECRET,
  compareThreshold: 0.005,
  project: 'demo-playwright-test',
  targets: {
    chrome: new RemoteBrowserTarget('chrome', {
      viewport: '1440x900'
    }),
    firefox: new RemoteBrowserTarget('firefox', {
      viewport: '1440x900'
    }),
    safari: new RemoteBrowserTarget('safari', {
      viewport: '1440x900',
      scrollStitch: true
    }),
    iosSafari: new RemoteBrowserTarget('ios-safari', {
      viewport: '320x568'
    }),
    ipadSafari: new RemoteBrowserTarget('ipad-safari', {
      viewport: '1080x810'
    })
  }
}
