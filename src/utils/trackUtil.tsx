'use client';

import { useEffect, useRef } from 'react';
import { instance } from '@/apis/instance.request';

type VisitDataType = {
  loadDate?: string;
  unloadDate?: string;
};

export const MessageEnum = {
  LOGIN: '01-01',
  NAVIGATE: '01-02',
  LOGOUT: '01-03',
  SECTION_INTERACT_MAIN: '02-01',
  SORT_INTERACT_MAIN: '02-02',
  REFRESH_INTERACT_MAIN: '02-03',
  SORT_INTERACT_BOARD: '03-01',
} as const;

const EVENT_LOG = process.env.NEXT_PUBLIC_EVENT_LOG;

if (EVENT_LOG === undefined) {
  throw new Error('EVENT_LOG가 ENV에서 설정되지 않았습니다.');
}

export const trackUserEvent = (event_type: keyof typeof MessageEnum) => {
  if (EVENT_LOG === 'true') {
    instance('/event', { body: { eventType: event_type }, method: 'POST' });
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
    if (process.env.NODE_ENV === 'production' && EVENT_LOG === 'true') {
      window.addEventListener('unload', setUnloadData);
    }

    return () => {
      if (process.env.NODE_ENV === 'production' && EVENT_LOG === 'true') {
        window.removeEventListener('unload', setUnloadData);
      }
    };
  }, []);

  return <span className="hidden">eventTracker</span>;
};
