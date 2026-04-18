'use client';

import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useModal } from '@/hooks/useModal';
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
          <h2 className="text-TEXT-MAIN items-cenetr gap-3 text-TITLE-3 max-MBI:text-TITLE-4">
            {title}
          </h2>
          <button type="button" onClick={close} aria-label="닫기" className="cursor-pointer">
            <Icon name="Close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
