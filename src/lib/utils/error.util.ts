import { captureException, withScope } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { AuthRequiredError, FetchError, FetchResponseError } from '@/lib/errors/fetch.error';

/**
 * Sentry 에 보고할 오류인지 판정
 * - 오류가 없으면(null/undefined) 보고하지 않음
 * - 요청 유틸이 분류하지 않은 오류(네트워크 단절 등)는 보고
 * - 분류된 오류는 로그인 필요를 제외하고 각 오류의 shouldCaptureException 을 따름
 *
 * @returns boolean
 */
export const shouldCaptureError = (error: unknown) => {
  if (error == null) return false;
  if (!(error instanceof FetchResponseError || error instanceof FetchError)) return true;
  return !(error instanceof AuthRequiredError) && error.shouldCaptureException;
};

const SERVER_MESSAGE_MAX = 200;
const CAUSE_MAX = 500;

/**
 * 요청 컨텍스트(API Data, Handler Data)를 붙여 Sentry 에 보고
 * 응답 body 전체는 개인정보가 섞일 수 있어 보내지 않고, 식별에 필요한 최소 항목만 화이트리스트로 담는다
 *
 * @param error 보고할 오류
 * @param tags 이벤트에 붙일 태그 (예: 기능 구분)
 */
export const reportError = (error: unknown, tags?: Record<string, string>) => {
  withScope((scope) => {
    if (error instanceof FetchResponseError) {
      const { url, method, body } = error.options;
      const serverMessage = body?.message;
      scope.setContext('API Data', {
        url,
        method,
        status: error.code,
        ...(typeof serverMessage === 'string' && {
          message: serverMessage.slice(0, SERVER_MESSAGE_MAX),
        }),
      });
    }
    if (error instanceof Error) {
      scope.setContext('Handler Data', {
        name: error.name,
        ...(error.cause !== undefined && { cause: String(error.cause).slice(0, CAUSE_MAX) }),
      });
    }
    if (tags) scope.setTags(tags);
    captureException(error);
  });
};

/**
 * QueryClient에서 에러 핸들링에 사용, true/false 값 반환
 *
 * @returns boolean
 */
export const errorHandler = (error: unknown) => {
  if (error instanceof FetchResponseError || error instanceof FetchError) {
    if (error instanceof AuthRequiredError) return false;
    if (shouldCaptureError(error)) reportError(error);
    queueMicrotask(
      () =>
        typeof window !== 'undefined' &&
        toast.error(error.getToastMessage(), { toastId: error.name }),
    );
    return false;
  }
  return true;
};
