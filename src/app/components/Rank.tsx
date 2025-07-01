'use client';

import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IProp extends HTMLAttributes<HTMLDivElement> {
  name: string;
  rank: number;
  url: string;
  count?: string | number;
  suffix?: string;
}

const colorTable = ['border-[#DAA520]', 'border-[#A9A9A9]', 'border-[#B87333]'];

export const Rank = ({ name, rank, count, url, suffix }: IProp) => {
  return (
    <div
      className={twMerge(
        'min-w-[40%] group w-full p-[25px] bg-BG-SUB rounded-[4px] gap-3 justify-between flex cursor-pointer items-center',
        rank > 3 ? 'border-0' : `border-2 ${colorTable[rank - 1]}`,
      )}
      onClick={() => window.open(url)}
    >
      <div className="flex items-center gap-3">
        <span className="text-SUBTITLE-4 text-TEXT-ALT shrink-0 max-TBL:text-SUBTITLE-5 max-MBI:text-SUBTITLE-5">
          {rank + '위'}
        </span>

        <div className=" flex flex-col gap-0">
          <span className="group-hover:underline text-TITLE-3 text-TEXT-MAIN flex items-center gap-3 max-TBL:text-TITLE-4 max-MBI:text-SUBTITLE-4">
            {name}
          </span>
          {suffix !== undefined && (
            <span className="text-SUBTITLE-4 text-TEXT-ALT max-TBL:text-SUBTITLE-5 max-MBI:text-SUBTITLE-5">
              {String(suffix)}
            </span>
          )}
        </div>
      </div>

      <span className="text-SUBTITLE-3 shrink-0 text-TEXT-SUB max-TBL:text-TITLE-4 max-MBI:text-SUBTITLE-4">
        {count}회
      </span>
    </div>
  );
};
