/** 워크플로 파일에 절대 쓰면 안 되는 비밀 키 이름 패턴 (예: SENTRY_AUTH_TOKEN, *_SECRET, *_PASSWORD, *_PRIVATE_KEY) */
const SECRET_KEY_PATTERN = /(TOKEN|SECRET|PASSWORD|PRIVATE)/;

/**
 * 환경 변수 키 목록을 워크플로에 써도 되는 키와 비밀 키로 나눕니다.
 * 비밀 키는 GitHub secret 참조·로컬 값 어느 형태로도 워크플로 파일에 기록하지 않습니다.
 * @param {string[]} keys - .env.production 에서 읽은 키 목록
 * @returns {{ allowed: string[]; skipped: string[] }} 기록 대상 키와 제외된 비밀 키
 */
export function partitionSecretKeys(keys) {
  const allowed = [];
  const skipped = [];
  for (const key of keys) {
    (SECRET_KEY_PATTERN.test(key) ? skipped : allowed).push(key);
  }
  return { allowed, skipped };
}
