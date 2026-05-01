import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { getQueryClient } from '@/lib/utils/query.util';
import { Content } from './Content';

export const metadata: Metadata = {
  title: '뉴스레터 구독 취소',
};

interface IProp {
  searchParams: {
    username?: string;
    token?: string;
  };
}

export default async function Page({ searchParams }: IProp) {
  const client = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Content username={searchParams.username ?? ''} token={searchParams.token ?? ''} />
    </HydrationBoundary>
  );
}
