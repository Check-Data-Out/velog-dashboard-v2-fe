'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from '@tanstack/react-query';
import { COLORS, env, PATHS, SCREENS } from '@/constants';
import { useResponsive } from '@/hooks';
import { createQRToken } from '@/apis';
import { Modal as Layout } from '@/components';

export const QRCode = () => {
  const width = useResponsive();

  const { data, isSuccess } = useQuery({ queryKey: [PATHS.QRLOGIN], queryFn: createQRToken });

  return (
    <Layout title="QR 로그인">
      <div className="size-full flex items-center justify-center">
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
      </div>
    </Layout>
  );
};
