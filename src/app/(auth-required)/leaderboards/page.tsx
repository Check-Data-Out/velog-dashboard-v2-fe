import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { leaderboardList } from '@/lib/apis/leaderboard.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { LEADERBOARD_DEFAULT_PARAMS } from '@/lib/constants/searchParams.constant';
import { getQueryClient } from '@/lib/utils/query.util';
import { Content, searchParamsType } from './Content';

export const metadata: Metadata = {
  title: '리더보드',
};

export default async function Page({ searchParams }: { searchParams: Promise<searchParamsType> }) {
  const client = getQueryClient();
  const finalParams = { ...LEADERBOARD_DEFAULT_PARAMS, ...(await searchParams) };

  await client.prefetchQuery({
    queryKey: queryKeys.leaderboard(finalParams),
    queryFn: async () => leaderboardList(finalParams),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
