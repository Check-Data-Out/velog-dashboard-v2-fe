'use client';

import { TrackVisitEvent } from '@/utils';

export default function Layout({ children }: any) {
  return (
    <>
      <TrackVisitEvent />
      {children}
    </>
  );
}
