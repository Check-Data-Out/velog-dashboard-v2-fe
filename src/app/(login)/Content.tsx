'use client';

import { useMutation } from '@tanstack/react-query';
import { startHolyLoader, stopHolyLoader } from 'holy-loader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { login, sampleLogin } from '@/apis';
import { COLORS, URLS } from '@/constants';
import { Input, Button, Icon } from '@/shared';
import { LoginVo } from '@/types';

const responsiveStyle =
  "flex items-center gap-5 max-MBI:before:inline-block max-MBI:before:bg-[url('/favicon.png')] max-MBI:before:[background-size:_100%_100%] max-MBI:before:w-16 max-MBI:before:h-16";

export const Content = () => {
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginVo>({ mode: 'all' });

  const mutationOptions = {
    onMutate: startHolyLoader,
    onError: stopHolyLoader,
    onSuccess: () => replace('/main?asc=false&sort='),
  };

  const { mutate } = useMutation({ mutationFn: login, ...mutationOptions });

  const { mutate: sampleMutate } = useMutation({ mutationFn: sampleLogin, ...mutationOptions });

  return (
    <main className="w-full h-full flex justify-center MBI:items-center max-MBI:p-[30px_25px]">
      <form
        onSubmit={handleSubmit((data: LoginVo) => mutate(data))}
        className="h-[480px] flex bg-BG-SUB rounded-[4px] max-MBI:bg-BG-MAIN max-MBI:h-fit max-MBI:w-full"
      >
        <div className="w-[220px] h-full bg-BG-ALT flex items-center justify-center max-MBI:hidden ">
          <Image width={96} height={96} src="/favicon.png" alt="로고 이미지" />
        </div>
        <div className="w-[500px] h-full flex flex-col gap-[30px] items-center justify-center max-MBI:w-full">
          <h1
            className={`text-TEXT-MAIN text-TITLE-1 max-TBL:text-TITLE-2 max-MBI:text-SUBTITLE-3 ${responsiveStyle}`}
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
          <div className="w-[400px] justify-center flex items-center gap-10">
            <button
              className="flex gap-2 items-center hover:border-b hover:-mb-[1px] border-b-PRIMARY-MAIN cursor-pointer"
              onClick={() => sampleMutate()}
            >
              <Icon name="Door" color={COLORS.PRIMARY.MAIN} size={18} />
              <span className="text-INPUT-2 max-MBI:text-SUBTITLE-5 text-PRIMARY-MAIN">
                체험 계정 로그인 →
              </span>
            </button>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={URLS.ARCADE}
              className="flex gap-2 items-center text-INPUT-2 max-MBI:text-SUBTITLE-5 text-PRIMARY-MAIN hover:border-b hover:-mb-[1px] border-b-PRIMARY-MAIN cursor-pointer"
            >
              <Icon name="Video" color={COLORS.PRIMARY.MAIN} size={18} />
              <span className="text-INPUT-2 max-MBI:text-SUBTITLE-5 text-PRIMARY-MAIN">
                서비스 사용법 →
              </span>
            </a>
          </div>
        </div>
      </form>
    </main>
  );
};
