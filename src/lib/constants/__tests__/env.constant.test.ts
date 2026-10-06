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

  it('Sentry 업로드 토큰 없이도 로드되고, 토큰을 클라이언트 상수로 노출하지 않는다', async () => {
    const { ENVS } = await import('../env.constant');

    expect(ENVS).not.toHaveProperty('SENTRY_AUTH_TOKEN');
    expect(ENVS.SENTRY_DSN).toBe('sample_dsn');
  });

  it('필수 공개 환경 변수가 비어 있으면 오류를 던진다', async () => {
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;

    await expect(import('../env.constant')).rejects.toThrow('SENTRY_DSN');
  });
});
