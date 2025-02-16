import { Noto_Sans_KR } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as sentry from '@sentry/nextjs';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { ChannelTalkProvider, QueryProvider } from '@/components';

export const metadata: Metadata = {
  title: 'Velog Dashboard',
  description: 'Velog 통계를 확인할 수 있는 Velog Dashboard',
  icons: { icon: '/favicon.png' },
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
    </html>
  );
}
