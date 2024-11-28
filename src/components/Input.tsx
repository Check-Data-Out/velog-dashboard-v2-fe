import { HTMLProps } from 'react';
import { sizeStyle } from './size';
import { forwardRef, ForwardedRef } from 'react';

interface IProp extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  form?: 'large' | 'small';
  size: 'large' | 'medium' | 'small';
}

const formStyle = {
  large: 'p-4 h-[48px] focus:border-primary-2 rounded-sm',
  small: 'p-2 h-[38px] focus:border-border-3 rounded-[4px]',
};

// eslint-disable-next-line react/display-name
export const Input = forwardRef(
  (
    { form = 'large', size, ...rest }: IProp,
    ref?: ForwardedRef<HTMLInputElement> | undefined,
  ) => (
    <input
      ref={ref}
      className={`bg-bg-2 border-[1px] border-border-2 placeholder:text-text-3 text-text-1 text-[16px] font-light ${formStyle[form]} ${sizeStyle[size]} ${rest.className}`}
      {...rest}
    />
  ),
);
