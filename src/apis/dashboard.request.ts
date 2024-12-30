import { PostDetailDto, PostListDto, PostSummaryDto } from '@/types';
import { PATHS } from '@/constants';
import { InitType, instance } from './instance.request';

type SortType = {
  asc: boolean;
  sort: string;
};

export const postList = async (
  props: InitType<PostListDto>,
  sort: SortType,
  cursor?: number,
) =>
  await instance<null, PostListDto>(
    cursor
      ? `${PATHS.POSTS}?cursor=${cursor}&asc=${sort.asc}&sort=${sort.sort}`
      : `${PATHS.POSTS}?asc=${sort.asc}&sort=${sort.sort}`,
    props,
  );

export const postSummary = async (props: InitType<PostSummaryDto>) =>
  await instance<null, PostSummaryDto>(PATHS.SUMMARY, props);

export const postDetail = async (path: string, start: string, end: string) =>
  await instance<null, PostDetailDto>(
    `${PATHS.DETAIL}/${path}?start=${start}&end=${end}`,
  );
