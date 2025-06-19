import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { leaderboardList } from '@/apis';
import { PATHS } from '@/constants';
import { getQueryClient } from '@/utils';
import { Content, searchParamsType } from './Content';

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
