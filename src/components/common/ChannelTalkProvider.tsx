'use client';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useEffect } from 'react';

const ChannelTalkServiceLoader = () => {
  const CHANNELTALK_PLUGIN_KEY = process.env.NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY;
  if (!CHANNELTALK_PLUGIN_KEY) {
    throw new Error('ABORT_MS가 ENV에서 설정되지 않았습니다');
  }
  console.log(CHANNELTALK_PLUGIN_KEY);

  ChannelService.loadScript();
  ChannelService.boot({ pluginKey: CHANNELTALK_PLUGIN_KEY });
};

export const ChannelTalkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => ChannelTalkServiceLoader(), []);
  return <>{children}</>;
};
