import { PATHS } from '@/constants';
import { BadgeDto, LoginVo, UserDto } from '@/types';
import { instance } from './instance.request';

export const login = async (body: LoginVo) => await instance(PATHS.LOGIN, { method: 'POST', body });

export const me = async () => await instance<null, UserDto>(PATHS.ME);

export const logout = async () => await instance(PATHS.LOGOUT, { method: 'POST', body: undefined });

export const sampleLogin = async () => await instance(PATHS.SAMPLELOGIN, { method: 'POST' });

export const createQRToken = async () =>
  await instance<null, { token: string }>(PATHS.QRLOGIN, { method: 'POST' });

export const badge = async (username: string) =>
  await instance<null, BadgeDto>(`${PATHS.TOTALSTATS}/${username}/badge`, { method: 'GET' });
