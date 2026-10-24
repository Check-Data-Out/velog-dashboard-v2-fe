import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    // 로컬 실행에서 메모리가 계속 늘어 맥이 멈추던 문제 대응
    // - Electron 은 테스트 브라우저로서 폐기 예정이고, 브라우저 메모리 관리(manageBrowserMemory, 기본 켜짐)는 Chrome 계열 대상이다
    // - cypress open 은 기본으로 테스트 50개의 명령 스냅샷을 메모리에 쌓는다 (run 은 원래 0)
    // - 매 페이지에 붙는 외부 채팅·분석 스크립트(웹소켓 포함)는 테스트에서 막는다
    defaultBrowser: 'chrome',
    numTestsKeptInMemory: 0,
    blockHosts: ['*.channel.io', '*.google-analytics.com', '*.googletagmanager.com', '*.sentry.io'],
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY: 'sample_key',
      NEXT_PUBLIC_GA_ID: 'sample_id',
      NEXT_PUBLIC_SENTRY_DSN: 'sample_dsn',
    },
    /* eslint-disable @typescript-eslint/no-unused-vars */
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
