import { ForwardedRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { SIZES } from '@/constants';

interface IProp extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  form?: keyof typeof FORMS;
  size: keyof typeof SIZES;
}

const FORMS = {
  LARGE: 'p-4 h-fit rounded-sm focus:border-PRIMARY-SUB max-TBL:p-[14px]',
  SMALL: 'p-2 h-[36px] rounded-[4px] focus:border-BORDER-ALT',
};

export const Input = forwardRef<HTMLInputElement, IProp>(
  ({ form = 'LARGE', size, ...rest }: IProp, ref?: ForwardedRef<HTMLInputElement>) => (
    <input
      {...rest}
      ref={ref}
      data-placeholder={rest?.placeholder}
      className={twMerge(
        'bg-BG-SUB border-BORDER-SUB text-INPUT-2 shrink-0 text-TEXT-MAIN border-[1px] disabled:cursor-pointer placeholder:text-TEXT-ALT max-TBL:text-INPUT-4',
        FORMS[form],
        SIZES[size],
        rest.className,
      )}
    />
  ),
);

Input.displayName = 'Input';
