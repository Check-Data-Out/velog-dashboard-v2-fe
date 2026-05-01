'use client';

import { useState } from 'react';
import { PostSummaryDto } from '@/lib/types/dashboard.type';
import { Icon } from '@/shared/Icon';
import { BarContent } from './BarContent';
import { SidebarContent } from './SidebarContent';

interface IProp {
  totalPostCount: number;
  yesterdayPostCount?: number;
  stats: PostSummaryDto['stats'];
}

export const Summary = ({ totalPostCount, yesterdayPostCount, stats }: IProp) => {
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
          increasement={
            stats?.totalViews !== undefined && stats?.yesterdayViews !== undefined
              ? stats.totalViews - stats.yesterdayViews
              : undefined
          }
          id="view"
          typeIsCount
        />
        <SidebarContent
          title="전체 좋아요 수"
          content={stats?.totalLikes}
          increasement={
            stats?.totalLikes !== undefined && stats?.yesterdayLikes !== undefined
              ? stats.totalLikes - stats.yesterdayLikes
              : undefined
          }
          id="like"
        />
        <SidebarContent
          title="총 게시글 수"
          content={totalPostCount}
          increasement={
            yesterdayPostCount !== undefined ? totalPostCount - yesterdayPostCount : undefined
          }
          id="post"
        />
      </aside>
      <section
        className={`flex flex-col w-full px-5 bg-BG-SUB rounded-[4px] cursor-pointer MBI:hidden`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="text-TEXT-ALT flex items-center justify-center text-SUBTITLE-5 w-full h-[52px] gap-[10px] shrink-0">
          <span>요약 정보 {open ? '접기' : '펼치기'}</span>
          <Icon name="Arrow" size={17} rotate={open ? 'up' : 'down'} />
        </div>
        {open && (
          <div className="w-full h-fit flex flex-col pb-5 shrink-0 gap-[10px]">
            <BarContent
              title="전체 조회수"
              content={stats?.totalViews}
              prefix="회"
              increasement={
                stats?.totalViews !== undefined && stats?.yesterdayViews !== undefined
                  ? stats.totalViews - stats.yesterdayViews
                  : undefined
              }
            />
            <BarContent
              title="전체 좋아요 수"
              content={stats?.totalLikes}
              increasement={
                stats?.totalLikes !== undefined && stats?.yesterdayLikes !== undefined
                  ? stats.totalLikes - stats.yesterdayLikes
                  : undefined
              }
            />
            <BarContent
              title="총 게시글 수"
              content={totalPostCount}
              increasement={
                yesterdayPostCount !== undefined ? totalPostCount - yesterdayPostCount : undefined
              }
            />
          </div>
        )}
      </section>
    </>
  );
};
