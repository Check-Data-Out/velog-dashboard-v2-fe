import { http } from 'msw';
import { ENVS, PATHS } from '@/constants';
import { LoginVo } from '@/types';
import { BaseError, BaseSuccess } from './responses';

const BASE_URL = ENVS.BASE_URL + '/api';

const login = http.post(`${BASE_URL}${PATHS.LOGIN}`, async ({ request }) => {
  const { accessToken, refreshToken } = (await request.json()) as LoginVo;
  if (accessToken === 'invalid_access' && refreshToken === 'invalid_refresh') {
    return BaseError(404, '잘못된 토큰입니다');
  }
  return BaseSuccess(null);
});

const summary = http.get(`${BASE_URL}${PATHS.SUMMARY}`, async ({ request: { headers } }) => {
  if (!headers.get('access_token') && !headers.get('refresh_token')) {
    return BaseError(401, '잘못된 토큰입니다');
  }
  return BaseSuccess({
    stats: {
      lastUpdatedDate: '2025-01-09T00:00:00Z102',
      totalLikes: 100,
      totalViews: 100,
      yesterdayLikes: 50,
      yesterdayViews: 50,
    },
    totalPostCount: 10,
  });
});

const me = http.get(`${BASE_URL}${PATHS.ME}`, async ({ request: { headers } }) => {
  if (!headers.get('access_token') && !headers.get('refresh_token')) {
    return BaseError(401, '잘못된 토큰입니다');
  }
  return BaseSuccess({
    email: 'test@test.com',
    id: '111111-111111-111111-111111',
    profile: { thumbnail: undefined },
    username: 'test',
  });
});

const posts = http.get(`${BASE_URL}${PATHS.POSTS}`, async ({ request: { headers } }) => {
  if (!headers.get('access_token') && !headers.get('refresh_token')) {
    return BaseError(401, '잘못된 토큰입니다');
  }
  return BaseSuccess({
    nextCursor: '2025-01-09T00:00:00Z102,10',
    posts: [
      {
        createdAt: '2025-01-01T01:01:01Z103',
        id: '1',
        likes: 100,
        releasedAt: '2025-01-09T00:00:00Z102',
        title: 'test title',
        views: 100,
        yesterdayLikes: 100,
        yesterdayViews: 100,
      },
    ],
  });
});

export const handlers = [login, summary, me, posts];

export const tmp = {
  LOGIN: '/login',
  POSTS: '/posts',
  SUMMARY: '/posts-stats',
  ME: '/me',
  LOGOUT: '/logout',
  DETAIL: '/post',
};
