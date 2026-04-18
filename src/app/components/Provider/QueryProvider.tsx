'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/utils/query.util';

interface IProp {
  children: React.ReactNode | React.ReactNode[];
}

export const QueryProvider = ({ children }: IProp) => {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
};
