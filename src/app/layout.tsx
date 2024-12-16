import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import { Noto_Sans_KR } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import * as sentry from '@sentry/nextjs';

import type { Metadata } from 'next';
import { QueryProvider } from '@/components';
export const metadata: Metadata = {
  title: 'Velog Dashboard',
  description: 'Velog 통계를 확인할 수 있는 Velog Dashboard',
  icons: {
    icon: '/favicon.jpg',
  },
};

const NotoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${NotoSansKr.className} w-full h-screen bg-bg-main`}>
        <sentry.ErrorBoundary>
          <QueryProvider>
            <ToastContainer autoClose={2000} />
            {children}
          </QueryProvider>
        </sentry.ErrorBoundary>
      </body>
    </html>
  );
}
