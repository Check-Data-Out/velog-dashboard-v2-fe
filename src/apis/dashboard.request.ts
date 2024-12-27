import { PostListDto } from '@/types';
import { instance } from './instance.request';

type SortType = {
  asc: boolean;
  sort: string;
};

export const postList = async (sort: SortType, cursor?: number) =>
  await instance<null, PostListDto>(
    cursor
      ? `/posts?cursor=${cursor}&asc=${sort.asc}&sort=${sort.sort}`
      : `/posts?asc=${sort.asc}&sort=${sort.sort}`,
  );
