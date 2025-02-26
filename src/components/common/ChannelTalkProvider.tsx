'use client';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useEffect } from 'react';
import { env } from '@/constants';

const ChannelTalkServiceLoader = () => {
  ChannelService.loadScript();
  ChannelService.boot({ pluginKey: env.CHANNELTALK_KEY });
};

export const ChannelTalkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => ChannelTalkServiceLoader(), []);
  return <>{children}</>;
};
