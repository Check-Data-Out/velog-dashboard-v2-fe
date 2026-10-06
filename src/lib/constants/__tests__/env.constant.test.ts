/**
 * @jest-environment node
 *
 * ENVS 는 서버(node) 환경에서만 누락 검사를 수행하므로 node 환경에서 검증한다.
 */

const REQUIRED_PUBLIC_ENVS = {
  NEXT_PUBLIC_BASE_URL: 'http://localhost:8080/api',
  NEXT_PUBLIC_CLIENT_BASE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY: 'sample_key',
  NEXT_PUBLIC_GA_ID: 'sample_id',
  NEXT_PUBLIC_SENTRY_DSN: 'sample_dsn',
};

describe('ENVS', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NODE_ENV: 'production', ...REQUIRED_PUBLIC_ENVS };
    delete process.env.CYPRESS;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('운영 서버 환경에서 Sentry 업로드 토큰 없이도 로드된다', async () => {
    await expect(import('../env.constant')).resolves.toBeDefined();
  });

  // 대조군: 위 테스트가 "검사를 건너뛰어서" 통과한 것이 아님을 보이기 위해 필수 키 누락은 여전히 실패해야 한다
  it('(대조군) 필수 공개 환경 변수가 비어 있으면 오류를 던진다', async () => {
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;

    await expect(import('../env.constant')).rejects.toThrow('SENTRY_DSN');
  });
});
