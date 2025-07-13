import { BaseError, BaseSuccess } from './base';
import {
  notificationsResponseData,
  postLeaderboardResponseData,
  postsFirstData,
  postsGraphData,
  postsSecondData,
  postsStatsResponseData,
  totalStatsResponseData,
  userLeaderboardResponseData,
  userResponseData,
} from './mock';
import './commands';

beforeEach(() => {
  cy.intercept('POST', '**/api/login', (req) => {
    const body = req.body;
    if (body.accessToken === 'invalid_token' || body.refreshToken === 'invalid_token') {
      req.reply(BaseError(401, '유효하지 않은 토큰입니다.'));
    } else {
      req.reply(BaseSuccess(userResponseData, '로그인에 성공하였습니다.'));
    }
  }).as('loginAPI');

  cy.intercept(
    'POST',
    '**/api/login-sample',
    BaseSuccess(userResponseData, '샘플 로그인에 성공하였습니다.'),
  ).as('sampleLoginAPI');

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
