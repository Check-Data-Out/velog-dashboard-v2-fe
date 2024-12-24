'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { Input, Button } from '@/components';
import { LoginVo } from '@/types';
import { login } from '@/apis';

export const Content = () => {
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginVo>({ mode: 'onChange' });

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: () => replace('/main'),
  });

  return (
    <main className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit((data: LoginVo) => mutate(data))}
        className="w-fit h-[480px] flex overflow-hidden bg-bg-sub rounded-[4px] shadow-[0_4px_16px_0_rgba(0,0,0,.04)]"
      >
        <div className="w-[220px] h-full bg-bg-alt flex items-center justify-center">
          <Image width={96} height={96} src="/favicon.png" alt="로고 이미지" />
        </div>
        <div className="w-[500px] h-full flex flex-col gap-[30px] items-center justify-center">
          <h1 className="font-medium text-[32px] text-text-main">
            Velog Dashboard
          </h1>
          <Input
            id="access"
            size="LARGE"
            type="password"
            placeholder="Access Token을 입력하세요"
            {...register('accessToken', { required: true })}
          />
          <Input
            id="refresh"
            size="LARGE"
            type="password"
            placeholder="Refresh Token을 입력하세요"
            {...register('refreshToken', { required: true })}
          />
          <Button
            size="LARGE"
            form="LARGE"
            type="submit"
            disabled={!isValid}
            id="login"
          >
            로그인
          </Button>
        </div>
      </form>
    </main>
  );
};
