[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)

# demo-playwright-test

This is a sample project to demonstrate [Playwright Test](https://playwright.dev/) usage, running tests against ServeRest [API](https://serverest.dev/) and [Front-end](https://front.serverest.dev/).

## Pre-requisites

Make sure to have the correct Node version installed, which can be found in `.nvmrc` file in the repository root. It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage different Node versions in your environment.

The project also uses [Yarn](https://yarnpkg.com/), so follow the [installation steps](https://classic.yarnpkg.com/lang/en/docs/install/) in case you don't have it.

## Structure

Code is structured as shown below:

```
demo-playwright-test/
 ├── lib/
 │    ├── helpers.js                        # Helper functions used in tests
 ├── tests/
 │    ├── api
 │         ├── login.api.test.js            # API tests
 │    ├── e2e
 │         ├── create-user.e2e.test.js      # End-to-end tests
 ├── playwright.config.js                   # Playwright configuration file
```

**PS:** Note that different test levels are configured to have proper extensions (e.g: `*.api.test.js`).

## Running locally

- Install dependencies: `yarn install`
- Run API tests: `yarn test:api`
- Run End-to-end tests: `yarn test:e2e`

## CI

The project uses [GitHub Actions](https://docs.github.com/en/actions) and tests are run automatically on PRs and on merge to `main` branch.
