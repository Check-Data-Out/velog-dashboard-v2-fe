import { captureException, withScope } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { AuthRequiredError, FetchError, FetchResponseError } from '@/lib/errors/fetch.error';

/**
 * Sentry 에 보고할 오류인지 판정
 * - 요청 유틸이 분류하지 않은 오류(네트워크 단절 등)는 보고
 * - 분류된 오류는 로그인 필요를 제외하고 각 오류의 shouldCaptureException 을 따름
 *
 * @returns boolean
 */
export const shouldCaptureError = (error: unknown) => {
  if (!(error instanceof FetchResponseError || error instanceof FetchError)) return true;
  return !(error instanceof AuthRequiredError) && error.shouldCaptureException;
};

/**
 * QueryClient에서 에러 핸들링에 사용, true/false 값 반환
 *
 * @returns boolean
 */
export const errorHandler = (error: unknown) => {
  if (error instanceof FetchResponseError || error instanceof FetchError) {
    if (error instanceof AuthRequiredError) return false;
    if (shouldCaptureError(error)) {
      withScope((scope) => {
        if (error instanceof FetchResponseError) {
          scope.setContext('API Data', error.options);
        }
        scope.setContext('Handler Data', { name: error.name, cause: error.cause });
        captureException(error);
      });
    }
    queueMicrotask(
      () =>
        typeof window !== 'undefined' &&
        toast.error(error.getToastMessage(), { toastId: error.name }),
    );
    return false;
  }
  return true;
};
