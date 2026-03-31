import { convertDateToKST, formatTimeToMMSS, KSTDateFormat } from '../datetime.util';

describe('datetime.util', () => {
  describe('convertDateToKST', () => {
    it('UTC 날짜를 KST로 정확히 변환해야 한다', () => {
      const utcDate = '2025-01-01T00:00:00.000Z';
      const result = convertDateToKST(utcDate);

      expect(result).toBeDefined();
      expect(result?.short).toBe('2025-01-01');
      expect(result?.iso).toBe('2025-01-01T09:00:00+09:00');
      expect(result?.full).toBeInstanceOf(Date);
    });

    it('다른 시간대의 UTC 날짜도 정확히 변환해야 한다', () => {
      const utcDate = '2024-12-31T15:30:45.123Z';
      const result = convertDateToKST(utcDate);

      expect(result).toBeDefined();
      expect(result?.short).toBe('2025-01-01');
      expect(result?.iso).toBe('2025-01-01T00:30:45+09:00');
    });

    it('undefined 또는 빈 문자열이 전달되면 undefined를 반환해야 한다', () => {
      expect(convertDateToKST(undefined)).toBeUndefined();
      expect(convertDateToKST('')).toBeUndefined();
    });

    it('잘못된 날짜 형식이 전달되면 Invalid Date를 처리해야 한다', () => {
      const invalidDate = 'invalid-date';
      const result = convertDateToKST(invalidDate);

      expect(result).toBeDefined();
      expect(result?.full.toString()).toBe('Invalid Date');
    });

    it('날짜 경계값을 올바르게 처리해야 한다', () => {
      const utcDate = '2024-12-31T23:59:59.000Z';
      const result = convertDateToKST(utcDate);

      expect(result).toBeDefined();
      expect(result?.short).toBe('2025-01-01');
      expect(result?.iso).toBe('2025-01-01T08:59:59+09:00');
    });

    it('반환된 객체가 올바른 구조를 가져야 한다', () => {
      const utcDate = '2025-01-01T00:00:00.000Z';
      const result = convertDateToKST(utcDate) as KSTDateFormat;

      expect(result).toHaveProperty('short');
      expect(result).toHaveProperty('iso');
      expect(result).toHaveProperty('full');
      expect(typeof result.short).toBe('string');
      expect(typeof result.iso).toBe('string');
      expect(result.full).toBeInstanceOf(Date);
    });
  });

  describe('formatTimeToMMSS', () => {
    it('정확한 분과 초로 변환해야 한다', () => {
      expect(formatTimeToMMSS(0)).toBe('00분 00초');
      expect(formatTimeToMMSS(59)).toBe('00분 59초');
      expect(formatTimeToMMSS(60)).toBe('01분 00초');
      expect(formatTimeToMMSS(61)).toBe('01분 01초');
      expect(formatTimeToMMSS(120)).toBe('02분 00초');
      expect(formatTimeToMMSS(125)).toBe('02분 05초');
    });

    it('큰 숫자도 올바르게 변환해야 한다', () => {
      expect(formatTimeToMMSS(3600)).toBe('60분 00초');
      expect(formatTimeToMMSS(3661)).toBe('61분 01초');
    });

    it('소수점이 포함된 숫자를 처리해야 한다', () => {
      expect(formatTimeToMMSS(65.7)).toBe('01분 05초');
      expect(formatTimeToMMSS(59.9)).toBe('00분 59초');
    });

    it('경계값들을 정확히 처리해야 한다', () => {
      expect(formatTimeToMMSS(59)).toBe('00분 59초');
      expect(formatTimeToMMSS(60)).toBe('01분 00초');
      expect(formatTimeToMMSS(119)).toBe('01분 59초');
      expect(formatTimeToMMSS(120)).toBe('02분 00초');
    });

    it('한 자리 수는 0으로 패딩해야 한다', () => {
      expect(formatTimeToMMSS(5)).toBe('00분 05초');
      expect(formatTimeToMMSS(65)).toBe('01분 05초');
    });
  });
});
