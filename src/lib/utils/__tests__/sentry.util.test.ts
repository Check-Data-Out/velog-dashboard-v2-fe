import { dropLocalEvent } from '../sentry.util';

describe('sentry.util', () => {
  describe('dropLocalEvent', () => {
    it.each([
      'http://localhost:3000/main',
      'http://127.0.0.1:3200/badge',
      'http://[::1]:3000/',
      'http://localhost:3000?e2e=1',
      'http://0.0.0.0:3000/main',
      'http://app.localhost:3000/',
    ])('로컬 주소(%s) 이벤트는 버린다', (url) => {
      expect(dropLocalEvent({ request: { url } })).toBeNull();
    });

    it.each(['https://velog-dashboard.kro.kr/main', 'https://localhost.example.com/', 'not a url'])(
      '로컬이 아니거나 판별할 수 없는 주소(%s) 이벤트는 그대로 보낸다',
      (url) => {
        const event = { request: { url } };
        expect(dropLocalEvent(event)).toBe(event);
      },
    );

    it('요청 정보가 없는 이벤트는 그대로 보낸다', () => {
      const event = {};
      expect(dropLocalEvent(event)).toBe(event);
    });
  });
});
