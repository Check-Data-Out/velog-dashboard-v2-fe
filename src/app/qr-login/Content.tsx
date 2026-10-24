'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { confirmQRLogin } from '@/lib/apis/user.request';
import { FetchResponseError } from '@/lib/errors/fetch.error';
import { Button } from '@/shared/Button';

const EXPIRED_MESSAGE =
  'QR 코드가 만료됐거나 이미 사용됐어요. PC에서 QR을 새로고침한 뒤 다시 스캔해 주세요.';
const ERROR_MESSAGE = '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.';

interface IProp {
  token?: string;
}

export const Content = ({ token }: IProp) => {
  const { replace } = useRouter();

  // 화면에 직접 안내하므로 전역 토스트를 띄우지 않는다
  const { mutate, isPending, error } = useMutation({
    mutationFn: confirmQRLogin,
    throwOnError: false,
    onSuccess: () => replace('/main'),
  });

  const isExpired = !token || (error instanceof FetchResponseError && error.code === 400);
  const message = isExpired ? EXPIRED_MESSAGE : error ? ERROR_MESSAGE : null;

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-[30px_25px]">
      <section className="w-[480px] max-MBI:w-full flex flex-col gap-6 p-10 max-MBI:p-7 rounded-md bg-BG-SUB">
        <h1 className="text-TEXT-MAIN text-TITLE-3 max-MBI:text-TITLE-4 break-keep">
          이 기기에서 Velog Dashboard에 로그인할까요?
        </h1>
        <p className="text-TEXT-SUB text-INPUT-4 break-keep">
          PC 화면에 띄운 QR을 본인이 직접 스캔한 경우에만 로그인하세요. 다른 사람이 보낸 링크라면
          취소하세요.
        </p>
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
            disabled={isPending || isExpired}
            onClick={() => token && mutate(token)}
          >
            로그인
          </Button>
        </div>
      </section>
    </main>
  );
};
