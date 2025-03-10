import { ReactElement } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Header } from '@/components';
import { PATHS } from '@/constants';
import { me, notiList } from '@/apis';
import { getQueryClient } from '@/utils/queryUtil';
import { Notice } from '@/components/auth-required/notice';

interface IProp {
  children: ReactElement;
}

export default async function Layout({ children }: IProp) {
  const client = getQueryClient();

  await client.prefetchQuery({
    queryKey: [PATHS.ME],
    queryFn: me,
  });

  await client.prefetchQuery({
    queryKey: [PATHS.NOTIS],
    queryFn: notiList,
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <main className="items-center w-full h-full flex flex-col">
        <Notice />
        <div className="w-full max-w-[1740px] h-full overflow-hidden flex flex-col gap-[30px] p-[50px_70px_70px_70px] transition-all duration-300 max-TBL:gap-[20px] max-TBL:p-[20px_30px_30px_30px] max-MBI:p-[10px_25px_25px_25px]">
          <Header />
          {children}
        </div>
      </main>
    </HydrationBoundary>
  );
}
