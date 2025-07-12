import { http, HttpResponse } from 'msw';
import { PATHS } from '@/constants';
import { BaseSuccess, BaseError, UnauthorizedError, checkAuthTokens } from './responses';

// 테스트 환경에서 BASE_URL 설정
const BASE_URL =
  typeof window !== 'undefined'
    ? 'http://localhost:3000/api' // 브라우저 환경 (Cypress)
    : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/api'; // Node.js 환경

// 모킹용 유효한 토큰
export const MOCK_ACCESS_TOKEN = 'mock_access_token_12345';
export const MOCK_REFRESH_TOKEN = 'mock_refresh_token_67890';

// 사용자 로그인
const login = http.post(`${BASE_URL}${PATHS.LOGIN}`, async ({ request }) => {
  const body = (await request.json()) as { accessToken: string; refreshToken: string };

  // 유효하지 않은 토큰 시뮬레이션
  if (body.accessToken === 'invalid_token' || body.refreshToken === 'invalid_token') {
    return BaseError(401, '유효하지 않은 토큰입니다.');
  }

  // 성공 응답
  const response = BaseSuccess(
    {
      id: 1,
      username: 'testuser',
      profile: {
        thumbnail: 'https://example.com/avatar.png',
      },
    },
    '로그인에 성공하였습니다.',
  );

  // 쿠키 설정
  response.headers.append(
    'Set-Cookie',
    `access_token=${MOCK_ACCESS_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  );
  response.headers.append(
    'Set-Cookie',
    `refresh_token=${MOCK_REFRESH_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  );

  return response;
});

// 샘플 로그인
const sampleLogin = http.post(`${BASE_URL}${PATHS.SAMPLELOGIN}`, async () => {
  const response = BaseSuccess(
    {
      id: 999,
      username: 'sampleuser',
      profile: {
        thumbnail: 'https://example.com/sample-avatar.png',
      },
    },
    '샘플 로그인에 성공하였습니다.',
  );

  response.headers.append(
    'Set-Cookie',
    `access_token=${MOCK_ACCESS_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  );
  response.headers.append(
    'Set-Cookie',
    `refresh_token=${MOCK_REFRESH_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  );

  return response;
});

// 로그아웃
const logout = http.post(`${BASE_URL}${PATHS.LOGOUT}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  const response = BaseSuccess({}, '로그아웃에 성공하였습니다.');

  // 쿠키 삭제
  response.headers.append(
    'Set-Cookie',
    `access_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
  );
  response.headers.append(
    'Set-Cookie',
    `refresh_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
  );

  return response;
});

// 현재 사용자 정보
const me = http.get(`${BASE_URL}${PATHS.ME}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  return BaseSuccess(
    {
      id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      profile: {
        thumbnail: '/profile.jpg',
      },
    },
    '사용자 정보 조회에 성공하였습니다.',
  );
});

// QR 로그인 토큰 생성
const createQRToken = http.post(`${BASE_URL}${PATHS.QRLOGIN}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  return BaseSuccess({ token: 'qr_token_12345' }, 'QR 로그인 토큰이 생성되었습니다.');
});

// QR 로그인 토큰 조회
const getQRToken = http.get(`${BASE_URL}${PATHS.QRLOGIN}`, async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token || token !== 'qr_token_12345') {
    return BaseError(404, '만료되었거나 존재하지 않는 토큰입니다.');
  }

  return HttpResponse.redirect('/main', 302);
});

// 게시물 목록 조회
const posts = http.get(`${BASE_URL}${PATHS.POSTS}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');

  return BaseSuccess(
    {
      nextCursor: cursor ? null : '2025-01-09T00:00:00Z,10',
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
    '게시물 목록 조회에 성공하였습니다.',
  );
});

// 게시물 통계
const postsStats = http.get(`${BASE_URL}${PATHS.SUMMARY}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  return BaseSuccess(
    {
      totalPostCount: 15,
      stats: {
        lastUpdatedDate: '2025-01-09T00:00:00Z',
        totalLikes: 350,
        totalViews: 2500,
        yesterdayLikes: 45,
        yesterdayViews: 180,
      },
    },
    '게시물 통계 조회에 성공하였습니다.',
  );
});

// 게시물 상세 조회 (ID 기반)
const postDetail = http.get(`${BASE_URL}${PATHS.DETAIL}/:postId`, async ({ request, params }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  const postId = params.postId as string;

  return BaseSuccess(
    {
      post: {
        id: parseInt(postId),
        title: `테스트 게시물 ${postId}`,
        slug: `test-post-${postId}`,
        views: 250,
        likes: 40,
        yesterdayViews: 20,
        yesterdayLikes: 8,
        createdAt: '2025-01-08T10:00:00Z',
        releasedAt: '2025-01-08T10:00:00Z',
        stats: [
          { date: '2025-01-07T00:00:00Z', views: 100, likes: 15 },
          { date: '2025-01-08T00:00:00Z', views: 150, likes: 25 },
        ],
      },
    },
    '게시물 상세 조회에 성공하였습니다.',
  );
});

// 게시물 상세 조회 (UUID 기반)
const postByUUID = http.get(
  `${BASE_URL}${PATHS.DETAIL}/velog/:postId`,
  async ({ request, params }) => {
    if (!checkAuthTokens(request.headers)) {
      return UnauthorizedError('인증이 필요합니다.');
    }

    const postId = params.postId as string;

    return BaseSuccess(
      {
        post: {
          id: postId,
          title: `UUID 기반 테스트 게시물`,
          slug: `uuid-test-post`,
          views: 300,
          likes: 50,
          yesterdayViews: 25,
          yesterdayLikes: 10,
          createdAt: '2025-01-08T10:00:00Z',
          releasedAt: '2025-01-08T10:00:00Z',
          stats: [
            { date: '2025-01-07T00:00:00Z', views: 150, likes: 25 },
            { date: '2025-01-08T00:00:00Z', views: 175, likes: 35 },
          ],
        },
      },
      'UUID 기반 게시물 상세 조회에 성공하였습니다.',
    );
  },
);

// 사용자 리더보드
const userLeaderboard = http.get(`${BASE_URL}${PATHS.LEADERBOARD}/user`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  return BaseSuccess(
    {
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
    '사용자 리더보드 조회에 성공하였습니다.',
  );
});

// 게시물 리더보드
const postLeaderboard = http.get(`${BASE_URL}${PATHS.LEADERBOARD}/post`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  return BaseSuccess(
    {
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
    '게시물 리더보드 조회에 성공하였습니다.',
  );
});

// 전체 통계
const totalStats = http.get(`${BASE_URL}${PATHS.TOTALSTATS}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'view';

  const getMessage = (type: string) => {
    switch (type) {
      case 'view':
        return '전체 조회수 변동 조회에 성공하였습니다.';
      case 'like':
        return '전체 좋아요 변동 조회에 성공하였습니다.';
      case 'post':
        return '전체 게시글 수 변동 조회에 성공하였습니다.';
      default:
        return '전체 통계 조회에 성공하였습니다.';
    }
  };

  return BaseSuccess(
    [
      { date: '2025-01-03T00:00:00Z', value: 100 },
      { date: '2025-01-04T00:00:00Z', value: 150 },
      { date: '2025-01-05T00:00:00Z', value: 200 },
      { date: '2025-01-06T00:00:00Z', value: 180 },
      { date: '2025-01-07T00:00:00Z', value: 250 },
      { date: '2025-01-08T00:00:00Z', value: 300 },
      { date: '2025-01-09T00:00:00Z', value: 350 },
    ],
    getMessage(type),
  );
});

// 공지사항
const notifications = http.get(`${BASE_URL}${PATHS.NOTIS}`, async ({ request }) => {
  if (!checkAuthTokens(request.headers)) {
    return UnauthorizedError('인증이 필요합니다.');
  }

  return BaseSuccess(
    {
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
    '공지사항 조회에 성공하였습니다.',
  );
});

// Sentry 웹훅 (테스트용)
const sentryWebhook = http.post(`${BASE_URL}/webhook/sentry`, async ({ request }) => {
  const body = (await request.json()) as { action: string; data?: unknown; actor?: unknown };

  if (body.action !== 'created') {
    return BaseError(400, 'Sentry 웹훅 처리에 실패했습니다.');
  }

  return BaseSuccess({}, 'Sentry 웹훅 처리에 성공하였습니다.');
});

export const handlers = [
  login,
  sampleLogin,
  logout,
  me,
  createQRToken,
  getQRToken,
  posts,
  postsStats,
  postDetail,
  postByUUID,
  userLeaderboard,
  postLeaderboard,
  totalStats,
  notifications,
  sentryWebhook,
];
