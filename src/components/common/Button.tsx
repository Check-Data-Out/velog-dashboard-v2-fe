import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { SIZES, SizeType } from '@/constants';

interface IProp
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  form?: keyof typeof FORMS;
  size: SizeType;
}

const FORMS = {
  LARGE: 'h-[55px] rounded-sm',
  SMALL: 'pl-[20px] pr-[20px] w-[fit-content_!important] h-8 rounded-[4px]',
};

export const Button = ({ form = 'SMALL', size, children, ...rest }: IProp) => (
  <button
    {...rest}
    className={`bg-primary-main hover:bg-primary-sub disabled:bg-border-sub disabled:cursor-not-allowed text-bg-main shrink-0 text-[16px] max-TBL:text-[14px] font-bold ${FORMS[form]} ${SIZES[size]} ${rest.className}`}
  >
    {children}
  </button>
);
