import { partitionSecretKeys } from '../env-keys.mjs';

describe('partitionSecretKeys', () => {
  it('토큰·시크릿·비밀번호·개인키 이름의 키는 워크플로에 쓰지 않도록 분리한다', () => {
    const { allowed, skipped } = partitionSecretKeys([
      'NEXT_PUBLIC_BASE_URL',
      'SENTRY_AUTH_TOKEN',
      'NEXT_PUBLIC_SENTRY_AUTH_TOKEN',
      'NEXT_PUBLIC_SENTRY_DSN',
      'DB_PASSWORD',
      'API_SECRET',
      'SSH_PRIVATE_KEY',
    ]);

    expect(allowed).toEqual(['NEXT_PUBLIC_BASE_URL', 'NEXT_PUBLIC_SENTRY_DSN']);
    expect(skipped).toEqual([
      'SENTRY_AUTH_TOKEN',
      'NEXT_PUBLIC_SENTRY_AUTH_TOKEN',
      'DB_PASSWORD',
      'API_SECRET',
      'SSH_PRIVATE_KEY',
    ]);
  });
});
