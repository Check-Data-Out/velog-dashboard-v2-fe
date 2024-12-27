import returnFetch, { FetchArgs } from 'return-fetch';
import * as sentry from '@sentry/nextjs';
import { ServerNotRespondingError } from '@/errors';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const ABORT_MS = Number(process.env.NEXT_PUBLIC_ABORT_MS);

if (Number.isNaN(ABORT_MS)) {
  throw new Error('ABORT_MS가 ENV에서 설정되지 않았습니다');
}

if (!BASE_URL) {
  throw new Error('BASE_URL이 ENV에서 설정되지 않았습니다.');
}

type ErrorObject = Record<string, Error>;

type SuccessType<T> = {
  success: true;
  message: string;
  data: T;
  error: null;
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
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzc1MDcyNDAtMDkzYi0xMWVhLTlhYWUtYTU4YTg2YmIwNTIwIiwiaWF0IjoxNzM1MDM4MTQ5LCJleHAiOjE3MzUxMjQ1NDksImlzcyI6InZlbG9nLmlvIiwic3ViIjoiYWNjZXNzX3Rva2VuIn0.ycWoz-tJC21GlWoNpmle2lE68cplIyBYtMd7lN7sGrY',
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzc1MDcyNDAtMDkzYi0xMWVhLTlhYWUtYTU4YTg2YmIwNTIwIiwidG9rZW5fSWQiOiI4ZmJlNGQ1ZC0zZjk1LTQ3MzUtYjgyNC1lOTZiMGFkNDFhMDQiLCJpYXQiOjE3MzQ5MzkzMDUsImV4cCI6MTczNzUzMTMwNSwiaXNzIjoidmVsb2cuaW8iLCJzdWIiOiJyZWZyZXNoX3Rva2VuIn0.Vfxgz0agilzDIWnYDYryXPz4bj_CLH1UAVUtTPdgey4',
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
  init?: Omit<NonNullable<FetchArgs[1]>, 'body'> & { body: I | object },
  error?: ErrorObject,
): Promise<R> => {
  try {
    const data = await fetch('/api' + input, {
      ...init,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout
        ? AbortSignal.timeout(ABORT_MS)
        : abortPolyfill(ABORT_MS),
    });

    return (data.body as unknown as SuccessType<R>).data;
  } catch (err: any) {
    const context = err as Response;
    sentry.setContext('Request', {
      path: context.url,
      status: context.status,
    });
    if ((err as Error).name === 'TimeoutError') {
      sentry.captureException(new ServerNotRespondingError());
      throw new ServerNotRespondingError();
    } else {
      if (!error?.[`${(err as Response).status}`]) {
        const serverError = new Error(
          `서버에서 예기치 않은 오류가 발생했습니다. (${err.name})`,
        );
        sentry.captureException(serverError);
        throw serverError;
      }

      sentry.captureException(error[`${(err as Response).status}`]);
      throw error[`${(err as Response).status}`];
    }
  }
};
