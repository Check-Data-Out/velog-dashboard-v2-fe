import { PATHS } from '@/lib/constants/paths.constant';
import { BadgeDto, LoginVo, QRLoginStatusDto, UserDto } from '@/lib/types/user.type';
import { instance } from './instance.request';

export const login = async (body: LoginVo) => await instance(PATHS.LOGIN, { method: 'POST', body });

export const me = async () => await instance<null, UserDto>(PATHS.ME);

export const logout = async () => await instance(PATHS.LOGOUT, { method: 'POST', body: undefined });

export const sampleLogin = async () => await instance(PATHS.SAMPLELOGIN, { method: 'POST' });

export const createQRToken = async () =>
  await instance<null, { token: string }>(PATHS.QRLOGIN, { method: 'POST' });

export const confirmQRLogin = async (token: string) =>
  await instance(PATHS.QRLOGIN_CONFIRM, { method: 'POST', body: { token } });

export const unsubscribeNewsletter = async (uid: string, sig: string) =>
  await instance(
    `${PATHS.NEWSLETTER_UNSUBSCRIBE}?uid=${encodeURIComponent(uid)}&sig=${encodeURIComponent(sig)}`,
    { method: 'POST' },
  );

export const getQRLoginStatus = async (token: string) =>
  await instance<null, QRLoginStatusDto>(
    `${PATHS.QRLOGIN_STATUS}?token=${encodeURIComponent(token)}`,
    { method: 'GET' },
  );

export const badge = async (username: string) =>
  await instance<null, BadgeDto>(`${PATHS.TOTALSTATS}/${username}/badge`, { method: 'GET' });
