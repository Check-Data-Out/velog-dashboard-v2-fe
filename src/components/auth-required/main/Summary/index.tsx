'use client';

import { useState } from 'react';
import { Icon } from '@/components';
import { SidebarContent } from './SidebarContent';
import { BarContent } from './BarContent';

interface IProp {
  total_views: number;
  views: number;
  total_likes: number;
  likes: number;
  total_posts: number;
}

export const Summary = ({
  total_views,
  total_likes,
  total_posts,
  views,
  likes,
}: IProp) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="flex flex-col h-full gap-[30px] max-TBL:gap-[20px] max-MBI:hidden">
        <SidebarContent
          title="전체 조회수"
          content={total_views}
          prefix="회"
          increasement={views}
        />
        <SidebarContent
          title="전체 좋아요 수"
          content={total_likes}
          increasement={likes}
        />
        <SidebarContent title="총 게시글 수" content={total_posts} />
      </aside>
      <section
        className={`MBI:hidden flex flex-col w-full bg-bg-sub rounded-[4px] cursor-pointer`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="text-text-alt flex items-center justify-center text-[15px] w-full h-[52px] gap-[10px] font-medium shrink-0">
          <span>요약 정보 {open ? '펼치기' : '접기'}</span>
          <Icon name="Arrow" size={17} rotate={open ? 'up' : 'down'} />
        </div>
        {open && (
          <div className="w-full h-fit flex flex-col py-[20px] px-[35px] shrink-0 gap-[10px]">
            <BarContent
              title="전체 조회수"
              content={total_views}
              prefix="회"
              increasement={views}
            />
            <BarContent
              title="전체 좋아요 수"
              content={total_likes}
              increasement={likes}
            />
            <BarContent title="총 게시글 수" content={total_posts} />
          </div>
        )}
      </section>
    </>
  );
};
