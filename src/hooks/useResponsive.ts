import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

const subscribe = (cb: () => void) => {
  if (listeners.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('resize', notify);
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('resize', notify);
    }
  };
};

export const useResponsive = (): number =>
  useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 1024,
  );
