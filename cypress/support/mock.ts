// API 서버의 응답 형태에 맞춘 모킹 데이터

export const MOCK_ACCESS_TOKEN = 'mock_access_token_12345';
export const MOCK_REFRESH_TOKEN = 'mock_refresh_token_67890';

// 유저 정보 관련 응답 데이터
export const userResponseData = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  profile: { thumbnail: '/profile.jpg' },
};

// 게시물 목록 응답 데이터
export const postsFirstData = {
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
};

export const postsSecondData = {
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
};

// 게시물 목록 응답 데이터
export const postsGraphData = {
  post: [
    { date: '2025-01-03T00:00:00Z', dailyViewCount: 20, dailyLikeCount: 2 },
    { date: '2025-01-04T00:00:00Z', dailyViewCount: 35, dailyLikeCount: 5 },
    { date: '2025-01-05T00:00:00Z', dailyViewCount: 45, dailyLikeCount: 8 },
    { date: '2025-01-06T00:00:00Z', dailyViewCount: 30, dailyLikeCount: 4 },
    { date: '2025-01-07T00:00:00Z', dailyViewCount: 60, dailyLikeCount: 12 },
    { date: '2025-01-08T00:00:00Z', dailyViewCount: 80, dailyLikeCount: 15 },
    { date: '2025-01-09T00:00:00Z', dailyViewCount: 100, dailyLikeCount: 20 },
  ],
};

// 게시물 통계 응답 데이터
export const postsStatsResponseData = {
  totalPostCount: 15,
  stats: {
    lastUpdatedDate: '2025-01-09T00:00:00Z',
    totalLikes: 350,
    totalViews: 2500,
    yesterdayLikes: 45,
    yesterdayViews: 180,
  },
};

// 게시물 상세 응답 데이터 생성 함수 (일일 통계 배열)
export const createPostDetailResponseData = (postId: string) => ({
  post: [
    {
      date: '2025-01-07T00:00:00Z',
      dailyViewCount: 100 + parseInt(postId) * 10,
      dailyLikeCount: 15 + parseInt(postId) * 2,
    },
    {
      date: '2025-01-08T00:00:00Z',
      dailyViewCount: 150 + parseInt(postId) * 10,
      dailyLikeCount: 25 + parseInt(postId) * 2,
    },
  ],
});

// UUID 기반 게시물 상세 응답 데이터 생성 함수 (일일 통계 배열)
export const createPostByUUIDResponseData = (postId: string) => ({
  post: [
    {
      date: '2025-01-07T00:00:00Z',
      dailyViewCount: 150 + postId.length * 5,
      dailyLikeCount: 25 + postId.length * 2,
    },
    {
      date: '2025-01-08T00:00:00Z',
      dailyViewCount: 175 + postId.length * 5,
      dailyLikeCount: 35 + postId.length * 2,
    },
  ],
});

// 사용자 리더보드 응답 데이터
export const userLeaderboardResponseData = {
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
};

// 게시물 리더보드 응답 데이터
export const postLeaderboardResponseData = {
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
};

// 전체 통계 응답 데이터
export const totalStatsResponseData = [
  { date: '2025-01-03T00:00:00Z', value: 100 },
  { date: '2025-01-04T00:00:00Z', value: 150 },
  { date: '2025-01-05T00:00:00Z', value: 200 },
  { date: '2025-01-06T00:00:00Z', value: 180 },
  { date: '2025-01-07T00:00:00Z', value: 250 },
  { date: '2025-01-08T00:00:00Z', value: 300 },
  { date: '2025-01-09T00:00:00Z', value: 350 },
];

// 공지사항 응답 데이터
export const notificationsResponseData = {
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
};

// 전체 통계 타입별 성공 메시지
export const getTotalStatsMessage = (type: string) => {
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
