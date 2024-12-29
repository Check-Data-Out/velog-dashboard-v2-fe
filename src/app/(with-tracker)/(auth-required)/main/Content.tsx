'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Button,
  Dropdown,
  Section,
  Summary,
  Check,
  OptionType,
} from '@/components';
import { postList, postSummary } from '@/apis';
import { PATHS } from '@/constants';
import { useSearchParam } from '@/hooks/useSearchParam';

const sorts: Array<OptionType> = [
  ['작성일순', ''],
  ['조회순', 'daily_view_count'],
  ['좋아요순', 'daily_like_count'],
  ['제목순', 'title'],
];

export const Content = () => {
  const { searchParams, setSearchParams } = useSearchParam();
  const { ref, inView } = useInView();

  const { data: posts, fetchNextPage } = useInfiniteQuery({
    queryKey: [PATHS.POSTS, [searchParams.asc, searchParams.sort]], // Query Key
    queryFn: async ({ pageParam }) =>
      await postList(
        {},
        { asc: searchParams.asc === 'true', sort: searchParams.sort || '' },
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: () => 0,
    initialPageParam: undefined,
  });

  const { data: summaries } = useQuery({
    queryKey: [PATHS.SUMMARY],
    queryFn: async () => postSummary({}),
  });

  useEffect(() => {
    if (
      posts &&
      posts.pages[posts.pages?.length - 1].nextCursor !== null &&
      inView
    ) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex w-full h-full gap-[30px] max-MBI:flex-col max-TBL:gap-[20px] overflow-hidden">
      {summaries && <Summary {...summaries} />}

      <div className="w-full flex flex-col gap-[30px] overflow-auto max-TBL:gap-[20px]">
        <div className="flex h-fit flex-col items-center p-[20px] bg-BG-SUB gap-5 rounded-[4px]">
          <span className="text-TEXT-ALT text-ST5 MBI:hidden">
            마지막 업데이트 : {summaries?.stats.lastUpdatedDate}
          </span>
          <div className="w-full flex items-center justify-between flex-wrap max-MBI:justify-center max-MBI:gap-4">
            <div className="flex items-center gap-3">
              <Button size="SMALL" disabled>
                새로고침
              </Button>
              <span className="text-TEXT-ALT text-ST4 max-TBL:text-ST5 max-MBI:hidden">
                마지막 업데이트 : {summaries?.stats.lastUpdatedDate}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check
                onChange={() =>
                  setSearchParams({
                    asc: `${!(searchParams.asc === 'true')}`,
                  })
                }
                checked={searchParams.asc === 'true'}
                label="오름차순"
              />
              <Dropdown
                defaultValue={
                  sorts.find((i) => i[1] === searchParams.sort) as OptionType
                }
                options={sorts}
                onChange={(data) => {
                  setSearchParams({ sort: encodeURI(data as string) });
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-[30px] relative max-TBL:gap-[20px] overflow-auto">
          {posts?.pages.map((n) =>
            n.posts.map((i, j) =>
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
