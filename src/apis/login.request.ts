import { NotFoundError } from '@/errors';
import { LoginVo } from '@/types';
import { instance } from '.';

export const login = async (body: LoginVo) =>
  await instance(
    '/login',
    { method: 'POST', body },
    {
      '404': new NotFoundError(
        '일치하는 계정을 찾을 수 없습니다',
        'CannotFindAccount',
      ),
    },
  );
