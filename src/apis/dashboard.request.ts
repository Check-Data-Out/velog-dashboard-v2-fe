import { PostDetailDto, PostListDto, PostSummaryDto, TotalStatsDto } from '@/types';
import { PATHS, SidebarIdType } from '@/constants';

import { instance } from './instance.request';

type SortType = {
  asc: boolean;
  sort: string;
};

export const postList = async (sort: SortType, cursor?: string) =>
  await instance<null, PostListDto>(
    cursor
      ? `${PATHS.POSTS}?cursor=${cursor}&asc=${sort.asc}&sort=${sort.sort}`
      : `${PATHS.POSTS}?asc=${sort.asc}&sort=${sort.sort}`,
  );

export const postSummary = async () => await instance<null, PostSummaryDto>(PATHS.SUMMARY);

export const postDetail = async (path: string, start: string, end: string) =>
  await instance<null, PostDetailDto>(`${PATHS.DETAIL}/${path}?start=${start}&end=${end}`);

export const totalStats = async (type: SidebarIdType, period: number = 7) =>
  await instance<null, TotalStatsDto>(`${PATHS.TOTALSTATS}?period=${period}&type=${type}`);
