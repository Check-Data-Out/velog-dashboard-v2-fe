'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notiList } from '@/apis';
import { PATHS } from '@/constants';
import { useModal } from '@/hooks/useModal';
import { Modal } from './Modal';

const DAY = 1000 * 60 * 60 * 24;
const TTL = DAY * 2;

export const Notice = () => {
  const { data } = useQuery({ queryKey: [PATHS.NOTIS], queryFn: notiList });
  const [show, setShow] = useState(false);
  const { open } = useModal();

  useEffect(() => {
    if (!data?.posts || data.posts.length === 0) return;
    const lastUpdated = new Date(
      data?.posts[0].created_at?.split('T')[0] as string,
    ).getTime();
    const lastDate = Math.ceil((new Date().getTime() - lastUpdated) / DAY);
    if (lastDate <= 4) {
      const expiry = localStorage.getItem('noti_expiry');
      if (!expiry || JSON.parse(expiry) < new Date().getTime()) setShow(true);
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
