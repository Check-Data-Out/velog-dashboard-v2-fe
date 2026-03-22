import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function syncDockerWorkflow(keys) {
  let content = fs.readFileSync(DOCKER_WORKFLOW, 'utf-8');
  const newLines = keys.map((k) => `echo "${k}=\${{ secrets.${k} }}" >> .env.production`);
  content = replaceSyncSection(content, newLines, DOCKER_WORKFLOW);
  fs.writeFileSync(DOCKER_WORKFLOW, content, 'utf-8');
  console.log(`updated docker-publish.yaml (${keys.length} keys)`);
}

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

console.log('done.');
