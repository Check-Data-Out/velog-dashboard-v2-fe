import { dropLocalEvent } from '../sentry.util';

describe('sentry.util', () => {
  describe('dropLocalEvent', () => {
    it.each(['http://localhost:3000/main', 'http://127.0.0.1:3200/badge', 'http://[::1]:3000/'])(
      '로컬 주소(%s) 이벤트는 버린다',
      (url) => {
        expect(dropLocalEvent({ request: { url } })).toBeNull();
      },
    );

    it('운영 주소나 요청 정보가 없는 이벤트는 그대로 보낸다', () => {
      const prod = { request: { url: 'https://velog-dashboard.kro.kr/main' } };
      expect(dropLocalEvent(prod)).toBe(prod);
      expect(dropLocalEvent({})).toEqual({});
    });
  });
});
