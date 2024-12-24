import {
  DetailedHTMLProps,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
} from 'react';
import { SIZES, SizeType } from '@/constants';

interface IProp
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size'
  > {
  form?: keyof typeof FORMS;
  size: SizeType;
}

const FORMS = {
  LARGE: 'p-4 h-[48px] focus:border-PRIMARY-SUB rounded-sm',
  SMALL: 'p-2 h-[36px] focus:border-BORDER-ALT rounded-[4px]',
};

export const Input = forwardRef<HTMLInputElement, IProp>(
  (
    { form = 'LARGE', size, ...rest }: IProp,
    ref?: ForwardedRef<HTMLInputElement> | undefined,
  ) => (
    <input
      {...rest}
      ref={ref}
      className={`bg-BG-SUB border-[1px] border-BORDER-SUB placeholder:text-TEXT-ALT text-TEXT-MAIN text-[16px] max-TBL:text-[14px] shrink-0 font-light ${FORMS[form]} ${SIZES[size]} ${rest.className}`}
    />
  ),
);

Input.displayName = 'Input';
