import { ForwardedRef, forwardRef } from 'react';
import { SIZES, SizeType } from '@/constants';

interface IProp
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  form?: keyof typeof FORMS;
  size: SizeType;
}

const FORMS = {
  LARGE: 'p-4 h-fit rounded-sm focus:border-PRIMARY-SUB max-TBL:p-[14px]',
  SMALL: 'p-2 h-[36px] rounded-[4px] focus:border-BORDER-ALT',
};

export const Input = forwardRef<HTMLInputElement, IProp>(
  (
    { form = 'LARGE', size, ...rest }: IProp,
    ref?: ForwardedRef<HTMLInputElement>,
  ) => (
    <input
      {...rest}
      ref={ref}
      data-placeholder={rest?.placeholder}
      className={`bg-BG-SUB border-BORDER-SUB text-I2 shrink-0 text-TEXT-MAIN border-[1px] ${FORMS[form]} ${SIZES[size]} ${rest.className} disabled:cursor-pointer placeholder:text-TEXT-ALT max-TBL:text-I4`}
    />
  ),
);

Input.displayName = 'Input';
