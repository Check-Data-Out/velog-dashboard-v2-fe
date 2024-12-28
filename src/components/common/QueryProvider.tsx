'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'react-toastify';

let localQueryClient: QueryClient | undefined;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
      mutations: { onError: (err) => toast.error(`${err.message}`) },
    },
  });

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  } else {
    if (!localQueryClient) localQueryClient = createQueryClient();
    return localQueryClient;
  }
};

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
