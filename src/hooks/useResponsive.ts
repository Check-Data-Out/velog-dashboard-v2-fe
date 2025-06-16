import { useEffect, useState } from 'react';

export const useResponsive = (): number => {
  let timer: undefined | NodeJS.Timeout = undefined;
  const [width, setWidth] = useState<number>(1024);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => window.removeEventListener('resize', () => null);
    }

    setWidth(window.innerWidth);

    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWidth(window.innerWidth), 10);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};
