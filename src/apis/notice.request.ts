import { PATHS } from '@/constants';
import { NotiListDto } from '@/types';
import { instance } from './instance.request';

export const notiList = async () => await instance<null, NotiListDto>(PATHS.NOTIS);
