import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, '..');
const ENV_PROD = path.join(ROOT, '.env.production');
const ENV_LOCAL = path.join(ROOT, '.env.local');
const ENV_BASE = path.join(ROOT, '.env');
const DOCKER_WORKFLOW = path.join(ROOT, '.github', 'workflows', 'docker-publish.yaml');
const E2E_WORKFLOW = path.join(ROOT, '.github', 'workflows', 'process-e2e.yaml');

const BEGIN_MARKER = '# BEGIN_ENV_SYNC';
const END_MARKER = '# END_ENV_SYNC';

/**
 * .env 파일을 파싱하여 키-값 쌍의 배열로 반환합니다.
 * 주석(#)과 빈 줄은 무시하며, 값에 포함된 따옴표(", ')는 자동으로 제거됩니다.
 * @param {string} filePath - 파싱할 .env 파일의 경로
 * @returns {{ key: string; value: string }[]} 키-값 쌍의 배열
 */
function parseEnvFile(filePath) {
  const entries = [];
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries.push({ key, value });
  }
  return entries;
}

/**
 * 워크플로우 파일에서 BEGIN_ENV_SYNC ~ END_ENV_SYNC 마커 사이의 내용을 교체합니다.
 * 마커가 존재하지 않으면 에러를 던집니다.
 * @param {string} content - 교체할 워크플로우 파일의 전체 내용
 * @param {string[]} newLines - 마커 사이에 삽입할 새 줄 목록
 * @param {string} filePath - 오류 메시지에 사용할 파일 경로
 * @returns {string} 마커 구간이 교체된 새 파일 내용
 */
function replaceSyncSection(content, newLines, filePath) {
  const beginIdx = content.indexOf(BEGIN_MARKER);
  const endIdx = content.indexOf(END_MARKER);

  if (beginIdx === -1 || endIdx === -1) {
    throw new Error(
      `마커(${BEGIN_MARKER} / ${END_MARKER})를 찾을 수 없습니다: ${filePath}\n` +
        '워크플로우 파일에 마커가 있는지 확인하세요.',
    );
  }

  const linesBefore = content.slice(0, beginIdx).split('\n');
  const indent = linesBefore[linesBefore.length - 1];

  const newSection =
    BEGIN_MARKER + '\n' + newLines.map((l) => indent + l).join('\n') + '\n' + indent + END_MARKER;

  return content.slice(0, beginIdx) + newSection + content.slice(endIdx + END_MARKER.length);
}

/**
 * .env.local 또는 .env 파일을 읽어 키-값 맵으로 반환합니다.
 * 두 파일 모두 존재하지 않으면 빈 객체를 반환합니다.
 * @returns {Record<string, string>} 환경 변수 키-값 맵
 */
function loadLocalEnv() {
  const envPath = fs.existsSync(ENV_LOCAL) ? ENV_LOCAL : ENV_BASE;
  if (!fs.existsSync(envPath)) {
    console.warn('warning: .env.local and .env not found, e2e sync will use empty values.');
    return {};
  }
  const label = fs.existsSync(ENV_LOCAL) ? '.env.local' : '.env';
  console.log(`e2e: reading values from ${label}`);
  return Object.fromEntries(parseEnvFile(envPath).map(({ key, value }) => [key, value]));
}

/**
 * E2E 워크플로우 파일(.github/workflows/process-e2e.yaml)의 ENV_SYNC 구간을
 * .env.local(또는 .env)의 실제 값으로 업데이트합니다.
 * @param {string[]} keys - 동기화할 환경 변수 키 목록
 */
function syncE2eWorkflow(keys) {
  const localEnv = loadLocalEnv();
  let content = fs.readFileSync(E2E_WORKFLOW, 'utf-8');
  const newLines = keys.map((k) => {
    const value = localEnv[k] ?? '';
    return `echo "${k}=${value}" >> .env`;
  });
  content = replaceSyncSection(content, newLines, E2E_WORKFLOW);
  fs.writeFileSync(E2E_WORKFLOW, content, 'utf-8');
  console.log(`updated process-e2e.yaml (${keys.length} keys)`);
}

/**
 * Docker 워크플로우 파일(.github/workflows/docker-publish.yaml)의 ENV_SYNC 구간을
 * GitHub Secrets 참조(${{ secrets.KEY }}) 형식으로 업데이트합니다.
 * @param {string[]} keys - 동기화할 환경 변수 키 목록
 */
function syncDockerWorkflow(keys) {
  let content = fs.readFileSync(DOCKER_WORKFLOW, 'utf-8');
  const newLines = keys.map((k) => `echo "${k}=\${{ secrets.${k} }}" >> .env.production`);
  content = replaceSyncSection(content, newLines, DOCKER_WORKFLOW);
  fs.writeFileSync(DOCKER_WORKFLOW, content, 'utf-8');
  console.log(`updated docker-publish.yaml (${keys.length} keys)`);
}

/**
 * .env.production의 키 목록을 기준으로 Docker 및 E2E 워크플로우 파일을 동기화합니다.
 */
function main() {
  if (!fs.existsSync(ENV_PROD)) {
    console.error('.env.production not found.');
    console.error(`expected: ${ENV_PROD}`);
    process.exit(1);
  }

  const entries = parseEnvFile(ENV_PROD);
  const keys = entries.map((e) => e.key);

  if (keys.length === 0) {
    console.error('no valid keys found in .env.production.');
    process.exit(1);
  }

  console.log(`keys (${keys.length}): ${keys.join(', ')}`);

  syncDockerWorkflow(keys);
  syncE2eWorkflow(keys);

  console.log('done.');
}

main();
