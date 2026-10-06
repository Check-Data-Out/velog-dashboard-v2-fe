// 클라이언트(브라우저) Sentry 초기화 파일.
// Next.js 의 instrumentation-client 규약 위치이며, @sentry/nextjs 가 빌드 시 클라이언트 엔트리에 주입한다.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // release 는 빌드 플러그인이 커밋 SHA 로 주입하므로 여기서 지정하지 않는다

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});

// App Router 네비게이션 계측 훅 (Next 15.3+ 에서 호출됨, 그 이전 버전에서는 무시된다)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
