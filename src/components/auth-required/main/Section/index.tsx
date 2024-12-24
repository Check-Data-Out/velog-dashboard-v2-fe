'use client';

import { useState } from 'react';
import { Icon } from '@/components';
import { parseNumber } from '@/utils/numberUtil';
import { COLORS } from '@/constants';
import { Graph } from './Graph';

interface IProp {
  views: number;
  date: string;
  title: string;
  likes: number;
  id: string;
}

export const Section = (p: IProp) => {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col w-full h-fit rounded-[4px] relative">
      <div
        className={`p-[25px] min-h-[87.5px] cursor-pointer bg-bg-sub max-xl:flex-col flex  justify-between items-center gap-4 max-MBI:flex-col max-MBI:pb-[35px]`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`text-[25px] font-normal text-text-main after:text-text-alt after:text-[20px] items-center flex gap-3 after:font-medium MBI:after:content-[attr(data-date)] max-TBL:text-[21px] max-TBL:after:text-[18px]`}
          data-date={p.date.split('T')[0]}
        >
          {p.title.length > 19 ? p.title.slice(0, 19).trim() + '..' : p.title}
        </span>
        <div className="flex items-center text-[20px] font-medium justify-between text-text-alt gap-1 max-TBL:text-[15px] max-MBI:w-full">
          <span className="MBI:hidden">{p.date.split('T')[0]}</span>
          <div className="flex items-center gap-[6px]">
            <span className='after:content-["/"] after:ml-2'>
              {parseNumber(p.views * 100)}
            </span>
            <span className="flex items-center after:ml-2 before:text-primary-sub before:content-['↑'] before:mr-1 after:content-['/']">
              {parseNumber(p.views)}
            </span>
            <Icon
              name="Like"
              color={COLORS.primary.sub}
              className="w-[23px] max-TBL:w-[19px] max-MBI:w-[16px]"
            />
            <span>{parseNumber(p.likes)}</span>
            <Icon
              name="Arrow"
              rotate={open ? 'up' : 'down'}
              className="w-[26px] max-TBL:w-[19px] max-MBI:hidden"
            />
          </div>
        </div>
        <Icon
          name="Arrow"
          size={17}
          rotate={open ? 'up' : 'down'}
          className="MBI:hidden absolute bottom-3"
        />
      </div>
      {open && <Graph />}
    </section>
  );
};
