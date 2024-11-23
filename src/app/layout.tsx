import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velog Dashboard',
  description: 'Velog 통계를 확인할 수 있는 Velog Dashboard',
  icons: {
    icon: '/favicon.png',
  },
};

const Noto = Noto_Sans_KR({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${Noto.className} w-full h-screen bg-bg-1`}>
        {children}
      </body>
    </html>
  );
}
