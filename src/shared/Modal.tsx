'use client';

import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
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

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="w-full h-screen bg-[#000000AA] absolute z-[100] flex items-center justify-center"
      onMouseDown={({ target }) => ref.current && !ref.current.contains(target as Node) && close()}
    >
      <div
        {...rest}
        ref={ref}
        className={twMerge(
          'overflow-hidden flex flex-col gap-5 p-10 max-MBI:p-7 rounded-md size-fit bg-BG-SUB max-MBI:size-full',
          rest.className,
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-TEXT-MAIN items-cenetr gap-3 text-T3 max-MBI:text-T4">{title}</h2>
          <Icon name="Close" onClick={close} className="cursor-pointer" />
        </div>
        {children}
      </div>
    </div>
  );
};
