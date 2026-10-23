import { summarizeUserAgent } from '../userAgent.util';

describe('userAgent.util', () => {
  describe('summarizeUserAgent', () => {
    it.each([
      [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
        'Safari · iOS',
      ],
      [
        'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
        'Chrome · Android',
      ],
      [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Chrome · Windows',
      ],
      [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
        'Edge · Windows',
      ],
      [
        'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
        'Samsung Internet · Android',
      ],
      [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:127.0) Gecko/20100101 Firefox/127.0',
        'Firefox · macOS',
      ],
    ])('브라우저와 OS 로 요약해야 한다 (%#)', (ua, expected) => {
      expect(summarizeUserAgent(ua)).toBe(expected);
    });

    it('알아볼 수 없는 값이면 "알 수 없는 기기"를 돌려줘야 한다', () => {
      expect(summarizeUserAgent('curl/8.4.0')).toBe('알 수 없는 기기');
      expect(summarizeUserAgent('')).toBe('알 수 없는 기기');
      expect(summarizeUserAgent(null)).toBe('알 수 없는 기기');
      expect(summarizeUserAgent(undefined)).toBe('알 수 없는 기기');
    });
  });
});
