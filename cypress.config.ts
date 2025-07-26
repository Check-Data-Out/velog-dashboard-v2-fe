import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY: 'sample_key',
      NEXT_PUBLIC_GA_ID: 'sample_id',
      NEXT_PUBLIC_SENTRY_AUTH_TOKEN: 'sample_token',
      NEXT_PUBLIC_SENTRY_DSN: 'sample_dsn',
    },
    /* eslint-disable @typescript-eslint/no-unused-vars */
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
