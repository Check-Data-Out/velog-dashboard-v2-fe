import { EnvNotFoundError } from '../errors';

export const ENVS = (() => {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    ABORT_MS: process.env.NEXT_PUBLIC_ABORT_MS,
    CHANNELTALK_PLUGIN_KEY: process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY,
    GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    SENTRY_AUTH_TOKEN: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  } as const;

  if (env.NODE_ENV) {
    Object.entries(env).forEach(([key, value]) => {
      if (!value) throw new EnvNotFoundError(key);
    });
  }

  return env as Record<keyof typeof env, string>;
})();
