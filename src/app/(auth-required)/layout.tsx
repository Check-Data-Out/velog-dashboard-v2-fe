import { ReactElement } from 'react';
import { Header } from '@/components';

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <main className="w-full h-full flex flex-col p-[50px_70px_70px_70px] max-TBL:p-[40px_30px] gap-[30px] transition-all max-TBL:gap-[20px]">
      <Header />
      {children}
    </main>
  );
}
