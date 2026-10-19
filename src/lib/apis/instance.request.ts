import returnFetch, { FetchArgs } from 'return-fetch';
import { ENVS } from '@/lib/constants/env.constant';
import {
  AuthRequiredError,
  ExceededRateLimitError,
  fetchOptions,
  FetchResponseError,
  TimeoutError,
  UnknownError,
} from '@/lib/errors/fetch.error';

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
  // 서버 컴포넌트에서 부를 때는 사용자 쿠키와 클라이언트 IP 를 실어 보낸다.
  // IP 를 넘기지 않으면 API 가 모든 SSR 요청을 FE 서버 IP 하나로 보고 인증 실패를 합산한다
  const requestHeaders = new Headers(init?.headers);
  if (typeof window === 'undefined') {
    const { cookies, headers } = await import('next/headers');
    const cookieHeader = cookies().toString();
    const forwardedFor = headers().get('x-forwarded-for');
    if (cookieHeader) requestHeaders.set('Cookie', cookieHeader);
    if (forwardedFor) requestHeaders.set('X-Forwarded-For', forwardedFor);
  }

  try {
    const data = await fetch('/api' + input, {
      ...init,
      headers: requestHeaders,
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
      if (typeof window === 'undefined') {
        const { redirect } = await import('next/navigation');
        redirect('/');
      }
      location.replace('/');
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
