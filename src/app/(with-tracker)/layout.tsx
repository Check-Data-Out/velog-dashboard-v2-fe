import { Suspense } from 'react';
import { TrackVisitEvent } from '@/utils/trackUtil';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <TrackVisitEvent />
      {children}
    </Suspense>
  );
}
