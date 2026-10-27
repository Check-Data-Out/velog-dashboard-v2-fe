export const SORT_TYPE = {
  작성일순: '',
  조회순: 'dailyViewCount',
  조회변동순: 'viewGrowth',
  좋아요순: 'dailyLikeCount',
} as const;

// 리더보드 기본 조회 조건. 서버 프리페치(page.tsx)와 클라이언트(Content.tsx)가 같은 쿼리 키를 만들도록 한 곳에 둔다
export const LEADERBOARD_DEFAULT_PARAMS = {
  based: 'user' as const,
  sort: 'viewCount' as const,
  limit: '10',
  dateRange: '30',
};
