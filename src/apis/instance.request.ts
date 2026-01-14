import { captureException, withScope } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import returnFetch, { FetchArgs } from 'return-fetch';
import { ENVS } from '@/constants';
import { ExceededRateLimitError, ServerNotRespondingError } from '@/errors';
import { CustomError } from '@/errors/instance.error';

const ABORT_MS = 30000;

type ErrorType = {
  code: string;
  statusCode: number;
};

type SuccessType<T> = {
  success: true;
  message: string;
  data: T;
  error: null | ErrorType;
};

export type InitType<I> = Omit<NonNullable<FetchArgs[1]>, 'body'> & {
  body?: I | object;
};

const abortPolyfill = (ms: number) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};

const fetch = returnFetch({
  baseUrl: ENVS.BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  interceptors: {
    response: async (response) => {
      if (!response.ok) {
        throw response;
      }
      return {
        ...response,
        body: response?.text ? JSON.parse(await response?.text()) : {},
      };
    },
  },
});

export const instance = async <I, R>(
  input: URL | RequestInfo,
  init?: InitType<I>,
  errorTypes?: Record<number, CustomError>,
): Promise<R> => {
  let cookieHeader = '';
  if (typeof window === 'undefined') {
    cookieHeader = (await import('next/headers')).cookies().toString();
  }

  try {
    const data = await fetch('/api' + input, {
      ...init,
      headers: cookieHeader
        ? {
            ...init?.headers,
            Cookie: cookieHeader,
          }
        : init?.headers,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout
        ? AbortSignal.timeout(Number(ABORT_MS))
        : abortPolyfill(Number(ABORT_MS)),
      credentials: 'include',
      cache: 'no-store',
    });

    return (data.body as unknown as SuccessType<R>).data;
  } catch (err: unknown) {
    const errAsResponse = err as Response;
    const errAsError = err as Error;
    const customError = errorTypes?.[errAsResponse.status];
    let response: unknown = undefined;

    const errResponse = await errAsResponse.json();

    if (!errAsResponse.ok) {
      if (errAsResponse.status === 401) {
        if (typeof window !== 'undefined') window.location.replace('/');
        return {} as never;
      } else if (errAsResponse?.status === 429 && errResponse?.retryLater) {
        throw new ExceededRateLimitError();
      }
    }

    toast.error(`${errResponse?.message} (${errResponse?.status || -1})`);

    withScope((scope) => {
      scope.setContext('Request', {
        url: '/api' + input,
        method: init?.method,
        body: init?.body,
      });
      scope.setContext('Detailed Information', {
        name: errAsError.name,
        cause: errAsError.cause,
        status: errAsResponse.status,
      });

      if (errAsError.name === 'TimeoutError') {
        // Timeout 오류는 별도의 status값이 없는 것으로 보여 이런 형태로 처리합니다
        response = new ServerNotRespondingError();
      } else if (customError?.shouldCaptureException) {
        response = customError;
      } else {
        response = new Error(
          `서버에서 예기치 않은 오류가 발생했습니다: ${errAsError.name} (${errResponse?.status})`,
        );
      }

      if (customError?.shouldCaptureException) {
        captureException(response);
      }
    });
    throw response;
  }
};
