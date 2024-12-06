
import returnFetch, { FetchArgs } from 'return-fetch';
import { ServerNotRespondingError } from '@/errors';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const ABORT_MS = 1000 * 5;

if (!BASE_URL) {
  throw new Error('BASE_URL가 ENV에서 설정되지 않았습니다.');
}

type ErrorObject = Record<string, Error>;

const abortPolyfill = (ms: number) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new DOMException('TimeoutError')), ms);
  return controller.signal;
};

const fetch = returnFetch({

  baseUrl: BASE_URL,
  headers: { Accept: 'application/json' },
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

export const instance = async (
  input: URL | RequestInfo,
  init?: Omit<NonNullable<FetchArgs[1]>, 'body'> & { body: object },
  error?: ErrorObject,
) => {
  try {
    const data = await fetch(input, {
      ...init,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout
        ? AbortSignal.timeout(ABORT_MS)
        : abortPolyfill(ABORT_MS),
    });

    return data as Awaited<ReturnType<typeof fetch>>;
  } catch (err: any) {
    if ((err as Error).name === 'TimeoutError')
      throw new ServerNotRespondingError();
    else {
      if (!error || !(error && error[`${(err as Response).status}`]))
        throw new Error(`알 수 없는 오류가 발생했습니다 ${err.name}`);
      throw error[`${(err as Response).status}`];
    }
  }
};