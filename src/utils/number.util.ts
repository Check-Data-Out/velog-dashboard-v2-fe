/**
 * 주어진 숫자에 천 단위로 콤마를 찍어 반환함.
 *
 * @param {number} [item] - 변환할 정수
 * @returns {string}
 */

export const parseNumber = (item?: number) =>
  item ? item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
