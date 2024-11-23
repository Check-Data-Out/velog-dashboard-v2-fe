import { HTMLProps } from 'react';
import { sizeStyle } from './size';

interface IProp extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  form?: 'big' | 'small';
  size: 'large' | 'medium' | 'small';
  type?: 'submit' | 'reset' | 'button';
}

const formStyle = {
  big: 'h-[55px] rounded-sm',
  small: 'pl-[20px] pr-[20px] w-fit h-8 rounded-[4px]',
};

export const Button = ({ form = 'small', size, children, ...rest }: IProp) => {
  return (
    <button
      className={`bg-primary-1 hover:bg-primary-2 disabled:bg-border-2 disabled:cursor-not-allowed text-bg-1 font-bold ${sizeStyle[size]} ${formStyle[form]}`}
      {...rest}
    >
      {children}
    </button>
  );
};
