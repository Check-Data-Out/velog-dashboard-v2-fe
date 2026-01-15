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
        scope.setContext('Handler Data', { name: error.name, cause: error.cause });
        if (error instanceof FetchResponseError) {
          scope.setContext('API Data', error.options);
        }
        captureException(error);
      });
    }
    queueMicrotask(() => toast.error(error.getToastMessage(), { toastId: Date.now() }));
    return false;
  } else {
    return true;
  }
};
