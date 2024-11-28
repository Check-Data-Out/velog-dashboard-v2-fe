'use client';

import { Button, Input } from '@/components';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { instance } from '../../api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface formVo {
  access_token: string;
  refresh_token: string;
}

export const Content = () => {
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<formVo>({ mode: 'onChange' });

  const { mutate } = useMutation({
    mutationFn: async (data: formVo) =>
      await instance('/login', {
        method: 'POST',
        headers: {
          cookie: `access_token=${data.access_token};refresh_token=${data.refresh_token}`,
        },
      }),
    onSuccess: () => replace('/main'),
    onError: (res: Response) => {
      toast.error(`${res.statusText} (${res.status})`);
    },
  });

  const onSubmit = (data: formVo) => {
    mutate(data);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-fit h-fit flex flex-col gap-[30px] items-center p-[30px] bg-bg-2 rounded-[4px] shadow-[0_4px_16px_0_rgba(0,0,0,.04)]"
      >
        <h1 className="font-medium text-[32px] text-text-1">Velog Dashboard</h1>
        <Input
          size="large"
          type="password"
          placeholder="Access Token을 입력하세요"
          {...register('access_token', { required: true })}
        />
        <Input
          size="large"
          type="password"
          placeholder="Refresh Token을 입력하세요"
          {...register('refresh_token', { required: true })}
        />
        <Button size="large" form="big" type="submit" disabled={!isValid}>
          로그인
        </Button>
      </form>
    </div>
  );
};
