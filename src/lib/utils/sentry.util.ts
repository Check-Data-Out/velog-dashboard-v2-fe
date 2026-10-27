// 로컬에서 띄운 운영 빌드(e2e, Docker 이미지 확인)도 운영 DSN 으로 이벤트를 보내므로 요청 주소가 로컬이면 버린다
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

export const isLocalUrl = (url?: string) => {
  if (!url) return false;
  try {
    return LOCAL_HOSTNAMES.has(new URL(url).hostname);
  } catch {
    return false;
  }
};

export const dropLocalEvent = <T extends { request?: { url?: string } }>(event: T): T | null =>
  isLocalUrl(event.request?.url) ? null : event;
