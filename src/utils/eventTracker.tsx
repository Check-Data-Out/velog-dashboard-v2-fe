'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { instance } from '@/api';

type VisitDataType = {
  loadDate: null | string;
  unloadDate: null | string;
  visitTime: null | string;
  path: string;
};

export const trackUserEvent = (message: string) => {
  const { pathname } = window.location;
  instance('/track/user', {
    body: { path: pathname, message },
    method: 'POST',
  });
};

export const TrackVisitEvent = () => {
  const pathname = usePathname();

  const data = useRef<VisitDataType>({
    loadDate: null,
    unloadDate: null,
    visitTime: null,
    path: pathname,
  });

  const setUnloadData = () => {
    const date = new Date().toISOString();
    data.current = {
      ...data.current,
      unloadDate: date,
      visitTime: (
        new Date(date).getTime() -
        new Date(data.current.loadDate as string).getTime()
      ).toString(),
    };
    navigator.sendBeacon(
      `${process.env.NEXT_PUBLIC_BASE_URL}/track/visit`,
      data.current.toString(),
    );
  };

  useEffect(() => {
    // 페이지 로드 시 시간 기록
    data.current.loadDate = new Date().toISOString();
    window.addEventListener('unload', setUnloadData);

    return () => {
      window.removeEventListener('unload', setUnloadData);
    };
  }, []);

  return <span className="hidden">eventTracker</span>;
};
