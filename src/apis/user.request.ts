import { NotFoundError } from '@/errors';
import { PATHS } from '@/constants';
import { LoginVo } from '@/types';
import { instance } from './instance.request';

export const login = async (body: LoginVo) =>
  await instance(
    PATHS.LOGIN,
    { method: 'POST', body },
    {
      '404': new NotFoundError(
        '일치하는 계정을 찾을 수 없습니다',
        'CannotFindAccount',
      ),
    },
  );

export const me = async () => await instance<null, any>(PATHS.ME);

export const logout = async () =>
  await instance(PATHS.LOGOUT, { method: 'POST', body: undefined });
