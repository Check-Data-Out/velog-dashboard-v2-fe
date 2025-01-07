import { ReactElement } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Header } from '@/components';
import { PATHS } from '@/constants';
import { getCookieForAuth } from '@/utils/cookieUtil';
import { me } from '@/apis';

export default async function Layout({ children }: { children: ReactElement }) {
  const client = new QueryClient();

  await client.prefetchQuery({
    queryKey: [PATHS.ME],
    queryFn: async () =>
      await me(getCookieForAuth(cookies, ['access_token', 'refresh_token'])),
  });

  return (
    <main className="items-center w-full h-full flex flex-col p-[50px_70px_70px_70px] transition-all max-TBL:p-[20px_30px_30px_30px] max-MBI:p-[10px_25px_25px_25px]">
      <div className="w-full max-w-[1740px] h-full overflow-hidden flex flex-col gap-[30px] max-TBL:gap-[20px]">
        <HydrationBoundary state={dehydrate(client)}>
          <Header />
        </HydrationBoundary>
        {children}
      </div>
    </main>
  );
}
