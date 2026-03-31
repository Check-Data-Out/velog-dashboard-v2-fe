import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { postList, postSummary } from '@/lib/apis/dashboard.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { getQueryClient } from '@/lib/utils/query.util';
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
    queryKey: queryKeys.posts({ asc: searchParams.asc, sort: searchParams.sort || '' }),
    queryFn: async () =>
      await postList({ asc: searchParams.asc === 'true', sort: searchParams.sort || '' }),
    initialPageParam: undefined,
  });

  await client.prefetchQuery({ queryKey: queryKeys.summary(), queryFn: postSummary });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
