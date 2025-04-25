import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { forceSwcTransforms: true },
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
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // 센트리 동작을 위한 기본값
  authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
  org: 'velog-dashboardv2',
  project: 'vd-fe',

  widenClientFileUpload: true, // 파일의 크기가 비교적 큰 대신, 더 상세한 정보를 포함하는 소스맵 파일 생성
  sourcemaps: { deleteSourcemapsAfterUpload: true }, // 소스맵 파일 업로드 후 자동 제거
  hideSourceMaps: true, // 클라이언트 대상의 소스맵 파일 은닉

  silent: !process.env.CI, // CI 진행시에만 로그가 표시되도록 강제
  disableLogger: true, // 번들 사이즈 감소를 위해 센트리 기본 로그 메세지 트리셰이크

  reactComponentAnnotation: { enabled: true }, // 세션 리플레이와 브레드크럼에서 상세한 컴포넌트명 표시

  tunnelRoute: '/monitoring', // ad-blocker 우회를 위한 경로 (저희가 이전에 왜 생기는지 이유를 추측했던 그 경로 맞습니다..)
});
