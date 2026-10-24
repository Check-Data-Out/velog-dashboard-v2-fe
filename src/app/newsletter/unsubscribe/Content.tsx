'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { unsubscribeNewsletter } from '@/lib/apis/user.request';
import { FetchResponseError } from '@/lib/errors/fetch.error';
import { Button } from '@/shared/Button';

const INVALID_MESSAGE = '링크가 올바르지 않아요. 최근 받은 메일의 링크를 사용해 주세요.';
const ERROR_MESSAGE = '수신거부하지 못했어요. 잠시 후 다시 시도해 주세요.';

interface ILinkParams {
  uid: string | null;
  sig: string | null;
}

export const Content = () => {
  const { replace } = useRouter();
  // 메일 링크는 서명이 분석 도구에 남지 않도록 uid·sig 를 fragment 로 넘긴다.
  // fragment 는 서버에 오지 않아 브라우저에서 읽으며, 읽기 전(null)에는 확인 중으로 둔다.
  const [params, setParams] = useState<ILinkParams | null>(null);

  const uid = params?.uid;
  const sig = params?.sig;

  // 화면에 직접 안내하므로 전역 토스트를 띄우지 않는다
  const { mutate, isPending, isSuccess, error, reset } = useMutation({
    mutationFn: async () => unsubscribeNewsletter(uid as string, sig as string),
    throwOnError: false,
  });

  useEffect(() => {
    const readLink = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      setParams({ uid: hash.get('uid'), sig: hash.get('sig') });
      reset();
    };
    readLink();
    // 같은 탭에서 다른 메일의 링크를 열면 문서는 그대로이고 fragment 만 바뀐다
    window.addEventListener('hashchange', readLink);
    return () => window.removeEventListener('hashchange', readLink);
  }, [reset]);

  const isChecking = params === null;
  const isInvalid =
    (!isChecking && (!uid || !sig)) || (error instanceof FetchResponseError && error.code === 400);
  const message = isInvalid ? INVALID_MESSAGE : error ? ERROR_MESSAGE : null;

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-[30px_25px]">
      <section className="w-[480px] max-MBI:w-full flex flex-col gap-6 p-10 max-MBI:p-7 rounded-md bg-BG-SUB">
        <h1 className="text-TEXT-MAIN text-TITLE-3 max-MBI:text-TITLE-4 break-keep">
          Velog Dashboard 주간 뉴스레터를 그만 받을까요?
        </h1>
        {isSuccess ? (
          <p className="text-TEXT-MAIN text-INPUT-4 break-keep">
            수신거부했어요. 다음 주부터 뉴스레터가 발송되지 않아요.
          </p>
        ) : (
          <>
            {message && (
              <p role="alert" className="text-DESTRUCTIVE-SUB text-INPUT-4 break-keep">
                {message}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                size="FULL"
                form="LARGE"
                type="button"
                className="bg-BG-ALT text-TEXT-MAIN hover:bg-BORDER-SUB"
                disabled={isPending}
                onClick={() => replace('/')}
              >
                취소
              </Button>
              <Button
                size="FULL"
                form="LARGE"
                type="button"
                disabled={isChecking || isPending || isInvalid}
                onClick={() => mutate()}
              >
                수신거부
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};
