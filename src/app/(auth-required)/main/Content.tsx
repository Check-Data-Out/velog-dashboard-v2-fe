'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
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
import { postList } from '@/apis';
import { PATHS } from '@/constants';
import { useSearchParam } from '@/hooks/useSearchParam';

const sorts: Array<OptionType> = [
  ['작성일순', ''],
  ['조회순', 'daily_view_count'],
  ['좋아요순', 'daily_like_count'],
  ['제목순', 'title'],
];

export const Content = () => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (
      data &&
      data.pages[data.pages?.length - 1].nextCursor !== null &&
      inView
    ) {
      fetchNextPage();
    }
  }, [inView]);
  const { searchParams, setSearchParams } = useSearchParam();

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [PATHS.POSTS, [searchParams.asc, searchParams.sort]], // Query Key
    queryFn: async ({ pageParam }) =>
      await postList(
        { asc: searchParams.asc === 'true', sort: searchParams.sort || '' },
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: () => 0,
    initialPageParam: undefined,
  });

  return (
    <div className="flex w-full h-full gap-[30px] max-MBI:flex-col max-TBL:gap-[20px] overflow-hidden">
      <Summary views={12345} likes={54321} posts={12} />

      <div className="w-full flex flex-col gap-[30px] overflow-auto max-TBL:gap-[20px]">
        <div className="flex h-fit flex-col items-center p-[20px] bg-BG-SUB gap-5 rounded-[4px]">
          <span className="text-TEXT-ALT text-ST5 MBI:hidden">
            마지막 업데이트 : 2024-12-20, 20:13:34
          </span>
          <div className="w-full flex items-center justify-between flex-wrap max-MBI:justify-center max-MBI:gap-4">
            <div className="flex items-center gap-3">
              <Button size="SMALL">새로고침</Button>
              <span className="text-TEXT-ALT text-ST4 max-TBL:text-ST5 max-MBI:hidden">
                마지막 업데이트 : 2024-12-20, 20:13:34
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
          {data?.pages.map((n) =>
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
