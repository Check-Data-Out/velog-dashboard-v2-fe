import { create } from 'zustand';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

type NavStatusStore = {
  isNavigating: boolean;
  flip: () => void;
  start: () => void;
  complete: () => void;
};

const useNavStatus = create<NavStatusStore>((set) => ({
  isNavigating: false,
  flip: () => set(({ isNavigating }) => ({ isNavigating: !isNavigating })),
  start: () => set({ isNavigating: true }),
  complete: () => set({ isNavigating: false }),
}));

export const useCustomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const { isNavigating, start, complete } = useNavStatus();

  const replace = useCallback(
    (target: string) => {
      router.replace(target);
      start();
    },
    [pathname],
  );

  const push = useCallback(
    (target: string) => {
      router.push(target);
      start();
    },
    [pathname],
  );

  useEffect(() => {
    // 페이지 이동 완료 감지
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      complete();
    }
  }, [pathname]);

  return { isNavigating, start, push, complete, replace };
};
