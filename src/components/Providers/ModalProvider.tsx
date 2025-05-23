'use client';

import { useRef } from 'react';
import { useModal } from '@/hooks/useModal';

export const ModalProvider = () => {
  const { Modal } = useModal();

  if (typeof window !== 'undefined') return Modal ? Modal : <></>;
};
