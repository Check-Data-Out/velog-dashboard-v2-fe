import { TrackVisitEvent } from '@/utils/trackUtil';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrackVisitEvent />
      {children}
    </>
  );
}
