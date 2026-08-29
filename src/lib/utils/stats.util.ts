import { TotalStatsDto } from '@/lib/types/dashboard.type';

/**
 * 날짜 오름차순 통계 시계열에서 어제(오늘 바로 앞 날짜)의 값을 반환함.
 * 배열 끝이 항상 오늘이므로 뒤에서 세어야 조회 기간이 바뀌어도 어제를 가리킴.
 *
 * @param {TotalStatsDto} stats - 날짜 오름차순으로 정렬된 통계 배열
 * @returns {number | undefined} 어제 값. 비교할 이전 날짜가 없으면 undefined
 */
export const getYesterdayValue = (stats: TotalStatsDto): number | undefined =>
  stats[stats.length - 2]?.value;
