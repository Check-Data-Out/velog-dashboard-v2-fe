'use client';

import { useModal } from '@/hooks/useModal';

export const ModalProvider = (): React.ReactNode => {
  const { Modal } = useModal();

  if (typeof window !== 'undefined') return Modal ? Modal : <></>;
};
