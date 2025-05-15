import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IProp extends HTMLAttributes<HTMLDivElement> {
  name: string;
  rank?: number;
  count?: string | number;
  suffix?: string;
}

export const Ranker = ({ name, rank, count, suffix = '회', ...rest }: IProp) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `${rank === 1 ? 'w-full border-BORDER-SUB' : 'w-[70%] border-BORDER-MAIN'} max-MBI:border-[3px] flex justify-center items-center gap-[10px]  h-[250px] p-[25px] bg-BG-SUB rounded-[4px] max-MBI:w-full max-MBI:h-fit max-MBI:flex-row max-MBI:justify-between`,
        rest.className,
      )}
    >
      <div className="flex gap-3 items-center MBI:flex-col">
        <span className="text-T4 text-TEXT-ALT max-TBL:text-T5">{rank}위</span>
        <span
          className={`flex items-center gap-3 text-T1 text-TEXT-MAIN after:text-PRIMARY-SUB ${count && "after:content-['('_attr(data-count)_')']"} after:text-ST3 max-TBL:text-T2 max-MBI:text-ST4 max-TBL:after:text-ST4 max-MBI:after:hidden`}
          data-count={count + suffix}
        >
          {name.length >= 10 ? name.slice(0, 10) + '...' : name}
        </span>
      </div>
      {count !== undefined ? (
        <span className="text-TEXT-SUB text-ST4 MBI:hidden">{count}회</span>
      ) : (
        <></>
      )}
    </div>
  );
};
