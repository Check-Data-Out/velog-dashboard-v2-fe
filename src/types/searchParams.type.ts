import { SORT_TYPE } from '@/constants';

export type SortKey = '작성일순' | '조회순' | '오늘조회순' | '좋아요순';
export type SortValue = (typeof SORT_TYPE)[keyof typeof SORT_TYPE];

export type SortType = Record<SortKey, string>;
