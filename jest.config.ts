import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '^@sentry/nextjs$': '<rootDir>/node_modules/@sentry/nextjs',
    '\\.svg$': '<rootDir>/src/shared/Icon/SvgrMock.tsx',
  },
};

// sanitize-html 이 쓰는 htmlparser2 계열은 ESM 전용이라 변환해야 한다.
// next/jest 는 사용자 transformIgnorePatterns 를 덮어쓰지 않고 뒤에 붙이므로 만들어진 설정에서 바꾼다.
const ESM_PACKAGES = [
  'htmlparser2',
  'domhandler',
  'domutils',
  'entities',
  'domelementtype',
  'dom-serializer',
];

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = [
    `/node_modules/\\.pnpm/(?!(${ESM_PACKAGES.join('|')})@)`,
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
};
