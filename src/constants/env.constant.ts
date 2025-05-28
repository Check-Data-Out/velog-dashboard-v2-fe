import { EnvNotFoundError } from '../errors/fetch.error';

export const env = (() => {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    ABORT_MS: process.env.NEXT_PUBLIC_ABORT_MS,
    EVENT_LOG: process.env.NEXT_PUBLIC_EVENT_LOG,
    VELOG_URL: process.env.NEXT_PUBLIC_VELOG_URL,
    CHANNELTALK_PLUGIN_KEY: process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY,
    GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    SENTRY_AUTH_TOKEN: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ARCADE_URL: process.env.NEXT_PUBLIC_ARCADE_URL,
  } as const;

  if (env.NODE_ENV) {
    Object.entries(env).forEach(([key, value]) => {
      if (!value) throw new EnvNotFoundError(key);
    });
  }

  return env as Record<keyof typeof env, string>;
})();
