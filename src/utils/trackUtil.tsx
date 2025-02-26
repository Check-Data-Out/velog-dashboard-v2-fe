'use client';

import { useEffect, useRef } from 'react';
import { instance } from '@/apis';
import { env } from '@/constants';

type VisitDataType = {
  loadDate?: string;
  unloadDate?: string;
};

export const MessageEnum = {
  LOGIN: 11,
  NAVIGATE: 12,
  LOGOUT: 13,
  SECTION_INTERACT_MAIN: 21,
  SORT_INTERACT_MAIN: 22,
  REFRESH_INTERACT_MAIN: 23,
  SORT_INTERACT_BOARD: 31,
} as const;

const { EVENT_LOG, NODE_ENV } = env;

export const trackUserEvent = (event: keyof typeof MessageEnum | number) => {
  const eventType = typeof event === 'number' ? event : MessageEnum[event];

  if (EVENT_LOG === 'true') {
    instance('/event', {
      body: { eventType },
      method: 'POST',
      keepalive: true,
    });
  }
};

export const TrackVisitEvent = () => {
  const data = useRef<VisitDataType>({
    loadDate: undefined,
    unloadDate: undefined,
  });

  const setUnloadData = () => {
    data.current = { ...data.current, unloadDate: new Date().toISOString() };
    instance('/stay', { body: data.current, method: 'POST', keepalive: true });
  };

  useEffect(() => {
    // 페이지 로드 시 시간 기록
    data.current.loadDate = new Date().toISOString();
    if (NODE_ENV === 'production' && EVENT_LOG === 'true') {
      window.addEventListener('unload', setUnloadData);
    }

    return () => {
      if (NODE_ENV === 'production' && EVENT_LOG === 'true') {
        window.removeEventListener('unload', setUnloadData);
      }
    };
  }, []);

  return <span className="hidden">eventTracker</span>;
};
