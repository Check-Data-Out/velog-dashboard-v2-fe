import { ToastContainer } from 'react-toastify';
import { Noto_Sans_KR } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { QueryProvider } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velog Dashboard',
  description: 'Velog 통계를 확인할 수 있는 Velog Dashboard',
  icons: {
    icon: '/favicon.png',
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
        <QueryProvider>
          <ToastContainer autoClose={2000} />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
