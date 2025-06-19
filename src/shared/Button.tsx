import { twMerge } from 'tailwind-merge';
import { SIZES } from '@/constants';

interface IProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  form?: keyof typeof FORMS;
  size: keyof typeof SIZES;
}

const FORMS = {
  LARGE: 'h-fit rounded-sm py-4 rounded-sm max-TBL:py-[14px]',
  SMALL: 'px-5 w-fit h-8 rounded-[4px]',
};

export const Button = ({ form = 'SMALL', size, children, ...rest }: IProp) => (
  <button
    {...rest}
    className={twMerge(
      'bg-PRIMARY-MAIN text-BG-MAIN shrink-0 text-INPUT-1 disabled:bg-BORDER-SUB disabled:cursor-not-allowed hover:bg-PRIMARY-SUB max-TBL:text-INPUT-3',
      FORMS[form],
      SIZES[size],
      rest.className,
    )}
  >
    {children}
  </button>
);
