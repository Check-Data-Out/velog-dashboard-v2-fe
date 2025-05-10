'use client';

import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';
import { useModal } from '@/hooks';
import { Icon } from './Icon';

interface IProp extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ title, children, ...rest }: IProp) => {
  const { close } = useModal();

  useEffect(() => {
    const handleClose = (e: KeyboardEvent) => e.key === 'Escape' && close();

    window.addEventListener('keydown', handleClose);
    return () => window.removeEventListener('keydown', handleClose);
  }, [close]);

  return (
    <div
      {...rest}
      className={twMerge(
        'overflow-auto flex flex-col gap-5 p-10 max-MBI:p-7 rounded-md bg-BG-SUB',
        rest.className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-TEXT-MAIN items-cenetr gap-3 text-T3 max-MBI:text-T4">{title}</h2>
        <Icon name="Close" onClick={close} className="cursor-pointer" />
      </div>
      {children}
    </div>
  );
};
