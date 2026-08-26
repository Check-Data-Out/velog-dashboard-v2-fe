// KST는 서머타임이 없어(1988년 폐지) UTC+9로 고정임. 이 전제가 깨지면 Intl.DateTimeFormat의 timeZone 방식으로 전환해야 함
const KST_DIFF = 9 * 60 * 60 * 1000;

/**
 * KST로 변환된 날짜 정보를 담는 인터페이스
 */
export interface KSTDateFormat {
  /** "YYYY-MM-DD" 형식의 날짜 문자열 */
  short: string;

  /** ISO 8601 형식 + KST 오프셋 포함 문자열 */
  iso: string;

  /** KST로 보정된 Date 객체 */
  full: Date;
}

/**
 * 주어진 날짜 문자열을 KST(한국 표준시) 기준으로 변환함.
 *
 * @param {string} [date] - 변환할 날짜 문자열 (예: "2025-05-15T08:00:00Z")
 * @returns {KSTDateFormat | undefined} 날짜가 없으면 undefined 반환
 */

export const convertDateToKST = (date?: string): KSTDateFormat | undefined => {
  if (!date) return;

  // UTC 날짜 파싱
  const utcDate = new Date(date);

  // UTC+9 (KST) 시간으로 변환
  const kstTimestamp = utcDate.getTime() + KST_DIFF;
  const kstDate = new Date(kstTimestamp);

  // UTC 메서드를 사용하여 KST 시간을 추출
  // (UTC 메서드에 KST 시간을 넣으면 원하는 결과를 얻을 수 있음)
  const year = kstDate.getUTCFullYear();
  const month = (kstDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = kstDate.getUTCDate().toString().padStart(2, '0');
  const hours = kstDate.getUTCHours().toString().padStart(2, '0');
  const minutes = kstDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = kstDate.getUTCSeconds().toString().padStart(2, '0');

  return {
    short: `${year}-${month}-${day}`,
    iso: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`,
    full: kstDate,
  };
};

/**
 * 그래프 기간 선택 모드
 */
export type GraphPeriodMode = 'none' | 'weekly' | 'monthly' | 'custom';

/** 지난 7일, 지난 30일에 포함되는 날짜 수 (오늘 포함) */
const PERIOD_DAYS = { weekly: 7, monthly: 30 } as const;

/**
 * 주어진 시각의 KST 날짜를 "YYYY-MM-DD" 형식으로 반환함.
 * toISOString()은 UTC 기준이라 KST 오전 9시 이전에 날짜가 하루 밀리므로 대신 사용함.
 *
 * @param {Date} [base] - 기준 시각 (기본값: 현재 시각)
 * @returns {string} "YYYY-MM-DD" 형식의 KST 날짜
 */
export const getKSTDateString = (base: Date = new Date()): string =>
  // toISOString()은 빈 문자열을 반환하지 않으므로 ?? 분기는 도달 불가. 반환 타입을 string으로 좁히기 위한 것임
  convertDateToKST(base.toISOString())?.short ?? '';

/**
 * "YYYY-MM-DD" 형식의 날짜를 일 단위로 이동시킴.
 * 달력 기준(setMonth)이 아니라 일수 기준이라 월말, 윤년, 연말 경계에서도 정확함.
 *
 * @param {string} date - "YYYY-MM-DD" 형식의 기준 날짜
 * @param {number} days - 이동할 일수 (음수면 과거)
 * @returns {string} "YYYY-MM-DD" 형식의 이동된 날짜
 */
export const shiftKSTDate = (date: string, days: number): string => {
  // 내부 Date는 항상 UTC 자정에 고정되어야 함. 로컬 기준 메서드(setDate, getDate 등)를 섞으면 날짜가 밀림
  const shifted = new Date(`${date}T00:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);

  return shifted.toISOString().split('T')[0];
};

/**
 * 기간 선택 모드에 해당하는 조회 시작/종료 날짜를 KST 기준으로 계산함.
 * 미선택/직접선택 모드는 사용자가 직접 날짜를 지정하므로 빈 문자열을 반환함.
 *
 * @param {GraphPeriodMode} mode - 기간 선택 모드
 * @param {object} [options] - base: 계산 기준 시각 (기본값: 현재 시각)
 * @returns {{ start: string; end: string }} "YYYY-MM-DD" 형식의 시작/종료 날짜. 양끝을 포함해 조회됨
 */
export const getDateRangeForMode = (
  mode: GraphPeriodMode,
  options: { base?: Date } = {},
): { start: string; end: string } => {
  const { base = new Date() } = options;

  if (mode === 'none' || mode === 'custom') return { start: '', end: '' };

  const end = getKSTDateString(base);

  return { start: shiftKSTDate(end, -(PERIOD_DAYS[mode] - 1)), end };
};

/**
 * 주어진 초 정수를 'N분 M초' 형태로 변환함.
 *
 * @param {number} [time] - 변환할 초 정수 (예: 360, 6분 0초를 의미함)
 * @returns {string}
 */

export const formatTimeToMMSS = (time: number) => {
  const minute = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const second = (Math.floor(time) % 60).toString().padStart(2, '0');

  return `${minute}분 ${second}초`;
};
