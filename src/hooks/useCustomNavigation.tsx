import { create } from 'zustand';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const useNavStatus = create<{
  isNavigating: boolean;
  flip: () => void;
  start: () => void;
  complete: () => void;
}>((set) => ({
  isNavigating: false,
  flip: () => set(({ isNavigating }) => ({ isNavigating: !isNavigating })),
  start: () => set({ isNavigating: true }),
  complete: () => set({ isNavigating: false }),
}));

export const useCustomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isNavigating, start, complete } = useNavStatus();

  const replace = (target: string) => {
    router.replace(target);
    start();
  };

  // 이전 경로와 검색 파라미터를 저장하기 위한 ref
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      complete();
    }
  }, [pathname]);

  return { isNavigating, start, complete, replace };
};
