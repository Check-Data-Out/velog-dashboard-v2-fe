import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ENVS, URLS } from '@/constants';
import { Provider } from './components';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velog Dashboard',
  metadataBase: new URL(URLS.VELOG_DASHBOARD),
  description: '어디서든 편리하게 확인하는 Velog 통계 서비스, Velog Dashboard',
  icons: { icon: '/favicon.png' },
  alternates: { canonical: URLS.VELOG_DASHBOARD },
  openGraph: {
    siteName: 'Velog Dashboard',
    description: '어디서든 편리하게 확인하는 Velog 통계 서비스, Velog Dashboard',
    url: URLS.VELOG_DASHBOARD,
    images: [{ url: '/opengraph-image.png', alt: 'Velog Dashboard' }],
    type: 'website',
  },
};

const NotoSansKr = Noto_Sans_KR({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" translate="no">
      <body className={`${NotoSansKr.className} w-full bg-BG-MAIN`}>
        <Provider>{children}</Provider>
      </body>
      <GoogleAnalytics gaId={ENVS.GA_ID} />
    </html>
  );
}
