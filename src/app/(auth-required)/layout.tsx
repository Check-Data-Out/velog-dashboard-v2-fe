import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Header } from '@/app/components/Header';
import { Notice } from '@/app/components/Notice';
import { notiList } from '@/lib/apis/notice.request';
import { me } from '@/lib/apis/user.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { getQueryClient } from '@/lib/utils/query.util';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const client = getQueryClient();

  await Promise.all([
    client.prefetchQuery({ queryKey: queryKeys.me(), queryFn: me }),
    client.prefetchQuery({ queryKey: queryKeys.notis(), queryFn: notiList }),
  ]);

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
