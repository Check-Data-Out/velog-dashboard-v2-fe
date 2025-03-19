# Velog Dashboard

![](https://cdn.jsdelivr.net/gh/five-standard/images@main/Back-VD.png)

## 실행

- `git clone https://github.com/Check-Data-Out/velog-dashboard-v2-fe.git`
- `cd velog-dashboard-v2-fe`
- `pnpm install`
- `pnpm prepare` (husky 설정)
- `pnpm dev`

## 린팅

- `pnpm lint` (lint only pages)
- `pnpm lintTest` (lint only tests)
- `pnpm format` (prettier)

## 테스팅

- `pnpm test` (test all pages & components)

## local 에서 docker image 생성, 태깅, 푸시, 테스팅까지

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

## docker 관련, 이미지 정리

```shell
# 사용하지 않는 모든 이미지 정리
docker image prune -af

# 볼륨, 캐시, 컨테이너 포함 등 모든 사용하지 않는 리소스 정리
docker system prune -af --volumes
```
