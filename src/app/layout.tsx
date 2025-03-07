import { Noto_Sans_KR } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as sentry from '@sentry/nextjs';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { ChannelTalkProvider, QueryProvider } from '@/components';
import { env } from '@/constants';

export const BASE = 'https://velog-dashboard.kro.kr/';

export const metadata: Metadata = {
  title: 'Velog Dashboard',
  metadataBase: new URL(BASE),
  description: '어디서든 편리하게 확인하는 Velog 통계 서비스, Velog Dashboard',
  icons: { icon: '/favicon.png' },
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    siteName: 'Velog Dashboard',
    description:
      '어디서든 편리하게 확인하는 Velog 통계 서비스, Velog Dashboard',
    url: BASE,
    images: [{ url: '/opengraph-image.png', alt: 'Velog Dashboard' }],
    type: 'website',
  },
};

const NotoSansKr = Noto_Sans_KR({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${NotoSansKr.className} w-full bg-BG-MAIN`}>
        <sentry.ErrorBoundary>
          <QueryProvider>
            <ChannelTalkProvider>
              <ToastContainer autoClose={2000} />
              {children}
            </ChannelTalkProvider>
          </QueryProvider>
        </sentry.ErrorBoundary>
      </body>
      <GoogleAnalytics gaId={env.GA_ID} />
    </html>
  );
}
