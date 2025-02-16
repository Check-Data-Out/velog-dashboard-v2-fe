import { PostDetailDto, PostListDto, PostSummaryDto } from '@/types';
import { PATHS } from '@/constants';
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

export const postSummary = async () =>
  await instance<null, PostSummaryDto>(PATHS.SUMMARY);

export const postDetail = async (path: string, start: string, end: string) =>
  await instance<null, PostDetailDto>(
    `${PATHS.DETAIL}/${path}?start=${start}&end=${end}`,
  );
