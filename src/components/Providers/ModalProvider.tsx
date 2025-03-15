'use client';

import { useRef } from 'react';
import { useModal } from '@/hooks/useModal';

export const ModalProvider = () => {
  const { Modal, close } = useModal();
  const ref = useRef<HTMLDivElement | null>(null);

  if (typeof window !== 'undefined' && Modal) {
    return (
      <div
        className="w-full h-screen bg-[#000000AA] absolute z-[100] flex items-center justify-center"
        onMouseDown={({ target }) => {
          if (ref.current && !ref.current.contains(target as Node)) close();
        }}
      >
        <div className="w-fit h-fit" ref={ref}>
          {Modal}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
