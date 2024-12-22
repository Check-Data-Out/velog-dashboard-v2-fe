import { useEffect, useState } from 'react';

export const useResponsive = (): number => {
  let timer: undefined | NodeJS.Timeout = undefined;
  const [width, setWidth] = useState<number>(1024);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      const handleResize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setWidth(window.innerWidth);
        }, 80);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else {
      return () => window.removeEventListener('resize', () => null);
    }
  }, []);

  return width;
};
