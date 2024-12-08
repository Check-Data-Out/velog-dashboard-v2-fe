'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReactNode } from 'react';

const client = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { onError: (err) => toast.error(`${err.message}`) },
  },
});

interface IProp {
  children: ReactNode | ReactNode[];
}

export const QueryProvider = ({ children }: IProp) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
