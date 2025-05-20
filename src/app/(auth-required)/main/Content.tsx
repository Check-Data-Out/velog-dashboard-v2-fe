'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Button, Dropdown, Check } from '@/components';
import { postList, postSummary } from '@/apis';
import { PATHS, SORT_TYPE } from '@/constants';
import { SortKey, SortValue } from '@/types';
import { convertDateToKST } from '@/utils/dateUtil';
import { Section, Summary } from './components';

const sorts: Array<[SortKey, SortValue]> = Object.entries(SORT_TYPE) as Array<[SortKey, SortValue]>;

export const Content = () => {
  const [searchParams, setSearchParams] = useSearchParam<{
    asc: 'true' | 'false';
    sort: SortValue;
  }>();

  const { ref, inView } = useInView();

  const { data: posts, fetchNextPage } = useInfiniteQuery({
    queryKey: [PATHS.POSTS, [searchParams.asc, searchParams.sort]], // Query Key
    queryFn: async ({ pageParam = '' }) =>
      await postList(
        { asc: searchParams.asc === 'true', sort: searchParams.sort || '' },
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: () => '',
    initialPageParam: '',
  });

  const { data: summaries } = useQuery({
    queryKey: [PATHS.SUMMARY],
    queryFn: postSummary,
  });

  useEffect(() => {
    if (posts?.pages?.[posts.pages?.length - 1].nextCursor !== null && inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex w-full h-full gap-[30px] max-MBI:flex-col max-TBL:gap-[20px] overflow-hidden">
      {summaries && <Summary {...summaries} />}

      <div className="w-full flex flex-col gap-[30px] overflow-auto max-TBL:gap-[20px]">
        <div className="flex h-fit flex-col items-center p-[20px] bg-BG-SUB gap-5 rounded-[4px]">
          <span className="text-TEXT-ALT text-ST5 MBI:hidden">
            마지막 업데이트 :{' '}
            {convertDateToKST(summaries?.stats?.lastUpdatedDate)?.iso || '업데이트 중..'}
          </span>
          <div className="w-full flex items-center justify-between flex-wrap max-MBI:justify-center max-MBI:gap-4">
            <div className="flex items-center gap-3">
              <Button size="SMALL" disabled>
                새로고침
              </Button>
              <span className="text-TEXT-ALT text-ST4 max-TBL:text-ST5 max-MBI:hidden">
                마지막 업데이트 :{' '}
                {convertDateToKST(summaries?.stats?.lastUpdatedDate)?.iso || '업데이트 중..'}
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
          {posts?.pages?.map((n) =>
            n.posts?.map((i, j) =>
              j !== n?.posts.length - 1 ? (
                <Section key={i.id} {...i} />
              ) : (
                <div className="relative" key={i.id}>
                  <div ref={ref} className="absolute" />
                  <Section {...i} />
                </div>
              ),
            ),
          )}
        </div>
      </div>
    </div>
  );
};
