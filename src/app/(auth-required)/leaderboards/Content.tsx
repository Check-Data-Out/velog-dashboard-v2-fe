'use client';

import { Dropdown, Input } from '@/components';

import { PATHS, SCREENS } from '@/constants';
import { useResponsive, useSearchParam } from '@/hooks';
import { Ranker, Rank } from './components';
import { useQuery } from '@tanstack/react-query';
import { leaderboardList } from '@/apis/leaderboard.request';
import { useMemo } from 'react';
import { LeaderboardItemType } from '@/types/leaderboard.type';
import { startHolyLoader } from 'holy-loader';

export type searchParamsType = {
  based: 'user' | 'post';
  sort: 'viewCount' | 'likeCount';
  limit: string;
  dateRange: string;
};

export const Content = () => {
  const width = useResponsive();
  const [searchParams, setSearchParams] = useSearchParam<searchParamsType>();

  const { data: boards } = useQuery({
    queryKey: [PATHS.LEADERBOARD, searchParams],
    queryFn: async () => await leaderboardList(searchParams),
  });

  const data = useMemo(() => {
    const value = (
      searchParams.based === 'user' ? boards?.users : boards?.posts
    ) as LeaderboardItemType[];
    return (
      value.map((item) => ({
        name: searchParams.based === 'user' ? item.email.split('@')[0] : item.title,
        value: searchParams.sort === 'viewCount' ? item.viewDiff : item.likeDiff,
      })) || []
    );
  }, [boards, searchParams.based]);

  const handleChange = (param: Partial<searchParamsType>) => {
    startHolyLoader();
    setSearchParams(param);
  };

  return (
    <div className="flex w-full h-full flex-col gap-[30px] overflow-hidden items-center max-TBL:gap-5">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-4">
          <Dropdown
            options={[
              ['사용자 기준', 'user'],
              ['게시글 기준', 'post'],
            ]}
            onChange={(data) => handleChange({ based: data as 'user' | 'post' })}
            defaultValue=""
          />
          <Dropdown
            options={
              [
                ['조회수 증가순', 'viewCount'],
                ['좋아요 증가순', 'likeCount'],
              ] as const
            }
            onChange={(data) => handleChange({ sort: data as 'viewCount' | 'likeCount' })}
            defaultValue="조회수 증가량"
          />
        </div>
        <div className="flex items-center gap-4">
          <Dropdown
            options={[
              ['10위까지', '10'],
              ['30위까지', '30'],
            ]}
            onChange={(data) => handleChange({ limit: data as string })}
            defaultValue={`${searchParams.limit}위까지`}
          />
          <Dropdown
            options={[
              ['지난 30일', '30'],
              ['지난 7일', '7'],
            ]}
            disabled
            onChange={(data) => handleChange({ dateRange: data as string })}
            defaultValue="지난 30일"
          />
        </div>
      </div>

      <div className="h-full overflow-auto flex flex-col gap-[30px] max-TBL:gap-5">
        <div className="w-full flex gap-10 max-MBI:flex-col max-MBI:gap-5">
          <Ranker name={data[1].name} rank={2} count={data[1].value} />
          <div className={`${width < SCREENS.MBI && 'order-first'} w-full`}>
            <Ranker name={data[0].name} rank={1} count={data[0].value} />
          </div>
          <Ranker name={data[2].name} rank={3} count={data[2].value} />
        </div>
        <div className="w-full flex flex-wrap gap-10 max-TBL:gap-5">
          {data.map(({ name, value }, index) =>
            index >= 3 ? <Rank name={name} key={index} count={value} rank={index + 1} /> : null,
          )}
        </div>
      </div>
    </div>
  );
};
