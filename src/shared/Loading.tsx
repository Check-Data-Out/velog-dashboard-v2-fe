'use client';

import { useEffect, useState } from 'react';

export const Loading = () => {
  const [dotCount, setDotCount] = useState(0);
  const texts = ['업데이트중', '업데이트중.', '업데이트중..', '업데이트중...'];

  useEffect(() => {
    const timer = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return <>{texts[dotCount]}</>;
};
