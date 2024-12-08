import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react';
import { sizeStyle, sizeStyleType } from './size';

interface IProp
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size'
  > {
  form?: keyof typeof formStyle;
  size: sizeStyleType;
}

const formStyle = {
  LARGE: 'p-4 h-[48px] focus:border-primary-sub rounded-sm',
  SMALL: 'p-2 h-[38px] focus:border-border-alt rounded-[4px]',
};

export const Input = forwardRef<HTMLInputElement, IProp>(
  (
    { form = 'LARGE', size, ...rest }: IProp,
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
