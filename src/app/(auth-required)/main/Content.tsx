'use client';

import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import { postList, postSummary, refreshStats, totalStats } from '@/apis';
import { Section, Summary } from '@/app/components';
import { PATHS, SORT_TYPE } from '@/constants';
import { useSearchParam } from '@/hooks';
import { Button, Dropdown, Check, EmptyState, Loading } from '@/shared';
import { RefreshStatsDto, SortKey, SortValue } from '@/types';
import { convertDateToKST } from '@/utils';
import { FetchResponseError } from '@/errors';

const REFRESH_WAIT_TIME = 1000 * 5;

const sorts: Array<[SortKey, SortValue]> = Object.entries(SORT_TYPE) as Array<[SortKey, SortValue]>;

export const Content = () => {
  const [searchParams, setSearchParams] = useSearchParam<{
    asc: 'true' | 'false';
    sort: SortValue;
  }>();
  const [status, setStatus] = useState(false);

  const { ref, inView } = useInView();

  const {
    data: posts,
    fetchNextPage,
    isLoading,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: [PATHS.POSTS, [searchParams.asc, searchParams.sort]],
    queryFn: async ({ pageParam = '' }) =>
      await postList(
        { asc: searchParams.asc === 'true', sort: searchParams.sort || '' },
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    getPreviousPageParam: () => '',
    initialPageParam: '',
  });

  const { data: summaries, refetch: refetchSummaries } = useQuery({
    queryKey: [PATHS.SUMMARY],
    queryFn: postSummary,
  });

  const { data: yesterdayPostCount, refetch: refetchYesterdayPostCount } = useQuery({
    queryKey: [PATHS.TOTALSTATS],
    queryFn: async () => totalStats('post'),
    select: (data) => data.slice(1, 2)[0]?.value,
  });

  const { mutate: refresh } = useMutation({
    mutationFn: refreshStats,
    onSuccess: () => {
      setStatus(true);
      toast.success('통계 새로고침이 시작되었습니다!');
      setTimeout(() => refresh(), REFRESH_WAIT_TIME);
    },
    onError: () => {
      if (status) {
        setStatus(false);
        toast.success('새로고침이 완료되었습니다!');
        refetchPosts();
        refetchSummaries();
        refetchYesterdayPostCount();
        return;
      }
    },
    retry: (_, error: FetchResponseError) => {
      if (!(error.options.body?.data as RefreshStatsDto)?.lastUpdatedAt) {
        return true;
      }
      return false;
    },
    retryDelay: 1000 * 5,
  });

  useEffect(() => {
    const pages = posts?.pages;
    if (!pages?.length || !inView) return;

    const hasNextCursor = pages[pages.length - 1].nextCursor !== null;
    if (!hasNextCursor) return;

    fetchNextPage();
  }, [inView]);

  const joinedPosts = useMemo(() => posts?.pages.flatMap((i) => i.posts) || [], [posts]);

  // 로딩 중이 아니고 게시물이 없는 경우
  const isEmpty = !isLoading && (!joinedPosts || joinedPosts.length === 0);

  return (
    <div className="flex w-full h-full gap-[30px] max-MBI:flex-col max-TBL:gap-[20px] overflow-hidden">
      {summaries && <Summary {...summaries} yesterdayPostCount={yesterdayPostCount} />}

      <div className="w-full flex flex-col gap-[30px] overflow-auto max-TBL:gap-[20px]">
        <div className="flex h-fit flex-col items-center p-[20px] bg-BG-SUB gap-5 rounded-[4px]">
          <div className="w-full flex items-center justify-between flex-wrap max-MBI:justify-center max-MBI:gap-4">
            <div className="flex items-center gap-3 max-MBI:hidden">
              <Button size="SMALL" onClick={() => refresh()} disabled={status}>
                새로고침
              </Button>
              <span className="text-TEXT-ALT text-SUBTITLE-4 max-TBL:text-SUBTITLE-5">
                마지막 업데이트 :{' '}
                {status ? (
                  <Loading />
                ) : (
                  convertDateToKST(summaries?.stats?.lastUpdatedDate)?.iso ||
                  '새로고침 버튼을 눌러주세요'
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check
                onChange={() => {
                  setSearchParams({
                    asc: searchParams.asc === 'true' ? 'false' : 'true',
                  });
                }}
                checked={searchParams.asc === 'true'}
                label="오름차순"
              />
              <Dropdown
                defaultValue={
                  sorts.find((i) => i[1] === searchParams.sort) ?? SORT_TYPE['작성일순']
                }
                options={sorts}
                onChange={(data) => setSearchParams({ sort: data as SortValue })}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-[30px] relative max-TBL:gap-[20px] overflow-auto">
          {isEmpty ? (
            <EmptyState
              title="게시물이 없습니다"
              description="아직 작성된 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!"
              icon="📝"
            />
          ) : (
            joinedPosts?.map((item, index, array) => (
              <Section
                key={item?.id ?? index}
                ref={index === array.length - 1 ? ref : undefined}
                {...item}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
