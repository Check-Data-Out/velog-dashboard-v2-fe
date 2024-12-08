'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components';
import { NotFoundError } from '@/errors';
import { instance } from '@/api';

interface FormVo {
  access_token: string;
  refresh_token: string;
}

export const Content = () => {
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormVo>({ mode: 'onChange' });

  const { mutate } = useMutation({
    mutationFn: async (body: FormVo) =>
      await instance(
        '/login',
        { method: 'POST', body },
        {
          '404': new NotFoundError(
            '일치하는 계정을 찾을 수 없습니다',
            'CannotFindAccount',
          ),
        },
      ),
    onSuccess: () => replace('/main'),
  });

  const onSubmit = (data: FormVo) => {
    mutate(data);
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-fit h-fit flex flex-col gap-[30px] items-center p-[30px] bg-bg-sub rounded-[4px] shadow-[0_4px_16px_0_rgba(0,0,0,.04)]"
      >
        <h1 className="font-medium text-[32px] text-text-main">
          Velog Dashboard
        </h1>
        <Input
          id="access"
          size="large"
          type="password"
          placeholder="Access Token을 입력하세요"
          {...register('access_token', { required: true })}
        />
        <Input
          id="refresh"
          size="large"
          type="password"
          placeholder="Refresh Token을 입력하세요"
          {...register('refresh_token', { required: true })}
        />
        <Button
          size="large"
          form="large"
          type="submit"
          disabled={!isValid}
          id="login"
        >
          로그인
        </Button>
      </form>
    </main>
  );
};
