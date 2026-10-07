import { queryOptions } from '@tanstack/react-query';
import { PATHS } from '@/lib/constants/paths.constant';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { NotiListDto } from '@/lib/types/notice.type';
import { instance } from './instance.request';

export const notiList = async () => await instance<null, NotiListDto>(PATHS.NOTIS);

/**
 * 배너·모달·서버 프리페치가 같은 키로 공유하는 공지 목록 쿼리 옵션
 * 공지는 부가 정보라 조회가 실패해도 페이지 ErrorBoundary 로 올리지 않고,
 * 토스트도 띄우지 않은 채 공지 영역만 숨긴다 (보고는 Notice 컴포넌트가 기준에 맞는 오류만 직접 수행)
 */
export const notiListQuery = queryOptions({
  queryKey: queryKeys.notis(),
  queryFn: notiList,
  throwOnError: false,
});
