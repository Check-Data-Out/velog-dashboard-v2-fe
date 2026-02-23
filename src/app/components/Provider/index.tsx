'use client';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { ErrorBoundary } from '@sentry/nextjs';
import HolyLoader, { HolyLoaderProps } from 'holy-loader';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { COLORS, ENVS } from '@/constants';
import { ModalContainer } from './ModalContainer';
import { QueryProvider } from './QueryProvider';
import { TermsOfService } from './TermsOfService';

const HolyLoaderOptions: HolyLoaderProps = {
  speed: 400,
  height: '0.25rem',
  easing: 'linear',
  color: COLORS.PRIMARY.MAIN,
};

const ToastContainerOptions: ToastContainerProps = { autoClose: 2000 };

const ChannelTalkServiceLoader = () => {
  ChannelService.loadScript();
  ChannelService.boot({ pluginKey: ENVS.CHANNELTALK_PLUGIN_KEY });
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => ChannelTalkServiceLoader(), []);
  const router = useRouter();

  // TODO: 커스텀 이벤트 관련 로직 더 사용하고 공통 로직으로 분리하기
  useEffect(() => {
    const handleUnauthorized = () => {
      router.push('/');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [router]);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <Suspense>
          <HolyLoader {...HolyLoaderOptions} />
          <ToastContainer {...ToastContainerOptions} />
          <ModalContainer />
          <TermsOfService />
          {children}
        </Suspense>
      </QueryProvider>
    </ErrorBoundary>
  );
};
