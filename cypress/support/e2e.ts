// ***********************************************************
// Cypress E2E 지원 파일
// ***********************************************************

// Cypress 명령어 타입 정의
import './commands';

// Cypress에서는 cy.intercept를 사용하여 API 모킹
beforeEach(() => {
  // 로그인 API 모킹
  cy.intercept('POST', '**/api/login', (req) => {
    const body = req.body;
    if (body.accessToken === 'invalid_token' || body.refreshToken === 'invalid_token') {
      req.reply({
        statusCode: 401,
        body: {
          success: false,
          message: '유효하지 않은 토큰입니다.',
          data: null,
          error: '유효하지 않은 토큰입니다.',
        },
      });
    } else {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: '로그인에 성공하였습니다.',
          data: {
            id: 'user-1',
            username: 'testuser',
            email: 'test@example.com',
            profile: {
              thumbnail: 'https://example.com/avatar.png',
            },
          },
          error: null,
        },
      });
    }
  }).as('loginAPI');

  // 샘플 로그인 API 모킹
  cy.intercept('POST', '**/api/login-sample', {
    statusCode: 200,
    body: {
      success: true,
      message: '샘플 로그인에 성공하였습니다.',
      data: {
        id: 'user-999',
        username: 'sampleuser',
        email: 'sample@example.com',
        profile: {
          thumbnail: 'https://example.com/sample-avatar.png',
        },
      },
      error: null,
    },
  }).as('sampleLoginAPI');

  // 사용자 정보 API 모킹
  cy.intercept('GET', '**/api/me', {
    statusCode: 200,
    body: {
      success: true,
      message: '사용자 정보 조회에 성공하였습니다.',
      data: {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        profile: {
          thumbnail: '/profile.jpg',
        },
      },
      error: null,
    },
  }).as('meAPI');

  // 게시물 목록 API 모킹 (첫 번째 페이지)
  cy.intercept('GET', '**/api/posts*', (req) => {
    // URL에서 cursor 확인
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');

    if (!cursor) {
      // 첫 번째 페이지 - nextCursor 포함
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: '게시물 목록 조회에 성공하였습니다.',
          data: {
            nextCursor: '2025-01-09T00:00:00Z,10',
            posts: [
              {
                id: 1,
                title: '테스트 게시물 1',
                slug: 'test-post-1',
                views: 150,
                likes: 25,
                yesterdayViews: 10,
                yesterdayLikes: 5,
                createdAt: '2025-01-08T10:00:00Z',
                releasedAt: '2025-01-08T10:00:00Z',
              },
              {
                id: 2,
                title: '테스트 게시물 2',
                slug: 'test-post-2',
                views: 200,
                likes: 35,
                yesterdayViews: 15,
                yesterdayLikes: 8,
                createdAt: '2025-01-07T15:30:00Z',
                releasedAt: '2025-01-07T15:30:00Z',
              },
            ],
          },
          error: null,
        },
      });
    } else {
      // 두 번째 페이지 - nextCursor null로 무한 스크롤 종료
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: '게시물 목록 조회에 성공하였습니다.',
          data: {
            nextCursor: null,
            posts: [
              {
                id: 3,
                title: '테스트 게시물 3',
                slug: 'test-post-3',
                views: 120,
                likes: 18,
                yesterdayViews: 8,
                yesterdayLikes: 3,
                createdAt: '2025-01-06T09:00:00Z',
                releasedAt: '2025-01-06T09:00:00Z',
              },
              {
                id: 4,
                title: '테스트 게시물 4',
                slug: 'test-post-4',
                views: 90,
                likes: 12,
                yesterdayViews: 5,
                yesterdayLikes: 2,
                createdAt: '2025-01-05T14:00:00Z',
                releasedAt: '2025-01-05T14:00:00Z',
              },
            ],
          },
          error: null,
        },
      });
    }
  }).as('postsAPI');

  // 게시물 통계 API 모킹
  cy.intercept('GET', '**/api/posts-stats', {
    statusCode: 200,
    body: {
      success: true,
      message: '게시물 통계 조회에 성공하였습니다.',
      data: {
        totalPostCount: 15,
        stats: {
          lastUpdatedDate: '2025-01-09T00:00:00Z',
          totalLikes: 350,
          totalViews: 2500,
          yesterdayLikes: 45,
          yesterdayViews: 180,
        },
      },
      error: null,
    },
  }).as('postsStatsAPI');

  // 사용자 리더보드 API 모킹
  cy.intercept('GET', '**/api/leaderboard/user*', {
    statusCode: 200,
    body: {
      success: true,
      message: '사용자 리더보드 조회에 성공하였습니다.',
      data: {
        users: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            username: 'topuser1',
            totalViews: 15000,
            totalLikes: 1200,
            totalPosts: 45,
            viewDiff: 500,
            likeDiff: 50,
            postDiff: 3,
          },
          {
            id: 'user-2',
            email: 'user2@example.com',
            username: 'topuser2',
            totalViews: 12000,
            totalLikes: 980,
            totalPosts: 38,
            viewDiff: 300,
            likeDiff: 40,
            postDiff: 2,
          },
          {
            id: 'user-3',
            email: 'user3@example.com',
            username: 'topuser3',
            totalViews: 10000,
            totalLikes: 800,
            totalPosts: 30,
            viewDiff: 250,
            likeDiff: 35,
            postDiff: 1,
          },
        ],
      },
      error: null,
    },
  }).as('userLeaderboardAPI');

  // 게시물 리더보드 API 모킹
  cy.intercept('GET', '**/api/leaderboard/post*', {
    statusCode: 200,
    body: {
      success: true,
      message: '게시물 리더보드 조회에 성공하였습니다.',
      data: {
        posts: [
          {
            id: 'post-1',
            title: '인기 게시물 1',
            slug: 'popular-post-1',
            username: 'author1',
            totalViews: 5000,
            totalLikes: 400,
            viewDiff: 200,
            likeDiff: 30,
            releasedAt: '2025-01-07T10:00:00Z',
          },
          {
            id: 'post-2',
            title: '인기 게시물 2',
            slug: 'popular-post-2',
            username: 'author2',
            totalViews: 4500,
            totalLikes: 350,
            viewDiff: 150,
            likeDiff: 25,
            releasedAt: '2025-01-06T14:30:00Z',
          },
          {
            id: 'post-3',
            title: '인기 게시물 3',
            slug: 'popular-post-3',
            username: 'author3',
            totalViews: 4000,
            totalLikes: 300,
            viewDiff: 120,
            likeDiff: 20,
            releasedAt: '2025-01-05T09:15:00Z',
          },
        ],
      },
      error: null,
    },
  }).as('postLeaderboardAPI');

  // 전체 통계 API 모킹
  cy.intercept('GET', '**/api/total-stats*', {
    statusCode: 200,
    body: {
      success: true,
      message: '전체 통계 조회에 성공하였습니다.',
      data: [
        { date: '2025-01-03T00:00:00Z', value: 100 },
        { date: '2025-01-04T00:00:00Z', value: 150 },
        { date: '2025-01-05T00:00:00Z', value: 200 },
        { date: '2025-01-06T00:00:00Z', value: 180 },
        { date: '2025-01-07T00:00:00Z', value: 250 },
        { date: '2025-01-08T00:00:00Z', value: 300 },
        { date: '2025-01-09T00:00:00Z', value: 350 },
      ],
      error: null,
    },
  }).as('totalStatsAPI');

  // 공지사항 API 모킹
  cy.intercept('GET', '**/api/notis', {
    statusCode: 200,
    body: {
      success: true,
      message: '공지사항 조회에 성공하였습니다.',
      data: {
        posts: [
          {
            id: 'noti-1',
            title: '시스템 점검 안내',
            content: '시스템 점검이 예정되어 있습니다.',
            createdAt: '2025-01-08T09:00:00Z',
            isImportant: true,
          },
          {
            id: 'noti-2',
            title: '새로운 기능 업데이트',
            content: '새로운 기능이 추가되었습니다.',
            createdAt: '2025-01-07T16:00:00Z',
            isImportant: false,
          },
        ],
      },
      error: null,
    },
  }).as('notisAPI');

  // 로그아웃 API 모킹
  cy.intercept('POST', '**/api/logout', {
    statusCode: 200,
    body: {
      success: true,
      message: '로그아웃에 성공하였습니다.',
      data: {},
      error: null,
    },
  }).as('logoutAPI');

  // 게시물 상세 차트 API 모킹 (차트 데이터용)
  cy.intercept('GET', '**/api/post/**', {
    statusCode: 200,
    body: {
      success: true,
      message: '게시물 상세 정보 조회에 성공하였습니다.',
      data: {
        post: [
          { date: '2025-01-03T00:00:00Z', dailyViewCount: 20, dailyLikeCount: 2 },
          { date: '2025-01-04T00:00:00Z', dailyViewCount: 35, dailyLikeCount: 5 },
          { date: '2025-01-05T00:00:00Z', dailyViewCount: 45, dailyLikeCount: 8 },
          { date: '2025-01-06T00:00:00Z', dailyViewCount: 30, dailyLikeCount: 4 },
          { date: '2025-01-07T00:00:00Z', dailyViewCount: 60, dailyLikeCount: 12 },
          { date: '2025-01-08T00:00:00Z', dailyViewCount: 80, dailyLikeCount: 15 },
          { date: '2025-01-09T00:00:00Z', dailyViewCount: 100, dailyLikeCount: 20 },
        ],
      },
      error: null,
    },
  }).as('postDetailAPI');
});

// 전역 타입 선언
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * 인증 토큰을 쿠키에 설정하여 로그인 상태를 모킹합니다.
       */
      setAuthCookies(): Chainable<void>;

      /**
       * 인증 토큰을 쿠키에서 제거합니다.
       */
      clearAuthCookies(): Chainable<void>;

      /**
       * 페이지 로드를 기다립니다.
       */
      waitForPageLoad(): Chainable<void>;
    }
  }
}
