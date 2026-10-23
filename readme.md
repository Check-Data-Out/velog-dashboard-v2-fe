![image](https://github.com/user-attachments/assets/e43ab765-f94e-41d8-8f57-bf05100606cd)

## Velog Dashboard

- **📅 진행 기간** 2024. 11 ~ ONGOING
- **💻 서비스 URL** [https://velog-dashboard.kro.kr/](https://velog-dashboard.kro.kr/?utm_source=github&utm_medium=repo) (서비스 체험 가능!)

## INTRO

통계 기능이 부실한 블로그 서비스들을 위한 **블로그 통계 대시보드 서비스**입니다.

현재는 Velog 게시물 통계 조회 기능을 제공하고 있으며, 추후 통계 리더보드 및 타 서비스와의 연동을 계획하고 있습니다.

현재 <ins>**200+**</ins>명의 유저들이 서비스를 사용하고 있으며, <ins>**20000+**</ins>개의 게시물의 통계를 관리하고 있습니다.

또한, 프로젝트 초기부터 배포까지의 [회고록](https://velog.io/@six-standard/series/Velog-Dashboard-%EC%B0%B8%EC%97%AC%EA%B8%B0)을 매주 작성하였습니다.

## SETUP DOCS

### 실행

- `git clone https://github.com/Check-Data-Out/velog-dashboard-v2-fe.git`
- `cd velog-dashboard-v2-fe`
- `pnpm install`
- `pnpm husky` (husky 설정)
- `pnpm dev`

### 린팅

- `pnpm eslint:lint` (lint only pages)
- `pnpm prettier:format` (prettier)

### 테스팅

- `pnpm jest:test` (unit test)
- `pnpm cypress:open` (e2e test, with preview screen)
- `pnpm cypress:test` (e2e test, without preview screen)
- `pnpm e2e:local` (로컬 권장: 운영 빌드에 대고 e2e 를 돌리고 서버를 정리한다. dev 서버에 대고 돌릴 때보다 메모리를 덜 쓰고 빠르다. dev 서버·Cypress 를 여러 개 동시에 띄우지 말 것)

### local 에서 docker image 생성, 태깅, 푸시, 테스팅까지

```shell
# 1. 만약 코드 수정했고, 빌드를 로컬에서 했다면, 또는 Dockerfile 을 수정했다면
docker build -t velog-dashboard-v2-fe:latest .

# 2. (docker hub)repo 에 push 하기전 tag 세팅
docker tag velog-dashboard-v2-fe:latest nuung/velog-dashboard-v2-fe:latest

# 3. push
docker push nuung/velog-dashboard-v2-fe:latest

# ======================================================== #
# 이후 local 에서 remote image 기반으로 running testing
docker pull nuung/velog-dashboard-v2-fe:latest
docker run -p 3000:3000 nuung/velog-dashboard-v2-fe:latest
```

### docker 관련, 이미지 정리

```shell
# 사용하지 않는 모든 이미지 정리
docker image prune -af

# 볼륨, 캐시, 컨테이너 포함 등 모든 사용하지 않는 리소스 정리
docker system prune -af --volumes
```
