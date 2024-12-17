'use client';

import { useState } from 'react';
import { Icon } from '@/components';
import { parseNumber } from '@/utils/numberUtil';

interface IProp {
  views: number;
  before_views: number;
  date: string;
  title: string;
  total_views: number;
  likes: number;
  id: string;
}

export const Section = (p: IProp) => {
  const [open, setOpen] = useState(false);
  const doesViewIncreased = p.views - p.before_views > 0;

  return (
    <section className="flex flex-col w-full h-fit rounded-[4px]">
      <div
        className={`p-[25px] min-h-[87.5px] cursor-pointer bg-bg-sub max-xl:flex-col flex relative justify-between items-center gap-4 max-mbi:flex-col max-mbi:pb-[35px]`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`text-[25px] font-normal text-text-main after:text-text-alt after:text-[20px] items-center flex gap-3 after:font-medium mbi:after:content-[attr(data-date)] max-tbl:text-[21px] max-tbl:after:text-[18px]`}
          data-date={p.date.split('T')[0]}
        >
          {p.title.length > 19 ? p.title.slice(0, 19).trim() + '..' : p.title}
        </span>
        <div className="flex items-center text-[20px] font-medium justify-between text-text-alt gap-1 max-tbl:text-[15px] max-mbi:w-full">
          <span className="mbi:hidden">{p.date.split('T')[0]}</span>
          <div className="flex items-center gap-[6px]">
            <span className='after:content-["_/"]'>
              {parseNumber(p.total_views)}
            </span>
            <span
              className={`after:ml-1 ${doesViewIncreased ? 'after:text-primary-sub after:content-["↑"]' : 'after:text-destructive-sub after:content-["↓"]'}`}
            >
              {parseNumber(p.views)}
            </span>
            <span>/</span>
            <Icon
              name="Like"
              className="w-[23px] max-tbl:w-[19px] max-mbi:w-[16px]"
            />
            <span>{parseNumber(p.likes)}</span>
            <Icon
              name="Arrow"
              rotate={open ? 'up' : 'down'}
              className="w-[26px] max-tbl:w-[19px] max-mbi:hidden"
            />
          </div>
        </div>
        <Icon
          name="Arrow"
          size={17}
          rotate={open ? 'up' : 'down'}
          className="mbi:hidden absolute bottom-3"
        />
      </div>
    </section>
  );
};
