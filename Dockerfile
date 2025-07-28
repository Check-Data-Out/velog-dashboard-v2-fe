FROM node:23-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm pm2

# 기존 빌드된 파일들과 필요한 설정 파일들 복사
COPY next.config.mjs ecosystem.config.js ./
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY .env ./.env
COPY .env.production ./.env.production

# 프로덕션 의존성만 설치
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile --prod

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
