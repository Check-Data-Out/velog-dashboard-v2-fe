'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { startHolyLoader } from 'holy-loader';
import { Dropdown } from '@/components';
import { PATHS } from '@/constants';
import { useSearchParam } from '@/hooks';
import { leaderboardList } from '@/apis';
import { LeaderboardItemType } from '@/types';
import { Rank } from './Rank';

export type searchParamsType = {
  based: 'user' | 'post';
  sort: 'viewCount' | 'likeCount';
  limit: string;
  dateRange: string;
};

export const Content = () => {
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
  }, [boards, searchParams.based, searchParams.sort]);

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
            defaultValue="사용자 기준"
          />
          <Dropdown
            options={
              [
                ['조회수 증가순', 'viewCount'],
                ['좋아요 증가순', 'likeCount'],
              ] as const
            }
            onChange={(data) => handleChange({ sort: data as 'viewCount' | 'likeCount' })}
            defaultValue="조회수 증가순"
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
            onChange={(data) => handleChange({ dateRange: data as string })}
            defaultValue="지난 30일"
          />
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-5 overflow-auto">
        {data?.map(({ name, value }, index) => (
          <Rank name={name} key={index} count={value} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};
