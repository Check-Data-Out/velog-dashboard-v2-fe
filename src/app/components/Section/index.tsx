'use client';

import { forwardRef, useState } from 'react';
import { COLORS, PATHS, URLS } from '@/constants';
import { Icon } from '@/shared';
import { PostType, UserDto } from '@/types';
import { parseNumber, convertDateToKST, getQueryClient } from '@/utils';
import { Graph } from './Graph';

export const Section = forwardRef<HTMLElement, PostType>((p, ref) => {
  const [open, setOpen] = useState(false);

  const username = (getQueryClient().getQueryData([PATHS.ME]) as Partial<UserDto>)?.username;

  const url = `${URLS.VELOG}/@${username}/${p.slug}`;

  return (
    <section className="flex flex-col w-full h-fit relative" ref={ref}>
      <div
        className={`p-[25px] h-fit cursor-pointer bg-BG-SUB flex justify-between items-center gap-4 ${!open ? 'rounded-[4px] max-MBI:pb-[35px_!important]' : 'rounded-t-[4px]'} max-xl:flex-col max-MBI:flex-col max-MBI:p-[20px]`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex gap-2 items-center">
          <div
            className="flex items-center gap-1"
            title="해당 글로 바로가기"
            onClick={(e) => {
              e.stopPropagation();
              window.open(url);
            }}
          >
            <Icon name="Shortcut" color="#ECECEC" size={20} />
            <span
              className={`text-T3 text-TEXT-MAIN hover:underline max-TBL:after:text-ST5 max-TBL:text-T4 max-MBI:text-ST4`}
            >
              {p.title.length > 30 ? p.title.slice(0, 29).trim() + '..' : p.title}
            </span>
          </div>

          <span className="text-TEXT-ALT text-ST4 MBI:content-[attr(data-date)] max-MBI:hidden">
            {convertDateToKST(p.releasedAt)?.short}
          </span>
        </div>

        <div className="flex items-center text-ST4 justify-between text-TEXT-ALT gap-1 max-TBL:text-ST5 max-MBI:w-full">
          <span className="MBI:hidden">{convertDateToKST(p.releasedAt)?.short}</span>
          <div className="flex flex-wrap items-center gap-[6px]">
            <span className='after:content-["/"] after:ml-2'>{parseNumber(p.views)}</span>
            <span className="flex items-center before:text-PRIMARY-SUB before:content-['↑'] before:mr-1 after:ml-2 after:content-['/']">
              {parseNumber(p.views - p.yesterdayViews)}
            </span>
            <Icon
              name="Like"
              color={COLORS.PRIMARY.SUB}
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
          className="MBI:hidden absolute bottom-[5px]"
        />
      </div>
      {open && <Graph id={p.id} releasedAt={p.releasedAt} />}
    </section>
  );
});

Section.displayName = 'Section';
