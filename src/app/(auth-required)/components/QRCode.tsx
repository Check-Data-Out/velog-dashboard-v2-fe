'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Icon } from '@/components';
import { useModal } from '@/hooks/useModal';
import { COLORS, env, PATHS, SCREENS } from '@/constants';
import { useResponsive } from '@/hooks';
import { createQRToken } from '@/apis';

export const QRCode = () => {
  const { close } = useModal();
  const width = useResponsive();

  const { data, isSuccess } = useQuery({ queryKey: [PATHS.QRLOGIN], queryFn: createQRToken });

  return (
    <div className="w-fit h-fit overflow-auto flex flex-col items-end gap-5 p-10 max-MBI:p-7 rounded-md bg-BG-SUB">
      <Icon name="Close" onClick={close} color="#FFFFFF" className="cursor-pointer" />

      {isSuccess ? (
        <QRCodeSVG
          value={`${env.BASE_URL}/api/qr-login?token=${data.token}`}
          width={width < SCREENS.MBI ? 140 : 181}
          height={width < SCREENS.MBI ? 140 : 181}
          enableBackground={0}
          bgColor={COLORS.BG.SUB}
          fgColor={COLORS.TEXT.MAIN}
          className="transition-all"
        />
      ) : (
        <div className="size-[180px] max-MBI:size-[140px] bg-BG-ALT" />
      )}

      <span className="text-TEXT-MAIN text-ST4 transition-all max-MBI:text-ST5 w-full text-center">
        해당 QR을 찍어 로그인
      </span>
    </div>
  );
};
