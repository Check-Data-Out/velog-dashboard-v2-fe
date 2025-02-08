'use client';

import { useEffect, useRef } from 'react';
import { instance } from '@/apis/instance.request';

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

const EVENT_LOG = process.env.NEXT_PUBLIC_EVENT_LOG || 'false';
const STATUS = process.env.NODE_ENV;

export const trackUserEvent = (event_type: keyof typeof MessageEnum) => {
  if (EVENT_LOG === 'true') {
    instance('/event', {
      body: { eventType: MessageEnum[event_type] },
      method: 'POST',
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
    if (STATUS === 'production' && EVENT_LOG === 'true') {
      window.addEventListener('unload', setUnloadData);
    }

    return () => {
      if (STATUS === 'production' && EVENT_LOG === 'true') {
        window.removeEventListener('unload', setUnloadData);
      }
    };
  }, []);

  return <span className="hidden">eventTracker</span>;
};
