import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { leaderboardList } from '@/lib/apis/leaderboard.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { getQueryClient } from '@/lib/utils/query.util';
import { Content, searchParamsType } from './Content';

export const metadata: Metadata = {
  title: '리더보드',
};

export default async function Page({ searchParams }: { searchParams: searchParamsType }) {
  const client = getQueryClient();

  await client.prefetchQuery({
    queryKey: queryKeys.leaderboard(searchParams),
    queryFn: async () => await leaderboardList(searchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
