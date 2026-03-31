import { PATHS } from '@/lib/constants/paths.constant';
import { NotiListDto } from '@/lib/types/notice.type';
import { instance } from './instance.request';

export const notiList = async () => await instance<null, NotiListDto>(PATHS.NOTIS);
