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
    <main className="w-full h-full flex justify-center MBI:items-center max-MBI:p-[40px_30px]">
      <form
        onSubmit={handleSubmit((data: LoginVo) => mutate(data))}
        className="w-fit h-[480px] flex overflow-hidden bg-bg-sub rounded-[4px] shadow-[0_4px_16px_0_rgba(0,0,0,.04)] max-MBI:bg-bg-main max-MBI:h-fit max-MBI:w-full"
      >
        <div className="w-[220px] h-full bg-bg-alt flex items-center justify-center max-MBI:hidden ">
          <Image width={96} height={96} src="/favicon.png" alt="로고 이미지" />
        </div>
        <div className="w-[500px] h-full flex flex-col gap-[30px] items-center justify-center max-MBI:w-full">
          <h1 className="font-medium text-[32px] text-text-main max-MBI:text-[22px] max-MBI:font-normal flex items-center gap-5 before:inline-block before:bg-[url('/favicon.png')] before:[background-size:_100%_100%] before:w-[64px] before:h-[64px]">
            Velog Dashboard
          </h1>
          <Input
            id="access"
            size="LARGE"
            type="password"
            placeholder="Access Token을 입력하세요"
            className="max-MBI:w-[100%_!important]"
            {...register('accessToken', { required: true })}
          />
          <Input
            id="refresh"
            size="LARGE"
            type="password"
            placeholder="Refresh Token을 입력하세요"
            className="max-MBI:w-[100%_!important]"
            {...register('refreshToken', { required: true })}
          />
          <Button
            size="LARGE"
            form="LARGE"
            type="submit"
            className="max-MBI:w-[100%_!important]"
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
