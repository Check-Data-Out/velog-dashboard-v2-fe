import returnFetch, { FetchArgs } from 'return-fetch';
import * as sentry from '@sentry/nextjs';
import router from 'next/navigation';
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
  error?: ErrorObject,
): Promise<R> => {
  try {
    const data = await fetch('/api' + input, {
      ...init,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout
        ? AbortSignal.timeout(ABORT_MS)
        : abortPolyfill(ABORT_MS),
      credentials: 'include',
    });

    return (data.body as unknown as SuccessType<R>).data;
  } catch (err: any) {
    const context = err as Response;
    if (
      location &&
      !context.ok &&
      (context.status === 401 || context.status === 403)
    ) {
      location.replace('/');
    }

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
