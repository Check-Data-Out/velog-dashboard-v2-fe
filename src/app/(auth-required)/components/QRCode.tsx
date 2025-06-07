'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { COLORS, env, PATHS, SCREENS } from '@/constants';
import { useResponsive } from '@/hooks';
import { createQRToken } from '@/apis';
import { Modal as Layout } from '@/components';

const TIMEOUT_MS = 1000;
const TIMER_DURATION = 5 * 60; // 5분 = 300초

export const QRCode = () => {
  const width = useResponsive();

  const [clicked, setClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const clickedRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isExpired = timeLeft === 0;

  const { data, isSuccess, refetch } = useQuery({
    queryKey: [PATHS.QRLOGIN],
    queryFn: createQRToken,
    refetchOnMount: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const url = `${env.BASE_URL}/api/qr-login?token=${data?.token}`;

  // 타이머 시작
  useEffect(() => {
    if (isSuccess && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSuccess, timeLeft]);

  // 시간 포맷팅 (MM분 SS초)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}분 ${remainingSeconds.toString().padStart(2, '0')}초`;
  };

  const handleClick = async () => {
    if (clicked || !data?.token) return;

    try {
      await navigator.clipboard.writeText(url);
      setClicked(true);

      if (clickedRef.current) clearTimeout(clickedRef.current);

      clickedRef.current = setTimeout(() => setClicked(false), TIMEOUT_MS);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <Layout title="QR 로그인">
      {isSuccess ? (
        <>
          <div className="flex items-center justify-center gap-10">
            <div className="relative">
              <QRCodeSVG
                value={url}
                width={width < SCREENS.MBI ? 130 : 171}
                height={width < SCREENS.MBI ? 130 : 171}
                enableBackground={0}
                bgColor={COLORS.BG.SUB}
                fgColor={COLORS.TEXT.MAIN}
                className={`transition-all ${isExpired ? 'opacity-30 blur-sm' : ''}`}
              />
              {isExpired && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-BG-MAIN text-TEXT-MAIN px-3 py-1 rounded-lg font-medium text-sm">
                    만료됨
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-T4 text-TEXT-ALT leading-none">만료까지</h3>
              <h2
                className={`text-T2 leading-none min-w-[130px] text-center ${timeLeft <= 60 ? 'text-DESTRUCTIVE-SUB' : 'text-TEXT-MAIN'}`}
              >
                {formatTime(timeLeft)}
              </h2>
              {isExpired && (
                <button
                  className="text-I1 text-BG-MAIN bg-PRIMARY-MAIN px-5 py-1 rounded-sm"
                  onClick={async () => {
                    await refetch();
                    setTimeLeft(TIMER_DURATION);
                  }}
                >
                  새로고침
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={isExpired}
            className={`
              relative block p-4 rounded-lg leading-none overflow-hidden transition-all duration-200
              after:absolute after:inset-0 after:flex after:items-center after:justify-center truncate
              after:rounded-lg after:transition-all after:duration-300 after:font-medium after:pointer-events-none
              ${
                isExpired
                  ? 'cursor-not-allowed bg-BG-ALT text-TEXT-SUB opacity-50'
                  : clicked
                    ? 'cursor-pointer bg-BG-MAIN text-TEXT-MAIN hover:shadow-lg after:content-["복사_완료!"] after:bg-PRIMARY-SUB after:text-BG-MAIN after:opacity-100 after:scale-100'
                    : 'cursor-pointer bg-BG-MAIN text-TEXT-MAIN hover:shadow-lg after:content-["클릭해서_복사하기"] after:bg-BG-MAIN after:text-TEXT-MAIN after:opacity-0 after:scale-95 hover:after:opacity-100 hover:after:scale-100'
              }
            `}
          >
            {url}
          </button>
        </>
      ) : (
        <div className="size-[180px] max-MBI:size-[140px] bg-BG-ALT animate-pulse" />
      )}
    </Layout>
  );
};
