import { BaseError, BaseSuccess } from './base';
import {
  MOCK_ACCESS_TOKEN,
  notificationsResponseData,
  postLeaderboardResponseData,
  postsFirstData,
  postsGraphData,
  postsSecondData,
  postsStatsResponseData,
  qrTokenResponseData,
  totalStatsResponseData,
  userLeaderboardResponseData,
  userResponseData,
} from './mock';
import './commands';

// forceNetworkError 사용 시 앱 코드에서 발생하는 'Failed to fetch' 예외를 무시.
// 실제 네트워크 단절 시나리오에서 앱이 어떻게 UI를 처리하는지 검증하기 위함.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Failed to fetch')) return false;
  return true;
});

beforeEach(() => {
  // middleware.ts 는 access_token 쿠키를 검사하므로,
  // 로그인 성공 응답에 Set-Cookie 헤더를 포함해야 /main 으로 정상 이동 가능
  cy.intercept('POST', '**/api/login', (req) => {
    const body = req.body;
    if (body.accessToken === 'invalid_token' || body.refreshToken === 'invalid_token') {
      req.reply(BaseError(401, '유효하지 않은 토큰입니다.'));
    } else {
      req.reply({
        statusCode: 200,
        headers: {
          'Set-Cookie': `access_token=${MOCK_ACCESS_TOKEN}; Path=/; HttpOnly; SameSite=Strict`,
        },
        body: {
          success: true,
          message: '로그인에 성공하였습니다.',
          data: userResponseData,
          error: null,
        },
      });
    }
  }).as('loginAPI');

  cy.intercept('POST', '**/api/login-sample', (req) => {
    req.reply({
      statusCode: 200,
      headers: {
        'Set-Cookie': `access_token=${MOCK_ACCESS_TOKEN}; Path=/; HttpOnly; SameSite=Strict`,
      },
      body: {
        success: true,
        message: '샘플 로그인에 성공하였습니다.',
        data: userResponseData,
        error: null,
      },
    });
  }).as('sampleLoginAPI');

  cy.intercept(
    'GET',
    '**/api/me',
    BaseSuccess(userResponseData, '사용자 정보 조회에 성공하였습니다.'),
  ).as('meAPI');

  cy.intercept('GET', '**/api/posts*', (req) => {
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');

    req.reply(
      BaseSuccess(!cursor ? postsFirstData : postsSecondData, '게시물 목록 조회에 성공하였습니다.'),
    );
  }).as('postsAPI');

  cy.intercept(
    'GET',
    '**/api/posts-stats',
    BaseSuccess(postsStatsResponseData, '게시물 통계 조회에 성공하였습니다.'),
  ).as('postsStatsAPI');

  cy.intercept(
    'GET',
    '**/api/leaderboard/user*',
    BaseSuccess(userLeaderboardResponseData, '사용자 리더보드 조회에 성공하였습니다.'),
  ).as('userLeaderboardAPI');

  cy.intercept(
    'GET',
    '**/api/leaderboard/post*',
    BaseSuccess(postLeaderboardResponseData, '게시물 리더보드 조회에 성공하였습니다.'),
  ).as('postLeaderboardAPI');

  cy.intercept(
    'GET',
    '**/api/total-stats*',
    BaseSuccess(totalStatsResponseData, '전체 통계 조회에 성공하였습니다.'),
  ).as('totalStatsAPI');

  cy.intercept(
    'GET',
    '**/api/notis',
    BaseSuccess(notificationsResponseData, '공지사항 조회에 성공하였습니다.'),
  ).as('notisAPI');

  cy.intercept('POST', '**/api/logout', BaseSuccess({}, '성공적으로 로그아웃되었습니다.')).as(
    'logoutAPI',
  );

  cy.intercept(
    'GET',
    '**/api/post/**',
    BaseSuccess(postsGraphData, '게시물 상세 정보 조회에 성공하였습니다.'),
  ).as('postDetailAPI');

  cy.intercept(
    'POST',
    '**/api/qr-login',
    BaseSuccess(qrTokenResponseData, 'QR 토큰이 발급되었습니다.'),
  ).as('qrLoginAPI');

  cy.intercept(
    'POST',
    '**/api/stats-refresh',
    BaseSuccess({}, '통계 새로고침이 시작되었습니다.'),
  ).as('statsRefreshAPI');
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      // 인증 토큰을 쿠키에 설정하여 로그인 상태를 모킹합니다.
      setAuthCookies(): Chainable<void>;

      // 인증 토큰을 쿠키에서 제거합니다.
      clearAuthCookies(): Chainable<void>;

      // 페이지 로드를 기다립니다.
      waitForPageLoad(): Chainable<void>;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
