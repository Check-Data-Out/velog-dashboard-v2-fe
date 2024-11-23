'use client';

import { Button, Input } from '@/components';

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <form className="w-fit h-fit flex flex-col gap-[30px] items-center p-[30px] bg-bg-2 rounded-[4px] shadow-[0_4px_16px_0_rgba(0,0,0,.04)]">
        <h1 className="font-medium text-[32px] text-text-1">Velog Dashboard</h1>
        <Input size="large" placeholder="Access Token을 입력하세요" />
        <Input size="large" placeholder="Refresh Token을 입력하세요" />
        <Button size="large" form="big">
          로그인
        </Button>
      </form>
    </div>
  );
}
