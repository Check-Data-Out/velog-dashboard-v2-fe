'use client';

import { captureException } from '@sentry/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { notiListQuery } from '@/lib/apis/notice.request';
import { convertDateToKST } from '@/lib/utils/datetime.util';
import { shouldCaptureError } from '@/lib/utils/error.util';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const TTL = DAY_IN_MS * 2;
const RECENT_POST_THRESHOLD_DAYS = 4;
const NOTIFICATION_STORAGE_KEY = 'noti_expiry';

export const Notice = () => {
  const { data, error } = useQuery(notiListQuery);
  const [show, setShow] = useState(false);
  const { open } = useModal();

  // 공지 조회 실패는 페이지를 깨뜨리지 않는 대신, 보고 기준에 맞는 오류만 직접 Sentry 에 남긴다
  useEffect(() => {
    if (error && shouldCaptureError(error)) {
      captureException(error, { tags: { feature: 'notice' } });
    }
  }, [error]);

  useEffect(() => {
    try {
      if (!data?.posts?.length) return;

      const short = convertDateToKST(data?.posts[0].created_at)?.short;
      if (!short) return;
      const lastUpdated = new Date(short).getTime();
      if (isNaN(lastUpdated)) return;
      const daysSinceUpdate = Math.ceil((new Date().getTime() - lastUpdated) / DAY_IN_MS);

      if (daysSinceUpdate > RECENT_POST_THRESHOLD_DAYS) return;

      const expiry = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (!expiry || parseInt(expiry, 10) < new Date().getTime()) {
        setShow(true);
      }
    } catch (error) {
      console.error('알림 날짜 처리 중 오류 발생:', error);
    }
  }, [data]);

  return (
    <>
      <div
        className={`transition-all shrink-0 duration-300 flex items-center justify-center gap-2 w-full overflow-hidden  bg-BORDER-SUB ${show ? 'h-[50px]' : 'h-[0px]'}`}
      >
        <h1 className="text-TEXT-MAIN text-SUBTITLE-4 max-MBI:text-SUBTITLE-5">
          📣 새로운 업데이트를 확인해보세요!
        </h1>
        <button
          className="text-PRIMARY-MAIN hover:text-PRIMARY-SUB text-SUBTITLE-4 transition-all duration-300 max-MBI:text-SUBTITLE-5"
          onClick={() => {
            setShow(false);
            window.gtag('event', 'click_event', { target: '공지사항 버튼' });
            localStorage.setItem('noti_expiry', JSON.stringify(new Date().getTime() + TTL));

            open({ type: 'notice' });
          }}
        >
          확인하기
        </button>
      </div>
    </>
  );
};
