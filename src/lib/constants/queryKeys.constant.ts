import { PATHS } from './paths.constant';
import { SidebarIdType } from './sidebar.constant';

type SortParams = { asc: string; sort: string };
type DetailParams = { start: string; end: string; type: string };
type LeaderboardParams = { based: string; sort: string; dateRange: string; limit: string };

export const queryKeys = {
  all: [] as const,
  me: () => [PATHS.ME] as const,
  notis: () => [PATHS.NOTIS] as const,
  summary: () => [PATHS.SUMMARY] as const,
  qrLogin: () => [PATHS.QRLOGIN] as const,
  posts: (sort?: SortParams) =>
    sort !== undefined ? ([PATHS.POSTS, sort] as const) : ([PATHS.POSTS] as const),
  totalStats: (type?: SidebarIdType) =>
    type !== undefined ? ([PATHS.TOTALSTATS, type] as const) : ([PATHS.TOTALSTATS] as const),
  detail: (id?: string, params?: DetailParams) =>
    id !== undefined && params !== undefined
      ? ([PATHS.DETAIL, id, params] as const)
      : ([PATHS.DETAIL] as const),
  leaderboard: (params?: LeaderboardParams) =>
    params !== undefined ? ([PATHS.LEADERBOARD, params] as const) : ([PATHS.LEADERBOARD] as const),
};
