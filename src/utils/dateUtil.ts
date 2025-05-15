const KST_DIFF = 9 * 60 * 60 * 1000;

/**
 * 주어진 날짜 문자열을 KST(한국 표준시) 기준으로 변환함.
 *
 * @param {string} [date] - 변환할 날짜 문자열 (예: "2025-05-15T08:00:00Z")
 * @returns {{
 *   short: string; // "YYYY-MM-DD" 형식의 날짜 문자열
 *   iso: string;   // ISO 8601 형식 + KST 오프셋 포함 문자열
 *   full: Date;    // KST로 보정된 Date 객체
 * } | undefined} 날짜가 없으면 undefined 반환
 *
 * @example
 * convertDateToKST("2025-05-15T08:00:00Z");
 * // {
 * //   short: "2025-05-15",
 * //   iso: "2025-05-15T17:00:00+09:00",
 * //   full: Date(2025-05-15T17:00:00.000+09:00)
 * // }
 */

export const convertDateToKST = (date?: string) => {
  if (!date) return;
  const converted = new Date(new Date(date).getTime() + KST_DIFF);

  const year = converted.getFullYear();
  const month = (converted.getMonth() + 1).toString().padStart(2, '0');
  const day = converted.getDate().toString().padStart(2, '0');
  const hours = converted.getHours().toString().padStart(2, '0');
  const minutes = converted.getMinutes().toString().padStart(2, '0');
  const seconds = converted.getSeconds().toString().padStart(2, '0');

  return {
    short: `${converted.getFullYear()}-${(converted.getMonth() + 1).toString().padStart(2, '0')}-${converted.getDate()}`,
    iso: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`,
    full: converted,
  };
};
