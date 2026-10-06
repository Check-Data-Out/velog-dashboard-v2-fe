import { queryOptions } from '@tanstack/react-query';
import { PATHS } from '@/lib/constants/paths.constant';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { NotiListDto } from '@/lib/types/notice.type';
import { instance } from './instance.request';

export const notiList = async () => await instance<null, NotiListDto>(PATHS.NOTIS);

/** 배너·모달·서버 프리페치가 같은 키로 공유하는 공지 목록 쿼리 옵션 */
export const notiListQuery = queryOptions({ queryKey: queryKeys.notis(), queryFn: notiList });
