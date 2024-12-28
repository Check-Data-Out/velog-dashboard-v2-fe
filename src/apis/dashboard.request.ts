import { PostListDto, PostSummaryDto } from '@/types';
import { PATHS } from '@/constants';
import { instance } from './instance.request';

type SortType = {
  asc: boolean;
  sort: string;
};

export const postList = async (sort: SortType, cursor?: number) =>
  await instance<null, PostListDto>(
    cursor
      ? `${PATHS.POSTS}?cursor=${cursor}&asc=${sort.asc}&sort=${sort.sort}`
      : `${PATHS.POSTS}?asc=${sort.asc}&sort=${sort.sort}`,
  );

export const postSummary = async () =>
  await instance<null, PostSummaryDto>(PATHS.SUMMARY);

export const me = async () => await instance<null, any>(PATHS.ME);
