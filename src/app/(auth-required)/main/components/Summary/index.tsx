'use client';

import { useState } from 'react';
import { Icon } from '@/components';
import { PostSummaryDto } from '@/types';
import { SidebarContent } from './SidebarContent';
import { BarContent } from './BarContent';

export const Summary = ({ totalPostCount, stats }: PostSummaryDto) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className="flex flex-col h-full gap-[30px] max-TBL:gap-[20px] max-MBI:hidden"
        id="forTest"
      >
        <SidebarContent
          title="전체 조회수"
          content={stats?.totalViews}
          prefix="회"
          increasement={stats?.totalViews - stats?.yesterdayViews}
          id="view"
        />
        <SidebarContent
          title="전체 좋아요 수"
          content={stats?.totalLikes}
          increasement={stats?.totalLikes - stats?.yesterdayLikes}
          id="like"
        />
        <SidebarContent title="총 게시글 수" content={totalPostCount} id="post" />
      </aside>
      <section
        className={`flex flex-col w-full px-5 bg-BG-SUB rounded-[4px] cursor-pointer MBI:hidden`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="text-TEXT-ALT flex items-center justify-center text-ST5 w-full h-[52px] gap-[10px] shrink-0">
          <span>요약 정보 {open ? '펼치기' : '접기'}</span>
          <Icon name="Arrow" size={17} rotate={open ? 'up' : 'down'} />
        </div>
        {open && (
          <div className="w-full h-fit flex flex-col pb-5 shrink-0 gap-[10px]">
            <BarContent
              title="전체 조회수"
              content={stats?.totalViews}
              prefix="회"
              increasement={stats?.totalViews - stats?.yesterdayViews}
            />
            <BarContent
              title="전체 좋아요 수"
              content={stats?.totalLikes}
              increasement={stats?.totalLikes - stats?.yesterdayLikes}
            />
            <BarContent title="총 게시글 수" content={totalPostCount} />
          </div>
        )}
      </section>
    </>
  );
};
