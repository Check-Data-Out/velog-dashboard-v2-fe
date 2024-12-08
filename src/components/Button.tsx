import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { sizeStyle, sizeStyleType } from './size';

interface IProp
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  form?: keyof typeof formStyle;
  size: sizeStyleType;
}

const formStyle = {
  LARGE: 'h-[55px] rounded-sm',
  SMALL: 'pl-[20px] pr-[20px] w-fit h-8 rounded-[4px]',
};

export const Button = ({ form = 'SMALL', size, children, ...rest }: IProp) => (
  <button
    className={`bg-primary-main hover:bg-primary-sub disabled:bg-border-sub disabled:cursor-not-allowed text-bg-main font-bold ${sizeStyle[size]} ${formStyle[form]}`}
    {...rest}
  >
    {children}
  </button>
);
