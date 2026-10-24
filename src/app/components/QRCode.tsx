'use client';

import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef, useEffect } from 'react';
import { twJoin } from 'tailwind-merge';
import { useModal } from '@/hooks/useModal';
import { useResponsive } from '@/hooks/useResponsive';
import { createQRToken, getQRLoginStatus } from '@/lib/apis/user.request';
import { ENVS } from '@/lib/constants/env.constant';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { COLORS, SCREENS } from '@/lib/constants/styles.constant';
import { FetchResponseError } from '@/lib/errors/fetch.error';
import { QRLoginStatusDto } from '@/lib/types/user.type';
import { formatTimeToMMSS } from '@/lib/utils/datetime.util';
import { summarizeUserAgent } from '@/lib/utils/userAgent.util';
import { CopyButton } from '@/shared/CopyButton';
import { Icon } from '@/shared/Icon';
import { Inform } from '@/shared/Inform';
import { Modal as Layout } from '@/shared/Modal';

const TIMER_DURATION = 5 * 60; // 5분 = 300초
const STATUS_POLLING_MS = 3000;
const QR_LOGIN_SUCCESS_CLOSE_MS = 5000;
const JUST_NOW_MS = 60 * 1000;

const formatUsedAt = (usedAt?: string) => {
  if (!usedAt) return undefined;
  const date = new Date(usedAt);
  if (Date.now() - date.getTime() < JUST_NOW_MS) return '방금 전';
  return `${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 로그인`;
};

const LoginCompleted = ({ userAgent, ip, usedAt }: QRLoginStatusDto) => {
  const device = [summarizeUserAgent(userAgent), ip && `참고용 IP ${ip}`, formatUsedAt(usedAt)]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="fadeIn [animation-duration:300ms] flex flex-col items-center gap-3 text-center">
      <Icon name="Check" size={64} color={COLORS.PRIMARY.MAIN} />
      <p className="text-TEXT-MAIN text-TITLE-4">로그인 완료</p>
      <p className="text-TEXT-SUB text-INPUT-4">{device}</p>
      <p className="text-TEXT-ALT text-INPUT-4 break-keep">
        본인이 아니라면 프로필 메뉴의 로그아웃으로 모든 기기에서 로그아웃하세요.
      </p>
    </div>
  );
};

export const QRCode = () => {
  const width = useResponsive();
  const { close } = useModal();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.qrLogin(),
    queryFn: createQRToken,
    refetchOnMount: true,
    staleTime: 0,
    // 다시 열 때 이전 토큰(과 그 사용 상태)을 잠깐이라도 보여 주지 않도록 캐시에 남기지 않는다
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const token = data?.token ?? '';

  // 실패해도 전역 토스트 없이 QR 화면을 유지하고 다음 주기에 다시 묻는다.
  // 상태 API 가 아직 없을 때(API 배포 전 404)만 묻지 않는다
  const { data: status } = useQuery({
    queryKey: queryKeys.qrLoginStatus(token),
    queryFn: async () => await getQRLoginStatus(token),
    enabled: !!token && timeLeft > 0,
    staleTime: 0,
    refetchInterval: ({ state: { data, error } }) => {
      if (error instanceof FetchResponseError && error.code === 404) return false;
      return data && data.status !== 'pending' ? false : STATUS_POLLING_MS;
    },
    throwOnError: false,
    retry: false,
  });

  const isUsed = status?.status === 'used';
  const url = `${ENVS.BASE_URL}/api/qr-login?token=${token}`;
  const isUnusable = timeLeft === 0 || isLoading || status?.status === 'expired';

  useEffect(() => {
    if (!isUsed) return;
    const closeTimer = setTimeout(close, QR_LOGIN_SUCCESS_CLOSE_MS);
    return () => clearTimeout(closeTimer);
  }, [isUsed, close]);

  useEffect(() => {
    if (isLoading) return;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  if (isUsed) {
    return (
      <Layout title="QR 로그인">
        <LoginCompleted {...status} />
      </Layout>
    );
  }

  return (
    <Layout title="QR 로그인">
      <div className="flex items-center justify-center gap-10">
        <div
          className={twJoin(
            isUnusable &&
              `relative after:inset-0 after:absolute after:m-auto after:bg-BG-MAIN after:size-fit after:text-TEXT-MAIN after:px-3 after:py-1 after:rounded-lg after:font-medium ${isLoading ? 'after:content-["로딩중"]' : 'after:content-["만료됨"]'}`,
          )}
        >
          <QRCodeSVG
            value={url}
            width={width < SCREENS.MBI ? 130 : 171}
            height={width < SCREENS.MBI ? 130 : 171}
            enableBackground={0}
            bgColor={COLORS.BG.SUB}
            fgColor={COLORS.TEXT.MAIN}
            className={twJoin('transition-all', isUnusable && 'blur-sm')}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Inform>
            <Inform.Title>만료까지</Inform.Title>
            <Inform.Content>{formatTimeToMMSS(timeLeft)}</Inform.Content>
          </Inform>
          {isUnusable && (
            <button
              className="text-INPUT-1 text-BG-MAIN bg-PRIMARY-MAIN px-5 py-1 rounded-sm"
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

      <CopyButton url={url} disabled={isUnusable} />
    </Layout>
  );
};
