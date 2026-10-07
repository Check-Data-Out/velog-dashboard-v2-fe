import { withSentryConfig } from '@sentry/nextjs/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: reactStrictMode false 없이도 오류 토스트가 정상적으로 표시되도록 개선
  reactStrictMode: false,
  experimental: { forceSwcTransforms: true, workerThreads: false, cpus: 1 },
  output: 'standalone',
  productionBrowserSourceMaps: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [options.defaultLoaders.babel, { loader: '@svgr/webpack', options: { babel: false } }],
    });
    if (!options.dev) {
      config.devtool =
        process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'inline-source-map';
    }

    return config;
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'velog.velcdn.com', pathname: '**' },
      { protocol: 'https', hostname: 'images.velog.io', pathname: '**' },
      { protocol: 'https', hostname: 'velog-dashboard.kro.kr', pathname: '**' },
      { protocol: 'http', hostname: 'localhost', pathname: '**' },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // 센트리 동작을 위한 기본값
  // 업로드 토큰은 빌드 시에만 필요하므로 NEXT_PUBLIC_ 접두 없이 읽어 클라이언트 번들에 인라인되지 않게 한다
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: 'velog-dashboardv2',
  project: 'vd-fe',

  widenClientFileUpload: true, // 파일의 크기가 비교적 큰 대신, 더 상세한 정보를 포함하는 소스맵 파일 생성
  sourcemaps: { deleteSourcemapsAfterUpload: true }, // 소스맵 파일 업로드 후 자동 제거 (클라이언트 소스맵 은닉은 v9+ 기본 동작)

  silent: !process.env.CI, // CI 진행시에만 로그가 표시되도록 강제

  // release 는 지정하지 않는다: 플러그인이 SENTRY_RELEASE 환경 변수 → CI 커밋 SHA(GITHUB_SHA 등) → `git rev-parse HEAD`
  // 순서로 결정해 세 런타임(client/server/edge)에 같은 값을 주입한다
  webpack: {
    // v11 에서는 최상위 reactComponentAnnotation 으로 복귀 (migration/v10-to-v11)
    reactComponentAnnotation: { enabled: true }, // 세션 리플레이와 브레드크럼에서 상세한 컴포넌트명 표시
    treeshake: { removeDebugLogging: true }, // 번들 사이즈 감소를 위해 센트리 기본 로그 메세지 트리셰이크
  },

  tunnelRoute: '/monitoring', // ad-blocker 우회용 엔드포인트 (이벤트 로깅 관련)
});
