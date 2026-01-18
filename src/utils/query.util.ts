import { QueryClient } from '@tanstack/react-query';
import { errorHandler } from './error.util';

const STALE_TIME = 1000 * 60 * 3;
const GC_TIME = 1000 * 60 * 20;

let localQueryClient: QueryClient | undefined;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        throwOnError: errorHandler,
      },
      mutations: {
        retry: false,
        throwOnError: errorHandler,
      },
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
