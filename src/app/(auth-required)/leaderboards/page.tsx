import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { leaderboardList } from '@/lib/apis/leaderboard.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { getQueryClient } from '@/lib/utils/query.util';
import { Content, searchParamsType } from './Content';

export const metadata: Metadata = {
  title: '리더보드',
};

const defaultParams = {
  based: 'user' as const,
  sort: 'viewCount' as const,
  limit: '10',
  dateRange: '30',
};

export default async function Page({ searchParams }: { searchParams: searchParamsType }) {
  const client = getQueryClient();
  const finalParams = { ...defaultParams, ...searchParams };

  await client.prefetchQuery({
    queryKey: queryKeys.leaderboard(finalParams),
    queryFn: () => leaderboardList(finalParams),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
