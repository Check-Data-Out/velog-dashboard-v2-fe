import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

let localQueryClient: QueryClient | undefined;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 10 * 5,
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
