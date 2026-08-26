import {
  convertDateToKST,
  formatTimeToMMSS,
  getDateRangeForMode,
  getKSTDateString,
  KSTDateFormat,
  shiftKSTDate,
} from '../datetime.util';

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

  describe('getKSTDateString', () => {
    it('UTC 날짜가 아닌 KST 날짜를 반환해야 한다', () => {
      // UTC 8/24 16:00 = KST 8/25 01:00
      expect(getKSTDateString(new Date('2026-08-24T16:00:00.000Z'))).toBe('2026-08-25');
    });

    it('KST 자정 직전에는 아직 전날을 반환해야 한다', () => {
      // UTC 8/24 14:59:59 = KST 8/24 23:59:59
      expect(getKSTDateString(new Date('2026-08-24T14:59:59.000Z'))).toBe('2026-08-24');
    });
  });

  describe('shiftKSTDate', () => {
    it('윤년의 2월 29일을 처리해야 한다', () => {
      expect(shiftKSTDate('2028-03-01', -1)).toBe('2028-02-29');
    });

    it('연도 경계를 넘어야 한다', () => {
      expect(shiftKSTDate('2026-01-01', -1)).toBe('2025-12-31');
    });
  });

  describe('getDateRangeForMode', () => {
    afterEach(() => jest.useRealTimers());

    it('기준 시각을 생략하면 현재 시각을 사용해야 한다', () => {
      // UTC 8/24 18:00 = KST 8/25 03:00
      jest.useFakeTimers({ now: new Date('2026-08-24T18:00:00.000Z') });

      expect(getDateRangeForMode('weekly')).toEqual({
        start: '2026-08-19',
        end: '2026-08-25',
      });
    });

    it('지난 7일은 오늘을 포함해 총 7일이어야 한다', () => {
      const base = new Date('2026-08-25T12:00:00.000Z');

      expect(getDateRangeForMode('weekly', { base })).toEqual({
        start: '2026-08-19',
        end: '2026-08-25',
      });
    });

    it('KST 오전 9시 이전에도 오늘까지의 기간을 반환해야 한다', () => {
      // UTC 8/24 18:00 = KST 8/25 03:00
      const base = new Date('2026-08-24T18:00:00.000Z');

      expect(getDateRangeForMode('weekly', { base })).toEqual({
        start: '2026-08-19',
        end: '2026-08-25',
      });
    });

    it('지난 30일은 달력상 한 달이 아니라 정확히 30일이어야 한다', () => {
      const base = new Date('2026-03-31T12:00:00.000Z');

      expect(getDateRangeForMode('monthly', { base })).toEqual({
        start: '2026-03-02',
        end: '2026-03-31',
      });
    });

    it('미선택과 직접선택은 빈 기간을 반환해야 한다', () => {
      const base = new Date('2026-08-25T12:00:00.000Z');

      expect(getDateRangeForMode('none', { base })).toEqual({ start: '', end: '' });
      expect(getDateRangeForMode('custom', { base })).toEqual({ start: '', end: '' });
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
