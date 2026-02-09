import { captureException, withScope } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { FetchError, FetchResponseError } from '@/errors';

/**
 * QueryClient에서 에러 핸들링에 사용, true/false 값 반환
 *
 * @returns boolean
 */
export const errorHandler = (error: unknown) => {
  if (error instanceof FetchResponseError || error instanceof FetchError) {
    if (error.shouldCaptureException) {
      withScope((scope) => {
        if (error instanceof FetchResponseError) {
          scope.setContext('API Data', error.options);
        }
        scope.setContext('Handler Data', { name: error.name, cause: error.cause });
        captureException(error);
      });
    }
    queueMicrotask(() => typeof window !== 'undefined' && toast.error(error.getToastMessage()));
    return false;
  }
  return true;
};
