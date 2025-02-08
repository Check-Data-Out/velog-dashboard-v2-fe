import { NotFoundError } from '@/errors';
import { PATHS } from '@/constants';
import { LoginVo, UserDto } from '@/types';
import { InitType, instance } from './instance.request';

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

export const me = async (props: InitType<UserDto>) =>
  await instance<null, UserDto>(PATHS.ME, props);

export const logout = async () =>
  await instance(PATHS.LOGOUT, { method: 'POST', body: undefined });

export const sampleLogin = async () =>
  await instance(PATHS.SAMPLELOGIN, { method: 'POST' });
