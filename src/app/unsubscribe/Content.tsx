'use client';

import { startHolyLoader, stopHolyLoader } from 'holy-loader';
import { useTransition, useState } from 'react';
import { toast } from 'react-toastify';
import { unsubscribeAction } from '@/lib/utils/newsletter.util';
import { Button } from '@/shared/Button';

interface IProp {
  username: string;
  token: string;
}

export const Content = ({ username, token }: IProp) => {
  const [isDone, setIsDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUnsubscribe = () => {
    startTransition(async () => {
      startHolyLoader();
      try {
        await unsubscribeAction(token);
        setIsDone(true);
      } catch {
        toast.error('구독 취소 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        stopHolyLoader();
      }
    });
  };

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col items-center gap-8 bg-BG-SUB rounded-sm p-12 w-fit max-MBI:w-full max-MBI:rounded-none max-MBI:p-[40px_25px]">
        {isDone ? (
          <>
            <h1 className="text-TEXT-MAIN text-TITLE-3 max-TBL:text-TITLE-4 text-center">
              구독 취소 완료
            </h1>
            <p className="text-TEXT-ALT text-INPUT-2 text-center">
              뉴스레터 구독 취소가 완료되었습니다
            </p>
          </>
        ) : (
          <>
            <h1 className="text-TEXT-MAIN text-TITLE-3 max-TBL:text-TITLE-4 text-center">
              뉴스레터 구독을 취소하시겠습니까?
            </h1>
            <p className="text-TEXT-ALT text-INPUT-2 text-center">
              더 이상{username ? ` ${username}님의` : ''} Velog 통계를 뉴스레터로 받아볼 수 없습니다
            </p>
            <Button
              size="LARGE"
              form="LARGE"
              disabled={isPending || !token}
              onClick={handleUnsubscribe}
              className="bg-DESTRUCTIVE-MAIN hover:bg-DESTRUCTIVE-SUB"
            >
              뉴스레터 구독 취소
            </Button>
          </>
        )}
      </div>
    </main>
  );
};
