'use client';

import { useEffect, useRef } from 'react';
import { instance } from '@/apis/instance.request';

type VisitDataType = {
  loadDate?: string;
  unloadDate?: string;
};

type MessageType = '01' | '02' | '03' | '04' | '99';

export const trackUserEvent = (event_type: MessageType) => {
  const { pathname: path } = window.location;
  instance('/event', { body: { path, event_type }, method: 'POST' });
};

export const TrackVisitEvent = () => {
  const data = useRef<VisitDataType>({
    loadDate: undefined,
    unloadDate: undefined,
  });

  const setUnloadData = () => {
    data.current = {
      ...data.current,
      unloadDate: new Date().toISOString(),
    };
    instance('/stay', { body: data.current, method: 'POST', keepalive: true });
  };

  useEffect(() => {
    // 페이지 로드 시 시간 기록
    data.current.loadDate = new Date().toISOString();
    window.addEventListener('unload', setUnloadData);

    return () => window.removeEventListener('unload', setUnloadData);
  }, []);

  return <span className="hidden">eventTracker</span>;
};
