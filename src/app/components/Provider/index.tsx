'use client';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { ErrorBoundary } from '@sentry/nextjs';
import HolyLoader, { HolyLoaderProps } from 'holy-loader';
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
