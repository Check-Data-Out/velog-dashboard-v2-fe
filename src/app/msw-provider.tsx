'use client';

import { useEffect, useState } from 'react';

interface MSWProviderProps {
  children: React.ReactNode;
}

export default function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        if (process.env.NODE_ENV === 'development') {
          const { worker } = await import('../__mock__/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
            quiet: true,
          });
        }
      }
      setMswReady(true);
    };

    init();
  }, []);

  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
}
