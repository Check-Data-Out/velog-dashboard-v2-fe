const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const ENV_PROD = path.join(ROOT, '.env.production');
const DOCKER_WORKFLOW = path.join(ROOT, '.github', 'workflows', 'docker-publish.yaml');
const E2E_WORKFLOW = path.join(ROOT, '.github', 'workflows', 'process-e2e.yaml');

const BEGIN_MARKER = '# BEGIN_ENV_SYNC';
const END_MARKER = '# END_ENV_SYNC';

function parseEnvFile(filePath) {
  const entries = [];
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    entries.push({ key: trimmed.slice(0, eqIdx).trim(), value: trimmed.slice(eqIdx + 1).trim() });
  }
  return entries;
}

function parseExistingMocks(content) {
  const mocks = {};
  const beginIdx = content.indexOf(BEGIN_MARKER);
  const endIdx = content.indexOf(END_MARKER);
  if (beginIdx === -1 || endIdx === -1) return mocks;

  const section = content.slice(beginIdx + BEGIN_MARKER.length, endIdx);
  for (const line of section.split('\n')) {
    const m = line.match(/echo\s+"([^=]+)=([^"]*)" >> \.env\.production/);
    if (m) mocks[m[1]] = m[2];
  }
  return mocks;
}

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
    BEGIN_MARKER +
    '\n' +
    newLines.map((l) => indent + l).join('\n') +
    '\n' +
    indent +
    END_MARKER;

  return content.slice(0, beginIdx) + newSection + content.slice(endIdx + END_MARKER.length);
}

function syncDockerWorkflow(keys) {
  let content = fs.readFileSync(DOCKER_WORKFLOW, 'utf-8');
  const newLines = keys.map((k) => `echo "${k}=\${{ secrets.${k} }}" >> .env.production`);
  content = replaceSyncSection(content, newLines, DOCKER_WORKFLOW);
  fs.writeFileSync(DOCKER_WORKFLOW, content, 'utf-8');
  console.log(`  ✅ docker-publish.yaml 업데이트 (${keys.length}개 키)`);
}

function syncE2eWorkflow(entries) {
  let content = fs.readFileSync(E2E_WORKFLOW, 'utf-8');
  const existingMocks = parseExistingMocks(content);

  const newLines = entries.map(({ key }) => {
    const val = Object.hasOwn(existingMocks, key) ? existingMocks[key] : 'sample_value';
    return `echo "${key}=${val}" >> .env.production`;
  });

  content = replaceSyncSection(content, newLines, E2E_WORKFLOW);
  fs.writeFileSync(E2E_WORKFLOW, content, 'utf-8');
  console.log(`  ✅ process-e2e.yaml 업데이트 (${entries.length}개 키)`);
}

if (!fs.existsSync(ENV_PROD)) {
  console.error('❌ .env.production 파일이 없습니다. 먼저 생성해 주세요.');
  console.error(`   예상 경로: ${ENV_PROD}`);
  process.exit(1);
}

const entries = parseEnvFile(ENV_PROD);
const keys = entries.map((e) => e.key);

if (keys.length === 0) {
  console.error('❌ .env.production 에서 유효한 키를 찾지 못했습니다.');
  process.exit(1);
}

console.log(`\n📋 .env.production 에서 감지된 키 (${keys.length}개): ${keys.join(', ')}\n`);

syncDockerWorkflow(keys);
syncE2eWorkflow(entries);

console.log('\n🎉 동기화 완료! 변경된 워크플로우 파일을 확인 후 커밋하세요.');
console.log(
  '   ⚠️  GitHub Secrets 에 해당 키가 등록되어 있는지도 확인하세요: Settings → Secrets and variables → Actions',
);
