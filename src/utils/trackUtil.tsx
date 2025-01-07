'use client';

import { useEffect, useRef } from 'react';
import { instance } from '@/apis/instance.request';

type VisitDataType = {
  loadDate?: string;
  unloadDate?: string;
};

enum MessageType {
  '01-01' = 'ENTER',
  '01-02' = 'LOGIN',
  '01-03' = 'NAVIGATE',
  '02-01' = 'SECTION_INTERACT',
  '02-02' = 'SORT_INTERACT_MAIN',
  '02-03' = 'REFRESH_INTERACT',
  '03-01' = 'SORT_INTERACT_BOARD',
}

const EVENT_LOG = process.env.NEXT_PUBLIC_EVENT_LOG;

if (EVENT_LOG === undefined) {
  throw new Error('EVENT_LOG가 ENV에서 설정되지 않았습니다.');
}

export const trackUserEvent = (event_type: MessageType) => {
  const { pathname: path } = window.location;
  if (EVENT_LOG === 'true') {
    instance('/event', { body: { path, event_type }, method: 'POST' });
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
