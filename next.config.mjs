import { withSentryConfig } from '@sentry/nextjs/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: reactStrictMode false 없이도 오류 토스트가 정상적으로 표시되도록 개선
  reactStrictMode: false,
  experimental: { workerThreads: false, cpus: 1 },
  output: 'standalone',
  productionBrowserSourceMaps: true,
  turbopack: {
    rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'velog.velcdn.com', pathname: '**' },
      { protocol: 'https', hostname: 'images.velog.io', pathname: '**' },
      { protocol: 'https', hostname: 'velog-dashboard.kro.kr', pathname: '**' },
      { protocol: 'http', hostname: 'localhost', pathname: '**' },
    ],
    // 로컬 개발에서는 배지 미리보기가 localhost 이미지를 최적화하므로 dev 에서만 로컬 IP 를 허용한다
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    // Next 16 기본값(4시간)이면 배지 미리보기가 배지 응답의 max-age(1시간)보다 오래 남으므로 이전 기본값을 유지한다
    minimumCacheTTL: 60,
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
  // Turbopack 빌드에는 webpack 전용 옵션(reactComponentAnnotation·treeshake)이 적용되지 않는다
  _experimental: {
    turbopackReactComponentAnnotation: { enabled: true }, // 세션 리플레이와 브레드크럼에서 상세한 컴포넌트명 표시
  },

  tunnelRoute: '/monitoring', // ad-blocker 우회용 엔드포인트 (이벤트 로깅 관련)
});
