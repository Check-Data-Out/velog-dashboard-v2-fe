import returnFetch, { FetchArgs } from 'return-fetch';

import { captureException, setContext } from '@sentry/nextjs';
import { EnvNotFoundError, ServerNotRespondingError } from '@/errors';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const ABORT_MS = Number(process.env.NEXT_PUBLIC_ABORT_MS);

if (Number.isNaN(ABORT_MS)) {
  throw new EnvNotFoundError('ABORT_MS');
}

if (!BASE_URL) {
  throw new EnvNotFoundError('BASE_URL');
}

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
  baseUrl: BASE_URL,
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
  error?: Record<string, Error>,
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
        ? AbortSignal.timeout(ABORT_MS)
        : abortPolyfill(ABORT_MS),
      credentials: 'include',
      cache: 'no-store',
    });

    return (data.body as unknown as SuccessType<R>).data;
  } catch (err: unknown) {
    const context = err as Response;
    if (location && !context.ok && context.status === 403) {
      window.location.replace('/');
    }
    //context.status === 401 ||
    setContext('Request', {
      path: context.url,
      status: context.status,
    });
    if ((err as Error).name === 'TimeoutError') {
      captureException(new ServerNotRespondingError());
      throw new ServerNotRespondingError();
    } else {
      if (!error?.[`${(err as Response).status}`]) {
        const serverError = new Error(
          `서버에서 예기치 않은 오류가 발생했습니다. (${(err as Error).name})`,
        );
        captureException(serverError);
        throw serverError;
      }

      captureException(error[`${(err as Response).status}`]);
      throw error[`${(err as Response).status}`];
    }
  }
};
