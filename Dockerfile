FROM node:23-alpine

WORKDIR /usr/src/app

RUN npm install -g pm2

# 빌드된 Output 복사
COPY .next ./.next
COPY public ./public
COPY package.json next.config.mjs ./
COPY ecosystem.config.js ./

# 프로덕션 의존성만 설치
RUN npm install --only=prod

EXPOSE 3000

# PM2로 Next.js 실행
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
