import { ReactElement } from 'react';
import { Header } from '@/components';

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <main className="w-full h-full flex flex-col p-[50px_70px_70px_70px] gap-[30px] transition-all max-TBL:p-[20px_30px_30px_30px] max-MBI:p-[10px_25px_25px_25px] max-TBL:gap-[20px]">
      <Header />
      {children}
    </main>
  );
}
