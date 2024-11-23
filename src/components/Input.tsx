import { HTMLProps } from 'react';
import { sizeStyle } from './size';

interface IProp extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  form?: 'big' | 'small';
  size: 'large' | 'medium' | 'small';
}

const formStyle = {
  big: 'p-4 h-[48px] focus:border-primary-2 rounded-sm',
  small: 'p-2 h-[38px] focus:border-border-3 rounded-[4px]',
};

export const Input = ({ form = 'big', size, ...rest }: IProp) => (
  <input
    className={`bg-bg-2 border-[1px] border-border-2 placeholder:text-text-3 text-text-1 text-[16px] font-light ${formStyle[form]} ${sizeStyle[size]}`}
    {...rest}
  />
);
