import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

let localQueryClient: QueryClient | undefined;
const STALE_TIME = 1000 * 60 * 3;
const GC_TIME = 1000 * 60 * 20;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
      },
      mutations: { onError: (err) => toast.error(`${err.message}`) },
    },
  });

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  } else {
    if (!localQueryClient) localQueryClient = createQueryClient();
    return localQueryClient;
  }
};
