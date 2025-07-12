import { parseNumber } from '../number.util';

describe('number.util', () => {
  describe('parseNumber', () => {
    it('정수에 천 단위 콤마를 추가해야 한다', () => {
      expect(parseNumber(1000)).toBe('1,000');
      expect(parseNumber(1234)).toBe('1,234');
      expect(parseNumber(12345)).toBe('12,345');
      expect(parseNumber(123456)).toBe('123,456');
      expect(parseNumber(1234567)).toBe('1,234,567');
    });

    it('천 단위 미만의 숫자는 콤마 없이 반환해야 한다', () => {
      expect(parseNumber(0)).toBe('0');
      expect(parseNumber(1)).toBe('1');
      expect(parseNumber(99)).toBe('99');
      expect(parseNumber(999)).toBe('999');
    });

    it('음수에도 콤마를 추가해야 한다', () => {
      expect(parseNumber(-1000)).toBe('-1,000');
      expect(parseNumber(-1234567)).toBe('-1,234,567');
    });

    it('undefined가 전달되면 "0"을 반환해야 한다', () => {
      expect(parseNumber(undefined)).toBe('0');
    });

    it('NaN과 Infinity를 처리해야 한다', () => {
      expect(parseNumber(NaN)).toBe('0');
      expect(parseNumber(Infinity)).toBe('0');
      expect(parseNumber(-Infinity)).toBe('0');
    });

    it('소수점이 포함된 숫자는 정수 부분만 처리해야 한다', () => {
      expect(parseNumber(1234.56)).toBe('1,234');
      expect(parseNumber(999.99)).toBe('999');
      expect(parseNumber(0.9)).toBe('0');
    });

    it('경계값들을 정확히 처리해야 한다', () => {
      expect(parseNumber(999)).toBe('999');
      expect(parseNumber(1000)).toBe('1,000');
      expect(parseNumber(9999)).toBe('9,999');
      expect(parseNumber(10000)).toBe('10,000');
    });

    it('매우 큰 숫자도 올바르게 처리해야 한다', () => {
      expect(parseNumber(1234567890)).toBe('1,234,567,890');
    });
  });
});
