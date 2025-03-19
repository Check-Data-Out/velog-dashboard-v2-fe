'use client';
import { useEffect, useRef, useState } from 'react';
import { useCustomNavigation } from '@/hooks';
import { COLORS } from '@/constants';

const START_TIME_MS = 150;
const REMOVE_BAR_TIME_MS = 400;
const INCREASE_INTERVAL_MS = 300;
const INCREASE_LEVEL = [0.6, 0.3, 0.1];

export const TopBarProvider = () => {
  const { isNavigating } = useCustomNavigation();

  const [width, setWidth] = useState(0);
  const initialLoadDone = useRef(false);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (isNavigating) {
      initialLoadDone.current = false;
      setWidth(0);

      const initialTimer = setTimeout(() => {
        setWidth(20);
        initialLoadDone.current = true;

        // 20%에서 조금씩 증가
        intervalRef.current = setInterval(() => {
          setWidth((prevWidth) => {
            if (prevWidth < 60)
              return prevWidth + Math.random() * INCREASE_LEVEL[0];
            else if (prevWidth < 90)
              return prevWidth + Math.random() * INCREASE_LEVEL[1];
            else return prevWidth + Math.random() * INCREASE_LEVEL[2];
          });
        }, INCREASE_INTERVAL_MS);
      }, START_TIME_MS);

      return () => {
        clearTimeout(initialTimer);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else if (initialLoadDone.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setWidth(100);

      const hideTimer = setTimeout(() => setWidth(0), REMOVE_BAR_TIME_MS);
      return () => clearTimeout(hideTimer);
    }
  }, [isNavigating]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1">
      <div
        className={`h-full transition-all bg-PRIMARY-MAIN shadow-[0_0_3px_${COLORS.PRIMARY.SUB}] duration-300 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};
