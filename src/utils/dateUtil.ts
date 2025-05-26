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
