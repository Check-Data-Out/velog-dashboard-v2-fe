// 클라이언트(브라우저) Sentry 초기화 파일.
// Next.js 의 instrumentation-client 규약 위치이며, @sentry/nextjs 가 빌드 시 클라이언트 엔트리에 주입한다.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // DSN 은 ENVS 대신 process.env 에서 직접 읽는다: 이 파일은 클라이언트 엔트리에 주입되므로
  // ENVS 의 누락 검사(EnvNotFoundError)와 그 의존성을 클라이언트 번들에 끌어오지 않기 위함
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // release: next.config.mjs 참고

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

  // v10.4+ 는 이 옵션 없이는 서버가 요청 IP 로 사용자를 추론하지 않는다.
  // 앱은 Sentry.setUser 를 쓰지 않으므로 IP 기반 Users 집계·지역 정보를 유지하려면 클라이언트에서만 켠다 (server/edge 는 끔)
  sendDefaultPii: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});

// Next 15.3+ 업그레이드 시 활성화되는 네비게이션 계측 훅 — 현재 14.x 에서는 호출되지 않음
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
