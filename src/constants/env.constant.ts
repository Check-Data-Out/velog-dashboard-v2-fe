import { EnvNotFoundError } from '../errors/fetch.error';

export const env = (() => {
  if (process) {
    const requiredEnv = process.env as Required<Record<string, string>>;

    const env: Record<string, string> = {
      NODE_ENV: requiredEnv.NODE_ENV,
      BASE_URL: requiredEnv.NEXT_PUBLIC_BASE_URL,
      ABORT_MS: requiredEnv.NEXT_PUBLIC_ABORT_MS,
      EVENT_LOG: requiredEnv.NEXT_PUBLIC_EVENT_LOG,
      VELOG_URL: requiredEnv.NEXT_PUBLIC_VELOG_URL,
      CHANNELTALK_KEY: requiredEnv.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY,
      GA_ID: requiredEnv.NEXT_PUBLIC_GA_ID,
      SENTRY_AUTH_TOKEN: requiredEnv.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
      SENTRY_DSN: requiredEnv.NEXT_PUBLIC_SENTRY_DSN,
    };

    if (env.NODE_ENV) {
      Object.entries(env).forEach(([key, value]) => {
        if (!value) throw new EnvNotFoundError(key);
      });
    }

    return env;
  }
  return {};
})();
