import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { sizes, sizeType } from '@/constants/sizes';

interface IProp
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  form?: keyof typeof forms;
  size: sizeType;
}

const forms = {
  LARGE: 'h-[55px] rounded-sm',
  SMALL: 'pl-[20px] pr-[20px] w-fit h-8 rounded-[4px]',
};

export const Button = ({ form = 'SMALL', size, children, ...rest }: IProp) => (
  <button
    className={`bg-primary-main hover:bg-primary-sub disabled:bg-border-sub disabled:cursor-not-allowed text-bg-main font-bold ${forms[form]} ${sizes[size]}`}
    {...rest}
  >
    {children}
  </button>
);
