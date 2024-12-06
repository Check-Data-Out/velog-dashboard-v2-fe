import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { sizeStyle } from './size';
import { forwardRef, ForwardedRef } from 'react';

interface IProp
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size'
  > {
  form?: 'large' | 'small';
  size: 'large' | 'medium' | 'small';
}

const formStyle = {
  large: 'p-4 h-[48px] focus:border-primary-sub rounded-sm',
  small: 'p-2 h-[38px] focus:border-border-alt rounded-[4px]',
};

export const Input = forwardRef<HTMLInputElement, IProp>(
  (
    { form = 'large', size, ...rest }: IProp,
    ref?: ForwardedRef<HTMLInputElement> | undefined,
  ) => (
    <input
      ref={ref}
      className={`bg-bg-sub border-[1px] border-border-sub placeholder:text-text-alt text-text-main text-[16px] font-light ${formStyle[form]} ${sizeStyle[size]} ${rest.className}`}
      {...rest}
    />
  ),
);

Input.displayName = 'Input';
