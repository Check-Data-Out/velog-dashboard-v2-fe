'use client';

import { useModal } from '@/hooks/useModal';
import { BadgeGenerator } from '../BadgeGenerator';
import { Modal as NoticeModal } from '../Notice/Modal';
import { QRCode } from '../QRCode';
import { Modal as StatsModal } from '../Summary/Modal';

export const ModalContainer = (): React.ReactNode => {
  const { modal } = useModal();
  if (!modal) return null;

  switch (modal.type) {
    case 'notice':
      return <NoticeModal />;
    case 'qrcode':
      return <QRCode />;
    case 'badge':
      return <BadgeGenerator />;
    case 'stats':
      return <StatsModal name={modal.name} />;
  }
};
