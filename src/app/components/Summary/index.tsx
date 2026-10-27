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
  // 사이드바(데스크톱)와 접이식 요약(모바일)이 같은 값을 보이도록 증가분은 한 번만 계산한다
  const viewIncrease =
    stats?.totalViews !== undefined && stats?.yesterdayViews !== undefined
      ? stats.totalViews - stats.yesterdayViews
      : undefined;
  const likeIncrease =
    stats?.totalLikes !== undefined && stats?.yesterdayLikes !== undefined
      ? stats.totalLikes - stats.yesterdayLikes
      : undefined;
  const postIncrease =
    yesterdayPostCount !== undefined ? totalPostCount - yesterdayPostCount : undefined;

  return (
    <>
      <aside
        className="flex flex-col h-full gap-[30px] max-TBL:gap-[20px] max-MBI:hidden"
        id="forTest"
      >
        <SidebarContent
          title="전체 조회수"
          content={stats?.totalViews}
          increasement={viewIncrease}
          id="view"
          typeIsCount
        />
        <SidebarContent
          title="전체 좋아요 수"
          content={stats?.totalLikes}
          increasement={likeIncrease}
          id="like"
        />
        <SidebarContent
          title="총 게시글 수"
          content={totalPostCount}
          increasement={postIncrease}
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
              increasement={viewIncrease}
            />
            <BarContent
              title="전체 좋아요 수"
              content={stats?.totalLikes}
              increasement={likeIncrease}
            />
            <BarContent title="총 게시글 수" content={totalPostCount} increasement={postIncrease} />
          </div>
        )}
      </section>
    </>
  );
};
