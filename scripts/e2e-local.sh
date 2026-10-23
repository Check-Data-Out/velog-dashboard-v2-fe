#!/bin/bash
# 로컬 E2E 를 운영 빌드(standalone 서버)에 대고 한 세트만 돌린다.
# dev 서버(webpack + Sentry 플러그인)에 대고 돌릴 때보다 메모리를 절반 정도 쓴다 (Next.js 공식 Cypress 가이드 권장 방식).
# 사용: pnpm e2e:local [cypress run 옵션, 예: --spec cypress/e2e/main.cy.ts]
set -euo pipefail

PORT="${PORT:-3000}"
# 운영 빌드에 .env.production 의 실제 주소가 들어가면 로그인 e2e 의 쿠키가 localhost 에 저장되지 않는다
export NEXT_PUBLIC_BASE_URL="http://localhost:${PORT}"
export NEXT_PUBLIC_CLIENT_BASE_URL="http://localhost:${PORT}"
export NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY='sample_key'
export NEXT_PUBLIC_GA_ID='sample_id'
export NEXT_PUBLIC_SENTRY_DSN='sample_dsn'
# Cypress 에 번들된 term-size 의 macOS 바이너리는 x86_64 다. 터미널 크기를 넘겨 그 바이너리가 실행되지 않게 한다
export COLUMNS="${COLUMNS:-120}" LINES="${LINES:-40}"

pnpm autoBuild

PORT="${PORT}" HOSTNAME=127.0.0.1 node .next/standalone/server.js &
SERVER_PID=$!
trap 'kill "${SERVER_PID}" 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://localhost:${PORT}" && break
  sleep 1
done
curl -sf -o /dev/null "http://localhost:${PORT}" || { echo "서버가 60초 안에 뜨지 않았습니다" >&2; exit 1; }

pnpm exec cypress run --config "baseUrl=http://localhost:${PORT}" "$@"
