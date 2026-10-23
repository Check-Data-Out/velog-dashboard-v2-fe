import { summarizeUserAgent } from '../userAgent.util';

const UA = {
  IOS_SAFARI:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  ANDROID_CHROME:
    'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  DESKTOP_CHROME:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
};

describe('userAgent.util', () => {
  describe('summarizeUserAgent', () => {
    it('iOS Safari는 "Safari · iOS"로 요약해야 한다', () => {
      expect(summarizeUserAgent(UA.IOS_SAFARI)).toBe('Safari · iOS');
    });

    it('Android Chrome은 "Chrome · Android"로 요약해야 한다', () => {
      expect(summarizeUserAgent(UA.ANDROID_CHROME)).toBe('Chrome · Android');
    });

    it('데스크톱 Chrome은 "Chrome · Windows"로 요약해야 한다', () => {
      expect(summarizeUserAgent(UA.DESKTOP_CHROME)).toBe('Chrome · Windows');
    });

    it.each([
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
    ])('Chrome 계열이나 다른 브라우저도 구분해야 한다 (%#)', (ua, expected) => {
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
