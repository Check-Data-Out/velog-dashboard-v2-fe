// 로컬에서 띄운 운영 빌드(e2e, Docker 이미지 확인)도 운영 DSN 으로 이벤트를 보내므로 요청 주소가 로컬이면 버린다
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '0.0.0.0']);

export const isLocalUrl = (url?: string) => {
  if (!url) return false;
  try {
    // 'localhost.' 처럼 끝에 점이 붙은 FQDN 표기도 같은 호스트다
    const hostname = new URL(url).hostname.replace(/\.$/, '');
    return LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith('.localhost');
  } catch {
    return false;
  }
};

export const dropLocalEvent = <T extends { request?: { url?: string } }>(event: T): T | null =>
  isLocalUrl(event.request?.url) ? null : event;
