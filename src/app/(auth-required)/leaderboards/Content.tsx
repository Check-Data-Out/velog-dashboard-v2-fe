'use client';

import { useQuery } from '@tanstack/react-query';
import { startHolyLoader } from 'holy-loader';
import { useMemo } from 'react';
import { Rank } from '@/app/components/Rank';
import { useSearchParam } from '@/hooks/useSearchParam';
import { leaderboardList } from '@/lib/apis/leaderboard.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { URLS } from '@/lib/constants/urls.constant';
import { LeaderboardItemType, LeaderboardListPost } from '@/lib/types/leaderboard.type';
import { Dropdown } from '@/shared/Dropdown';
import { EmptyState } from '@/shared/EmptyState';

export type searchParamsType = {
  based: 'user' | 'post';
  sort: 'viewCount' | 'likeCount';
  limit: string;
  dateRange: string;
};

const defaultParams = {
  based: 'user' as const,
  sort: 'viewCount' as const,
  limit: '10',
  dateRange: '30',
};

export const Content = () => {
  const [searchParams, setSearchParams] = useSearchParam<searchParamsType>();

  const finalParams = {
    ...defaultParams,
    ...searchParams,
  };

  const { data: boards, isLoading } = useQuery({
    queryKey: queryKeys.leaderboard(finalParams),
    queryFn: async () => await leaderboardList(finalParams),
  });

  const data = useMemo(() => {
    const isUserBased = finalParams?.based === 'user';
    const isViewBased = finalParams?.sort === 'viewCount';

    const value = ((isUserBased ? boards?.users : boards?.posts) || []) as LeaderboardItemType[];

    return value.map((item) => {
      const post = item as LeaderboardListPost;
      return {
        key: isUserBased ? item.username : post.title,
        username: item.username,
        url: URLS.VELOG + `/@${item.username}` + (isUserBased ? '/posts' : `/${post.slug}`),
        value: isViewBased ? item.viewDiff : item.likeDiff,
      };
    });
  }, [boards, finalParams?.based, finalParams?.sort]);

  const handleChange = (param: Partial<searchParamsType>) => {
    startHolyLoader();
    setSearchParams(param);
  };

  // 로딩 중이 아니고 데이터가 없는 경우
  const isEmpty = !isLoading && data.length === 0;

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
            defaultValue={`${finalParams.limit}위까지`}
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
        {isEmpty ? (
          <EmptyState
            title="리더보드 데이터가 없습니다"
            description={`현재 설정된 조건에 맞는 ${finalParams.based === 'user' ? '사용자' : '게시물'} 데이터가 없습니다. 다른 조건으로 검색해보세요.`}
            icon="📊"
          />
        ) : (
          data?.map(({ key, username, url, value }, index) => (
            <Rank
              name={key}
              key={url}
              url={url}
              count={value}
              rank={index + 1}
              suffix={finalParams.based === 'post' ? username : ''}
            />
          ))
        )}
      </div>
    </div>
  );
};
