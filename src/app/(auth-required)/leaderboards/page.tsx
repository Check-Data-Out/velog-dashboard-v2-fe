import { Metadata } from 'next';
import { Content, searchParamsType } from './Content';
import { getQueryClient } from '@/utils/queryUtil';
import { PATHS } from '@/constants';
import { leaderboardList } from '@/apis/leaderboard.request';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: '리더보드',
};

export default async function Page({ searchParams }: { searchParams: searchParamsType }) {
  const client = getQueryClient();

  await client.prefetchQuery({
    queryKey: [PATHS.LEADERBOARD, searchParams],
    queryFn: async () => await leaderboardList(searchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
