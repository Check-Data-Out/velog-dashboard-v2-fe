import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const STALE_TIME = 1000 * 60 * 3;
const GC_TIME = 1000 * 60 * 20;

let localQueryClient: QueryClient | undefined;

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

/**
 * 현재 상태에 맞는 Tanstack-Query Client 인스턴스 반환
 *
 * @returns QueryClient
 */

export const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient();
  if (!localQueryClient) localQueryClient = createQueryClient();
  return localQueryClient;
};
