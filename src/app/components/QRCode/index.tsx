'use client';

import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef, useEffect } from 'react';
import { createQRToken } from '@/apis';
import { COLORS, ENVS, PATHS, SCREENS } from '@/constants';
import { useResponsive } from '@/hooks';
import { Modal as Layout } from '@/shared';
import { formatTimeToMMSS } from '@/utils';
import { CopyButton } from './CopyButton';

const TIMER_DURATION = 5 * 60; // 5분 = 300초

export const QRCode = () => {
  const width = useResponsive();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isExpired = timeLeft === 0;

  const { data, isLoading, refetch } = useQuery({
    queryKey: [PATHS.QRLOGIN],
    queryFn: createQRToken,
    refetchOnMount: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const url = `${ENVS.BASE_URL}/api/qr-login?token=${data?.token}`;

  // 타이머 시작
  useEffect(() => {
    if (!isLoading) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  return (
    <Layout title="QR 로그인">
      <div className="flex items-center justify-center gap-10">
        <div
          className={
            isExpired || isLoading
              ? `relative after:inset-0 after:absolute after:m-auto after:bg-BG-MAIN after:size-fit after:text-TEXT-MAIN after:px-3 after:py-1 after:rounded-lg after:font-medium ${isLoading ? 'after:content-["로딩중"]' : 'after:content-["만료됨"]'}`
              : ''
          }
        >
          <QRCodeSVG
            value={url}
            width={width < SCREENS.MBI ? 130 : 171}
            height={width < SCREENS.MBI ? 130 : 171}
            enableBackground={0}
            bgColor={COLORS.BG.SUB}
            fgColor={COLORS.TEXT.MAIN}
            className={`transition-all ${isExpired || isLoading ? 'blur-sm' : ''}`}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-T4 text-TEXT-ALT leading-none">만료까지</h3>
          <h2
            className={`text-T2 leading-none min-w-[130px] text-center ${timeLeft <= 60 ? 'text-DESTRUCTIVE-SUB' : 'text-TEXT-MAIN'}`}
          >
            {formatTimeToMMSS(timeLeft)}
          </h2>
          {isExpired && !isLoading && (
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

      <CopyButton url={url} disabled={isExpired || isLoading} />
    </Layout>
  );
};
