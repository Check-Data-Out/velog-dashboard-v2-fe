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
      if (!response.ok) throw response;
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

    const data = {
      url: '/api' + input,
      method: init?.method || 'UNKNOWN',
      body: await err.json(),
    };

    const customError = errorTypes?.[err.status] || null;
    let response: unknown = undefined;

    if (err.status === 401) {
      response = new AuthRequiredError(data);
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
