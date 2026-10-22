/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const createRequest = (cookie?: string, path = '/main') =>
  new NextRequest(`http://localhost${path}`, cookie ? { headers: { cookie } } : undefined);

describe('middleware', () => {
  it.each(['/main', '/leaderboards'])('세션 쿠키만 있어도 %s 진입을 허용한다', (path) => {
    const response = middleware(createRequest('vd_session=session-id', path));

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('기존 velog 토큰 쿠키만 있으면 첫 화면으로 보낸다', () => {
    const response = middleware(createRequest('access_token=legacy-token'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/');
  });

  it('쿠키가 없으면 첫 화면으로 보낸다', () => {
    const response = middleware(createRequest());

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/');
  });
});
