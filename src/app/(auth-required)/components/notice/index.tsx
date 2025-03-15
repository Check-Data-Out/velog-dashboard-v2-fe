'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notiList } from '@/apis';
import { PATHS } from '@/constants';
import { useModal } from '@/hooks/useModal';
import { Modal } from './Modal';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const TTL = DAY_IN_MS * 2;
const RECENT_POST_THRESHOLD_DAYS = 4;
const NOTIFICATION_STORAGE_KEY = 'noti_expiry';

export const Notice = () => {
  const { data } = useQuery({ queryKey: [PATHS.NOTIS], queryFn: notiList });
  const [show, setShow] = useState(false);
  const { open } = useModal();

  useEffect(() => {
    try {
      const lastUpdated = new Date(
        data?.posts[0].created_at?.split('T')[0] as string,
      ).getTime();

      const daysSinceUpdate = Math.ceil(
        (new Date().getTime() - lastUpdated) / DAY_IN_MS,
      );

      if (daysSinceUpdate <= RECENT_POST_THRESHOLD_DAYS) {
        const expiry = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
        if (!expiry || parseInt(expiry, 10) < new Date().getTime()) {
          setShow(true);
        }
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
        <h1 className="text-TEXT-MAIN text-ST4 max-MBI:text-ST5">
          📣 새로운 업데이트를 확인해보세요!
        </h1>
        <button
          className="text-PRIMARY-MAIN hover:text-PRIMARY-SUB text-ST4 transition-all duration-300 max-MBI:text-ST5"
          onClick={() => {
            setShow(false);
            localStorage.setItem(
              'noti_expiry',
              JSON.stringify(new Date().getTime() + TTL),
            );

            open(<Modal />);
          }}
        >
          확인하기
        </button>
      </div>
    </>
  );
};
