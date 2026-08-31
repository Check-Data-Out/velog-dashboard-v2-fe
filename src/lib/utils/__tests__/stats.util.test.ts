import { getYesterdayValue } from '../stats.util';

describe('stats.util', () => {
  describe('getYesterdayValue', () => {
    it('오름차순 시계열에서 오늘 바로 앞 날짜의 값을 반환해야 한다', () => {
      const stats = [
        { date: '2026-08-20T15:00:00.000Z', value: 10 },
        { date: '2026-08-24T15:00:00.000Z', value: 14 },
        { date: '2026-08-25T15:00:00.000Z', value: 15 },
      ];

      expect(getYesterdayValue(stats)).toBe(14);
    });

    it('기간이 바뀌어 배열 길이가 달라져도 같은 값을 반환해야 한다', () => {
      const yesterday = { date: '2026-08-24T15:00:00.000Z', value: 14 };
      const today = { date: '2026-08-25T15:00:00.000Z', value: 15 };
      const older = [
        { date: '2026-08-18T15:00:00.000Z', value: 8 },
        { date: '2026-08-19T15:00:00.000Z', value: 9 },
      ];

      expect(getYesterdayValue([...older, yesterday, today])).toBe(14);
      expect(getYesterdayValue([older[1], yesterday, today])).toBe(14);
    });

    it('비교할 이전 날짜가 없으면 undefined를 반환해야 한다', () => {
      expect(getYesterdayValue([])).toBeUndefined();
      expect(getYesterdayValue([{ date: '2026-08-25T15:00:00.000Z', value: 15 }])).toBeUndefined();
    });
  });
});
