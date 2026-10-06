import { EnvNotFoundError } from '@/lib/errors/dev.error';

export const ENVS = (() => {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    CLIENT_BASE_URL: process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
    CHANNELTALK_PLUGIN_KEY: process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY,
    GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    // Sentry 업로드 토큰은 빌드 시 next.config.mjs 가 SENTRY_AUTH_TOKEN 으로만 읽는다 (클라이언트 번들 비노출)
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  } as const;

  // 테스트 환경이나 브라우저 환경에서는 환경변수 검사 건너뛰기
  if (env.NODE_ENV && typeof window === 'undefined' && !process.env.CYPRESS) {
    Object.entries(env).forEach(([key, value]) => {
      if (!value) throw new EnvNotFoundError(key);
    });
  }

  return env as Record<keyof typeof env, string>;
})();
