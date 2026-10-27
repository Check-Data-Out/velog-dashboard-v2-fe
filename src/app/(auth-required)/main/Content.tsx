'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import { Section } from '@/app/components/Section';
import { Summary } from '@/app/components/Summary';
import { useSearchParam } from '@/hooks/useSearchParam';
import { postList, postSummary, refreshStats, totalStats } from '@/lib/apis/dashboard.request';
import { me } from '@/lib/apis/user.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { SORT_TYPE } from '@/lib/constants/searchParams.constant';
import { StatsAlreadyRefreshedError } from '@/lib/errors/api.error';
import { FetchError, FetchResponseError } from '@/lib/errors/fetch.error';
import { SortKey, SortValue } from '@/lib/types/searchParams.type';
import { convertDateToKST } from '@/lib/utils/datetime.util';
import { getYesterdayValue } from '@/lib/utils/stats.util';
import { Button } from '@/shared/Button';
import { Check } from '@/shared/Check';
import { Dropdown } from '@/shared/Dropdown';
import { EmptyState } from '@/shared/EmptyState';
import { Loading } from '@/shared/Loading';

const REFRESH_WAIT_TIME = 1000 * 5;

const sorts: Array<[SortKey, SortValue]> = Object.entries(SORT_TYPE) as Array<[SortKey, SortValue]>;

export const Content = () => {
  const [searchParams, setSearchParams] = useSearchParam<{
    asc: 'true' | 'false';
    sort: SortValue;
  }>();
  const [status, setStatus] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const ascBool = searchParams.asc === 'true';
  const {
    data: posts,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: queryKeys.posts({ asc: ascBool, sort: searchParams.sort || '' }),
    queryFn: async ({ pageParam = '' }) =>
      await postList({ asc: ascBool, sort: searchParams.sort || '' }, pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    getPreviousPageParam: () => '',
    initialPageParam: '',
  });

  const { data: summaries } = useQuery({
    queryKey: queryKeys.summary(),
    queryFn: postSummary,
  });

  const { data: yesterdayPostCount } = useQuery({
    queryKey: queryKeys.totalStats('post'),
    queryFn: async () => totalStats('post'),
    select: getYesterdayValue,
  });

  const { data: user } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: me,
    staleTime: Infinity,
  });

  const scheduleRefresh = () => {
    // mutation 콜백은 언마운트 뒤에도 실행되므로, 페이지를 떠났으면 다시 확인하지 않는다
    if (!isMountedRef.current) return;
    refreshTimerRef.current = setTimeout(() => refresh(), REFRESH_WAIT_TIME);
  };

  const { mutate: refresh } = useMutation({
    mutationFn: refreshStats,
    onSuccess: () => {
      // 확인 중 200 은 서버가 새 새로고침을 받아들였다는 뜻이므로 계속 확인한다
      if (!status) {
        setStatus(true);
        toast.success('통계 새로고침이 시작되었습니다!');
      }
      scheduleRefresh();
    },
    throwOnError: false,
    onError: (error: FetchResponseError | FetchError) => {
      const isLastUpdated =
        error instanceof StatsAlreadyRefreshedError &&
        (error.options.body?.data as { lastUpdatedAt?: string })?.lastUpdatedAt;
      if (status && isLastUpdated) {
        // 새로고침 실행 중이었고, lastUpdatedAt 값이 넘어온 경우 (새로고침 완료)
        toast.success('새로고침이 완료되었습니다!');
        queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
        queryClient.invalidateQueries({ queryKey: queryKeys.summary() });
        queryClient.invalidateQueries({ queryKey: queryKeys.totalStats() });
        setStatus(false);
      } else if (status) {
        // 새로고침 실행중이거나 일시적인 오류(타임아웃·네트워크 포함)는 다음 주기에 다시 확인한다
        scheduleRefresh();
      } else if (!(error instanceof FetchResponseError)) {
        return;
      } else if (isLastUpdated) {
        // lastUpdatedAt 값이 넘어온 경우 (이미 새로고침 완료)
        toast.error(error.getToastMessage());
      } else if (error instanceof StatsAlreadyRefreshedError) {
        // 페이지 리프레시 이후에도 새로고침 실행중인 경우
        toast.success('새로고침 실행 상태를 동기화하였습니다');
        setStatus(true);
        scheduleRefresh();
      } else {
        toast.error(error.getToastMessage());
      }
    },
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const pages = posts?.pages;
    if (!pages?.length || !inView) return;

    const hasNextCursor = pages[pages.length - 1].nextCursor !== null;
    if (!hasNextCursor) return;

    fetchNextPage();
  }, [inView]);

  const joinedPosts = useMemo(() => posts?.pages.flatMap((i) => i.posts) || [], [posts]);

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
                username={user?.username ?? ''}
                {...item}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
