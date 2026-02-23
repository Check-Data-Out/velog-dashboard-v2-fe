import returnFetch, { FetchArgs } from 'return-fetch';
import { ENVS } from '@/constants';
import {
  AuthRequiredError,
  ExceededRateLimitError,
  fetchOptions,
  FetchResponseError,
  TimeoutError,
  UnknownError,
} from '@/errors';

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
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  interceptors: {
    response: async (response) => {
      const body = JSON.parse(await response?.clone().text());
      if (!response.ok) {
        throw response;
      }
      return { ...response, body };
    },
  },
});

export const instance = async <I, R>(
  input: URL | RequestInfo,
  init?: InitType<I>,
  errorTypes?: Record<number, new (options: fetchOptions) => FetchResponseError>,
): Promise<R> => {
  let cookieHeader = '';
  if (typeof window === 'undefined') {
    cookieHeader = (await import('next/headers')).cookies().toString();
  }

  try {
    const data = await fetch('/api' + input, {
      ...init,
      headers: cookieHeader ? { ...init?.headers, Cookie: cookieHeader } : init?.headers,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout?.(Number(ABORT_MS)) ?? abortPolyfill(Number(ABORT_MS)),
      credentials: 'include',
      cache: 'no-store',
    });

    return (data.body as unknown as SuccessType<R>).data;
  } catch (err: unknown) {
    const errAsError = err instanceof Error ? err : new Error(String(err));

    if (!(err instanceof Response)) {
      const response = errAsError.name === 'TimeoutError' ? new TimeoutError() : errAsError;
      throw response;
    }

    let body;
    try {
      body = await err.json();
    } catch {
      body = {
        success: false,
        message: 'JSON 파싱에 실패했습니다',
        data: null,
        error: { code: 'FailedJsonParsing', statusCode: 500 },
      };
    }

    const data = {
      url: '/api' + input,
      method: init?.method || 'UNKNOWN',
      body,
    };

    const customError = errorTypes?.[err.status] || null;
    let response: unknown = undefined;

    if (err.status === 401) {
      window.dispatchEvent(new CustomEvent('unauthorized'));
      throw new AuthRequiredError(data);
    } else if (err?.status === 429) {
      response = new ExceededRateLimitError(data);
    } else if (customError) {
      response = new customError(data);
    } else {
      response = new UnknownError(data, err.status);
    }
    throw response;
  }
};
