import { GoogleAnalytics } from '@next/third-parties/google';
import { Noto_Sans_KR } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from '@sentry/nextjs';
import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import HolyLoader from 'holy-loader';
import { ChannelTalkProvider, QueryProvider, ModalProvider } from '@/components';
import { env } from '@/constants';

export const BASE = 'https://velog-dashboard.kro.kr/';

export const metadata: Metadata = {
  title: 'Velog Dashboard',
  metadataBase: new URL(BASE),
  description: '어디서든 편리하게 확인하는 Velog 통계 서비스, Velog Dashboard',
  icons: { icon: '/favicon.png' },
  alternates: { canonical: BASE },
  openGraph: {
    siteName: 'Velog Dashboard',
    description: '어디서든 편리하게 확인하는 Velog 통계 서비스, Velog Dashboard',
    url: BASE,
    images: [{ url: '/opengraph-image.png', alt: 'Velog Dashboard' }],
    type: 'website',
  },
};

const NotoSansKr = Noto_Sans_KR({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${NotoSansKr.className} w-full bg-BG-MAIN`}>
        <HolyLoader speed={400} height="0.25rem" easing="linear" color="#96f2d7" />
        <ErrorBoundary>
          <QueryProvider>
            <ChannelTalkProvider>
              <ToastContainer autoClose={2000} />
              <ModalProvider />
              <Suspense>
                {children}
                <div className="flex items-center max-MBI:justify-center px-2 py-1 absolute bottom-0 left-0 w-full gap-2">
                  <a
                    href="https://nuung.notion.site/terms-of-service"
                    className="text-TEXT-ALT text-[14px]"
                  >
                    서비스 이용약관
                  </a>
                  <div className="w-[1px] h-[15px] bg-TEXT-ALT" />
                  <a
                    href="https://nuung.notion.site/privacy-policy"
                    className="text-TEXT-ALT text-[14px]"
                  >
                    개인정보처리방침
                  </a>
                  <div className="w-[1px] h-[15px] bg-TEXT-ALT max-MBI:hidden" />
                  <span className="text-TEXT-ALT text-[14px] max-MBI:hidden">
                    해당 서비스를 사용하실 경우, 약관에 동의하는 것으로 간주합니다.
                  </span>
                </div>
              </Suspense>
            </ChannelTalkProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
      <GoogleAnalytics gaId={env.GA_ID} />
    </html>
  );
}
