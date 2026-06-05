/**
 * @jest-environment node
 *
 * SSR(서버) 환경 전용 테스트.
 * jsdom에서는 `typeof window`가 항상 'object'로 평가되므로
 * node 환경에서 별도 파일로 분리해 SSR 분기를 검증한다.
 */

// env.constant.ts는 node 환경에서 ENV 검증을 실행하므로 모킹으로 우회한다
jest.mock('../../constants/env.constant', () => ({
  ENVS: { BASE_URL: 'http://localhost:3000', NODE_ENV: 'test' },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockCookies = jest.fn(() => ({ toString: () => 'session=abc' }));

jest.mock('next/headers', () => ({
  cookies: mockCookies,
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

function makeResponse<T>(data: T, status = 200): Response {
  const body = JSON.stringify({ success: true, message: 'ok', data, error: null });
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('instance (SSR 환경)', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockCookies.mockClear();
  });

  it('서버 환경에서 next/headers cookies를 읽어 Cookie 헤더를 주입한다', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({}));

    const { instance } = await import('../instance.request');
    await instance('/posts');

    expect(mockCookies).toHaveBeenCalled();

    // return-fetch는 헤더를 Headers 인스턴스로 병합하므로 .get()으로 검증한다
    const calledHeaders: Headers | Record<string, string> = mockFetch.mock.calls[0][1].headers;
    const cookieValue =
      calledHeaders instanceof Headers
        ? (calledHeaders.get('Cookie') ?? calledHeaders.get('cookie'))
        : (calledHeaders?.Cookie ?? calledHeaders?.cookie);
    expect(cookieValue).toBe('session=abc');
  });

  it('쿠키가 비어 있으면 Cookie 헤더를 추가하지 않는다', async () => {
    mockCookies.mockReturnValueOnce({ toString: () => '' });
    mockFetch.mockResolvedValueOnce(makeResponse({}));

    const { instance } = await import('../instance.request');
    await instance('/posts');

    const calledHeaders: Headers | Record<string, string> = mockFetch.mock.calls[0][1].headers;
    const cookieValue =
      calledHeaders instanceof Headers
        ? (calledHeaders.get('Cookie') ?? calledHeaders.get('cookie'))
        : (calledHeaders?.Cookie ?? calledHeaders?.cookie);
    expect(cookieValue).toBeNull();
  });
});
