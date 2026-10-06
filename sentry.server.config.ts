// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { ENVS } from '@/lib/constants/env.constant';

Sentry.init({
  dsn: ENVS.SENTRY_DSN,
  // release 는 빌드 플러그인이 커밋 SHA 로 주입하므로 여기서 지정하지 않는다

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: ENVS.NODE_ENV === 'production',
});
