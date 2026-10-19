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

const mockCookies = jest.fn((): { toString: () => string } => ({ toString: () => 'session=abc' }));

const mockHeaders = jest.fn(() => new Headers({ 'x-forwarded-for': '203.0.113.7' }));

jest.mock('next/headers', () => ({
  cookies: mockCookies,
  headers: mockHeaders,
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

  it('서버 환경에서는 원래 요청의 클라이언트 IP 를 X-Forwarded-For 로 전달한다', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({}));

    const { instance } = await import('../instance.request');
    await instance('/posts');

    const calledHeaders = new Headers(mockFetch.mock.calls[0][1].headers);
    expect(calledHeaders.get('X-Forwarded-For')).toBe('203.0.113.7');
  });

  it('호출자가 Headers 로 넘긴 헤더도 서버 헤더와 함께 유지한다', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({}));

    const { instance } = await import('../instance.request');
    await instance('/posts', { headers: new Headers({ 'X-Custom': 'kept' }) });

    const calledHeaders = new Headers(mockFetch.mock.calls[0][1].headers);
    expect(calledHeaders.get('X-Custom')).toBe('kept');
    expect(calledHeaders.get('Content-Type')).toBe('application/json');
    expect(calledHeaders.get('Cookie')).toBe('session=abc');
  });
});
