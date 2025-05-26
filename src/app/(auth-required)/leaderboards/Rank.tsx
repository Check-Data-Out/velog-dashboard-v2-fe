import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IProp extends HTMLAttributes<HTMLDivElement> {
  name: string;
  rank: number;
  count?: string | number;
  suffix?: string;
}

const colorTable = ['border-[#DAA520]', 'border-[#A9A9A9]', 'border-[#B87333]'];

export const Rank = ({ name, rank, count, suffix = '회' }: IProp) => {
  return (
    <div
      className={twMerge(
        'min-w-[40%] w-full p-[25px] bg-BG-SUB rounded-[4px] gap-3 justify-between flex',
        rank - 1 <= 2 ? `border-2 ${colorTable[rank - 1]}` : 'border-0',
      )}
    >
      <span
        data-rank={rank}
        className="text-T3 text-TEXT-MAIN flex items-center gap-3 before:content-[attr(data-rank)_'위'] before:text-ST4 before:text-TEXT-ALT max-TBL:text-T4 max-TBL:before:text-T5 max-MBI:text-ST4 max-MBI:before:text-ST5"
      >
        {name}
      </span>
      <span className="text-ST3 shrink-0 text-TEXT-SUB max-TBL:text-T4 max-MBI:text-ST4">
        {count}
        {suffix}
      </span>
    </div>
  );
};
