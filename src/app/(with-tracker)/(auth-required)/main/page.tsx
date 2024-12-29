import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PATHS } from '@/constants';
import { postList, postSummary } from '@/apis';
import { getCookieForAuth } from '@/utils/cookieUtil';
import { Content } from './Content';

export const metadata: Metadata = {
  title: '대시보드',
  description: '각종 Velog 통계를 볼 수 있는 대시보드',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const client = new QueryClient();
  await client.prefetchInfiniteQuery({
    queryKey: [PATHS.POSTS, [searchParams.asc, searchParams.sort]],
    queryFn: async () =>
      await postList(
        getCookieForAuth(cookies, ['access_token', 'refresh_token']),
        {
          asc: searchParams.asc === 'true',
          sort: searchParams.sort || '',
        },
      ),
    initialPageParam: undefined,
  });

  await client.prefetchQuery({
    queryKey: [PATHS.SUMMARY],
    queryFn: async () =>
      await postSummary(
        getCookieForAuth(cookies, ['access_token', 'refresh_token']),
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content />
    </HydrationBoundary>
  );
}
