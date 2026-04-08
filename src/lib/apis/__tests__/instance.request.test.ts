import {
  ExceededRateLimitError,
  FetchResponseError,
  TimeoutError,
  UnknownError,
} from '@/lib/errors/fetch.error';
import { instance } from '../instance.request';

// return-fetch는 내부적으로 전역 fetch를 호출하므로 모킹으로 제어한다
const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({ toString: () => 'session=abc' })),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

/** 성공 응답 헬퍼 */
function makeResponse<T>(data: T, status = 200): Response {
  const body = JSON.stringify({ success: true, message: 'ok', data, error: null });
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** 실패 응답 헬퍼 */
function makeErrorResponse(status: number, body?: object): Response {
  const json = JSON.stringify(
    body ?? {
      success: false,
      message: '오류',
      data: null,
      error: { code: 'ERR', statusCode: status },
    },
  );
  return new Response(json, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('instance', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('성공 케이스', () => {
    it('data 필드를 꺼내 반환한다', async () => {
      const payload = { id: 1, name: 'test' };
      mockFetch.mockResolvedValueOnce(makeResponse(payload));

      const result = await instance('/posts');

      expect(result).toEqual(payload);
    });

    it('/api 접두사를 붙여 fetch를 호출한다', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/posts');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts'),
        expect.any(Object),
      );
    });

    it('init 옵션(method, body)이 그대로 전달된다', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/login', { method: 'POST', body: { token: 'abc' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: 'abc' }),
        }),
      );
    });

    it('credentials: include 가 항상 포함된다', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/me');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ credentials: 'include' }),
      );
    });

    it('cache: no-store 가 항상 포함된다', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/me');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ cache: 'no-store' }),
      );
    });

    it('body가 없을 때 undefined로 전달된다', async () => {
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/me');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: undefined }),
      );
    });
  });

  describe('타임아웃', () => {
    it('AbortSignal.timeout 이 지원되면 사용한다', async () => {
      const fakeSignal = new AbortController().signal;
      // jsdom 환경에 AbortSignal.timeout이 없으므로 직접 정의해 spyOn
      AbortSignal.timeout = jest.fn().mockReturnValue(fakeSignal);
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/posts');

      expect(AbortSignal.timeout).toHaveBeenCalledWith(30000);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: fakeSignal }),
      );

      // 다른 테스트에 영향을 주지 않도록 제거
      // @ts-expect-error 테스트용으로 주입한 속성 제거
      delete AbortSignal.timeout;
    });

    it('AbortSignal.timeout 이 없으면 폴리필 signal 을 사용한다', async () => {
      // @ts-expect-error AbortSignal.timeout 제거로 폴리필 분기 유도
      delete AbortSignal.timeout;
      mockFetch.mockResolvedValueOnce(makeResponse({}));

      await instance('/posts');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    it('fetch가 TimeoutError name의 에러를 throw하면 TimeoutError로 변환해 throw한다', async () => {
      const timeoutErr = Object.assign(new Error('Timeout'), { name: 'TimeoutError' });
      mockFetch.mockRejectedValueOnce(timeoutErr);

      await expect(instance('/posts')).rejects.toBeInstanceOf(TimeoutError);
    });
  });

  describe('HTTP 에러 처리', () => {
    it('429 응답은 ExceededRateLimitError를 throw한다', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(429));

      await expect(instance('/posts')).rejects.toBeInstanceOf(ExceededRateLimitError);
    });

    it('500 응답은 UnknownError를 throw한다', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500));

      await expect(instance('/posts')).rejects.toBeInstanceOf(UnknownError);
    });

    it('503 응답은 UnknownError를 throw한다', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(503));

      await expect(instance('/posts')).rejects.toBeInstanceOf(UnknownError);
    });

    it('errorTypes에 등록된 status 코드는 해당 에러 클래스로 throw한다', async () => {
      class CustomError extends FetchResponseError {
        constructor(options: { url: string; method: string }) {
          super({ message: '커스텀 에러', options, code: 409 });
        }
      }
      mockFetch.mockResolvedValueOnce(makeErrorResponse(409));

      await expect(instance('/stats', undefined, { 409: CustomError })).rejects.toBeInstanceOf(
        CustomError,
      );
    });

    it('UnknownError에 실제 status 코드가 담긴다', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(502));

      await expect(instance('/posts')).rejects.toMatchObject({ code: 502 });
    });

    it('응답 body가 JSON이 아닐 때 SyntaxError가 전파된다', async () => {
      // return-fetch 인터셉터가 JSON.parse를 먼저 실행하므로
      // 잘못된 JSON 바디가 있는 에러 응답은 SyntaxError로 전파된다
      const badResponse = new Response('not-json', { status: 500 });
      mockFetch.mockResolvedValueOnce(badResponse);

      await expect(instance('/posts')).rejects.toBeInstanceOf(SyntaxError);
    });
  });

  describe('네트워크 수준 에러', () => {
    it('Response 인스턴스가 아닌 에러는 그대로 throw한다', async () => {
      const networkErr = new TypeError('Failed to fetch');
      mockFetch.mockRejectedValueOnce(networkErr);

      await expect(instance('/posts')).rejects.toBeInstanceOf(TypeError);
    });
  });

  describe('401 클라이언트 처리', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // location.replace를 스파이할 수 있도록 재정의
      Object.defineProperty(window, 'location', {
        value: { replace: jest.fn() },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    });

    it('브라우저 환경에서 401 응답 시 location.replace("/")를 호출해야 한다', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(401));

      // 클라이언트에서 401은 undefined를 반환(throw하지 않음)하므로 await으로 처리
      await instance('/posts');

      expect(window.location.replace).toHaveBeenCalledWith('/');
    });

    it('브라우저 환경에서 401 응답 시 undefined를 반환해야 한다', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(401));

      const result = await instance('/posts');

      expect(result).toBeUndefined();
    });
  });
});
