'use client';

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Input, Button } from '@/components';
import { login, sampleLogin } from '@/apis';
import { LoginVo } from '@/types';
import { useaCustomNavigation } from '@/hooks';

const responsiveStyle =
  "flex items-center gap-5 max-MBI:before:inline-block max-MBI:before:bg-[url('/favicon.png')] max-MBI:before:[background-size:_100%_100%] max-MBI:before:w-16 max-MBI:before:h-16";

export const Content = () => {
  const { replace, start, complete } = useaCustomNavigation();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginVo>({ mode: 'all' });

  const onSuccess = () => {
    replace('/main?asc=false&sort=');
  };

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess,
    onError: complete,
  });

  const { mutate: sampleMutate } = useMutation({
    mutationFn: sampleLogin,
    onSuccess,
    onError: complete,
  });

  return (
    <main className="w-full h-full flex justify-center MBI:items-center max-MBI:p-[30px_25px]">
      <form
        onSubmit={handleSubmit((data: LoginVo) => {
          start();
          mutate(data);
        })}
        className="h-[480px] flex bg-BG-SUB rounded-[4px] max-MBI:bg-BG-MAIN max-MBI:h-fit max-MBI:w-full"
      >
        <div className="w-[220px] h-full bg-BG-ALT flex items-center justify-center max-MBI:hidden ">
          <Image width={96} height={96} src="/favicon.png" alt="로고 이미지" />
        </div>
        <div className="w-[500px] h-full flex flex-col gap-[30px] items-center justify-center max-MBI:w-full">
          <h1
            className={`text-TEXT-MAIN text-T1 max-TBL:text-T2 max-MBI:text-ST3 ${responsiveStyle}`}
          >
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
          <span
            className="text-TEXT-ALT text-I2 max-MBI:text-ST5 after:cursor-pointer after:hover:underline after:ml-2 after:content-['체험_계정으로_로그인'] after:text-PRIMARY-MAIN after:inline-block"
            onClick={() => {
              start();
              sampleMutate();
            }}
          >
            서비스를 체험해보고 싶다면?
          </span>
        </div>
      </form>
    </main>
  );
};
