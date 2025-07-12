# 테스트 설정 가이드

## 🚀 MSW + Cypress 테스트 환경 구성

이 프로젝트는 **MSW(Mock Service Worker)**와 **Cypress**를 활용한 E2E 테스트 환경을 구성하였습니다.

### 📋 주요 특징

- **API 프로젝트 응답 형식에 맞춘 MSW 모킹**
- **로그인 건너뛰기 기능 (사전 인증 토큰 설정)**
- **모든 API 엔드포인트에 대한 완전한 모킹**
- **실제 네트워크 요청 없이 빠른 테스트 실행**

### 🔧 설치된 패키지

```bash
# MSW 관련
msw@^2.7.3

# Cypress 관련
cypress@^14.5.1
@cypress/webpack-preprocessor@^6.0.4
start-server-and-test@^2.0.12
```

### 🏗️ 프로젝트 구조

```
WEB/
├── src/
│   └── __mock__/
│       ├── handlers.ts      # MSW 핸들러 (모든 API 엔드포인트)
│       ├── responses.ts     # 응답 헬퍼 함수
│       ├── server.ts        # Node.js 환경용 MSW 서버
│       └── browser.ts       # 브라우저 환경용 MSW 워커
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.ts          # 로그인 페이지 테스트
│   │   ├── main.cy.ts           # 메인 페이지 테스트
│   │   └── leaderboards.cy.ts   # 리더보드 페이지 테스트
│   └── support/
│       ├── e2e.ts               # Cypress 지원 파일
│       └── commands.ts          # 커스텀 명령어
├── cypress.config.ts            # Cypress 설정
└── jest.setup.ts               # Jest + MSW 설정
```

### 📝 MSW 핸들러 구성

모든 API 엔드포인트에 대한 MSW 핸들러가 구성되어 있습니다:

#### 사용자 관련 API

- `POST /api/login` - 사용자 로그인
- `POST /api/login-sample` - 샘플 로그인
- `POST /api/logout` - 로그아웃
- `GET /api/me` - 현재 사용자 정보
- `POST /api/qr-login` - QR 로그인 토큰 생성
- `GET /api/qr-login` - QR 로그인 토큰 조회

#### 게시물 관련 API

- `GET /api/posts` - 게시물 목록 조회
- `GET /api/posts-stats` - 게시물 통계
- `GET /api/post/:postId` - 게시물 상세 조회 (ID 기반)
- `GET /api/post/velog/:postId` - 게시물 상세 조회 (UUID 기반)

#### 리더보드 관련 API

- `GET /api/leaderboard/user` - 사용자 리더보드
- `GET /api/leaderboard/post` - 게시물 리더보드

#### 기타 API

- `GET /api/total-stats` - 전체 통계
- `GET /api/notis` - 공지사항
- `POST /api/webhook/sentry` - Sentry 웹훅

### 🎯 테스트 실행 방법

#### 1. Cypress 테스트 실행

```bash
# 개발 환경에서 Cypress 열기
pnpm e2e:dev

# 헤드리스 모드로 Cypress 실행
pnpm e2e:test

# Cypress만 실행 (서버가 이미 실행 중일 때)
pnpm cypress:open
pnpm cypress:run
```

#### 2. Jest 테스트 실행

```bash
# 일반 Jest 테스트
pnpm test
```

### 🔐 인증 토큰 관리

#### 모킹 토큰

```typescript
// src/__mock__/handlers.ts
export const MOCK_ACCESS_TOKEN = 'mock_access_token_12345';
export const MOCK_REFRESH_TOKEN = 'mock_refresh_token_67890';
```

#### 로그인 건너뛰기

로그인 페이지를 제외한 모든 페이지 테스트에서는 `cy.setAuthCookies()` 명령어를 사용하여 사전에 인증 토큰을 설정합니다:

```typescript
// cypress/e2e/main.cy.ts
describe('메인 페이지', () => {
  beforeEach(() => {
    // 인증 토큰 설정 (로그인 건너뛰기)
    cy.setAuthCookies();

    // 메인 페이지 방문
    cy.visit('/main');
  });

  // ... 테스트 코드
});
```

### 🛠️ 커스텀 Cypress 명령어

#### `cy.setAuthCookies()`

인증 토큰을 쿠키에 설정하여 로그인 상태를 모킹합니다.

#### `cy.clearAuthCookies()`

인증 토큰을 쿠키에서 제거합니다.

#### `cy.waitForPageLoad()`

페이지 로드가 완료될 때까지 대기합니다.

### 📊 테스트 범위

#### 로그인 페이지 (`login.cy.ts`)

- ✅ 페이지 로드 확인
- ✅ 로그인 폼 존재 확인
- ✅ 유효한 토큰으로 로그인 성공
- ✅ 유효하지 않은 토큰으로 로그인 실패
- ✅ 샘플 로그인 기능

#### 메인 페이지 (`main.cy.ts`)

- ✅ 페이지 로드 확인
- ✅ 대시보드 통계 정보 표시
- ✅ 게시물 목록 표시
- ✅ 사이드바 네비게이션 동작
- ✅ 헤더 정보 표시
- ✅ 차트 렌더링
- ✅ 정렬 기능 동작
- ✅ 페이지네이션 동작
- ✅ 로그아웃 기능

#### 리더보드 페이지 (`leaderboards.cy.ts`)

- ✅ 페이지 로드 확인
- ✅ 사용자 리더보드 표시
- ✅ 게시물 리더보드 표시
- ✅ 필터 기능 동작
- ✅ 랭킹 순위 표시
- ✅ 통계 변화량 표시
- ✅ 헤더 네비게이션 동작
- ✅ 프로필 이미지 표시

### 🔄 개발 워크플로우

1. **개발 서버 실행**

   ```bash
   pnpm dev
   ```

2. **테스트 실행**

   ```bash
   # 새 터미널에서
   pnpm e2e:dev
   ```

3. **테스트 작성**
   - `cypress/e2e/` 폴더에 `*.cy.ts` 파일 생성
   - 필요한 경우 `src/__mock__/handlers.ts`에 새로운 API 핸들러 추가

### 🚨 주의사항

1. **실제 API 호출 금지**: 모든 API 요청은 MSW를 통해 모킹됩니다.
2. **토큰 관리**: 로그인 테스트 외에는 반드시 `cy.setAuthCookies()`를 사용하세요.
3. **선택자 전략**: 가능한 경우 `data-testid` 속성을 사용하고, 없는 경우 텍스트 기반 선택자를 사용합니다.

### 📈 성능 최적화

- MSW를 통한 네트워크 요청 모킹으로 빠른 테스트 실행
- 로그인 건너뛰기를 통한 테스트 시간 단축
- 병렬 테스트 실행 지원

### 🎉 완료된 설정

✅ 기존 MSW 코드 제거  
✅ API 프로젝트 응답 형식에 맞춘 새로운 MSW 구성  
✅ 모든 API 엔드포인트에 대한 MSW 핸들러 생성  
✅ Cypress 설정 및 기본 구성  
✅ 각 페이지별 Cypress 테스트 코드 생성  
✅ 로그인 건너뛰기 기능 구현  
✅ Jest + MSW 통합 설정

이제 안정적이고 빠른 E2E 테스트를 실행할 수 있습니다! 🚀
