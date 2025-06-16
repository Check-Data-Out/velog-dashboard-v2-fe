import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { postList, postSummary } from '@/apis';
import { PATHS } from '@/constants';
import { getQueryClient } from '@/utils';
import { Content } from './Content';

export const metadata: Metadata = {
  title: '대시보드',
};

interface IProp {
  searchParams: {
    asc: 'true' | 'false';
    sort: '' | 'dailyViewCount' | 'dailyLikeCount';
  };
}

export default async function Page({ searchParams }: IProp) {
  const client = getQueryClient();

  await client.prefetchInfiniteQuery({
    queryKey: [PATHS.POSTS, [searchParams.asc, searchParams.sort]],
    queryFn: async () =>
      await postList({ asc: searchParams.asc === 'true', sort: searchParams.sort || '' }),
    initialPageParam: undefined,
  });

  await client.prefetchQuery({ queryKey: [PATHS.SUMMARY], queryFn: postSummary });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
