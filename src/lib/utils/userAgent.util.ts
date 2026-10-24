const UNKNOWN_DEVICE = '알 수 없는 기기';

// 순서가 중요하다. Chrome 계열 UA에는 Safari가, iOS UA에는 Mac OS X가 함께 들어 있다
const BROWSERS: [RegExp, string][] = [
  [/Edg(e|A|iOS)?\//, 'Edge'],
  [/SamsungBrowser\//, 'Samsung Internet'],
  [/CriOS\/|Chrome\//, 'Chrome'],
  [/FxiOS\/|Firefox\//, 'Firefox'],
  [/Safari\//, 'Safari'],
];

const OSES: [RegExp, string][] = [
  [/iPhone|iPad|iPod/, 'iOS'],
  [/Android/, 'Android'],
  [/Windows/, 'Windows'],
  [/Mac OS X|Macintosh/, 'macOS'],
  [/Linux/, 'Linux'],
];

const findName = (ua: string, rules: [RegExp, string][]) =>
  rules.find(([pattern]) => pattern.test(ua))?.[1];

/**
 * User-Agent를 "브라우저 · OS" 한 줄로 요약
 *
 * @param ua User-Agent 문자열
 * @returns 요약 문자열, 알아볼 수 없으면 "알 수 없는 기기"
 */
export const summarizeUserAgent = (ua?: string | null) => {
  if (!ua) return UNKNOWN_DEVICE;
  const parts = [findName(ua, BROWSERS), findName(ua, OSES)].filter(Boolean);
  return parts.length ? parts.join(' · ') : UNKNOWN_DEVICE;
};
