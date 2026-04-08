import { login, me, logout, sampleLogin, createQRToken, badge } from '../user.request';
import { PATHS } from '@/lib/constants/paths.constant';

jest.mock('../instance.request', () => ({
  instance: jest.fn(),
}));

import { instance } from '../instance.request';

const mockInstance = instance as jest.Mock;

describe('user.request', () => {
  beforeEach(() => {
    mockInstance.mockClear();
  });

  describe('login', () => {
    it('POST 메서드로 로그인 엔드포인트를 호출해야 한다', async () => {
      const body = { accessToken: 'access-abc', refreshToken: 'refresh-xyz' };
      mockInstance.mockResolvedValueOnce(undefined);

      await login(body);

      expect(mockInstance).toHaveBeenCalledWith(PATHS.LOGIN, { method: 'POST', body });
    });

    it('instance의 반환값을 그대로 반환해야 한다', async () => {
      const mockResponse = { success: true };
      mockInstance.mockResolvedValueOnce(mockResponse);

      const result = await login({ accessToken: 'access-abc', refreshToken: 'refresh-xyz' });
      expect(result).toBe(mockResponse);
    });
  });

  describe('me', () => {
    it('GET 메서드로 /me 엔드포인트를 호출해야 한다', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      mockInstance.mockResolvedValueOnce(mockUser);

      const result = await me();

      expect(mockInstance).toHaveBeenCalledWith(PATHS.ME);
      expect(result).toBe(mockUser);
    });
  });

  describe('logout', () => {
    it('POST 메서드로 로그아웃 엔드포인트를 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce(undefined);

      await logout();

      expect(mockInstance).toHaveBeenCalledWith(PATHS.LOGOUT, { method: 'POST', body: undefined });
    });
  });

  describe('sampleLogin', () => {
    it('POST 메서드로 샘플 로그인 엔드포인트를 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce(undefined);

      await sampleLogin();

      expect(mockInstance).toHaveBeenCalledWith(PATHS.SAMPLELOGIN, { method: 'POST' });
    });
  });

  describe('createQRToken', () => {
    it('POST 메서드로 QR 로그인 엔드포인트를 호출해야 한다', async () => {
      const mockToken = { token: 'qr-token-abc' };
      mockInstance.mockResolvedValueOnce(mockToken);

      const result = await createQRToken();

      expect(mockInstance).toHaveBeenCalledWith(PATHS.QRLOGIN, { method: 'POST' });
      expect(result).toBe(mockToken);
    });
  });

  describe('badge', () => {
    it('username을 포함한 배지 엔드포인트를 GET으로 호출해야 한다', async () => {
      const mockBadge = { views: 1000, likes: 50, posts: 10 };
      mockInstance.mockResolvedValueOnce(mockBadge);

      const result = await badge('testuser');

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.TOTALSTATS}/testuser/badge`, {
        method: 'GET',
      });
      expect(result).toBe(mockBadge);
    });

    it('다른 username으로도 올바른 URL을 생성해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await badge('another-user');

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.TOTALSTATS}/another-user/badge`, {
        method: 'GET',
      });
    });
  });

  describe('에러 전파', () => {
    it('login — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('인증 오류'));
      await expect(login({ accessToken: 'a', refreshToken: 'r' })).rejects.toThrow('인증 오류');
    });

    it('me — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('세션 만료'));
      await expect(me()).rejects.toThrow('세션 만료');
    });

    it('logout — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('네트워크 오류'));
      await expect(logout()).rejects.toThrow('네트워크 오류');
    });

    it('sampleLogin — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('서버 오류'));
      await expect(sampleLogin()).rejects.toThrow('서버 오류');
    });

    it('createQRToken — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('QR 토큰 발급 실패'));
      await expect(createQRToken()).rejects.toThrow('QR 토큰 발급 실패');
    });

    it('badge — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('사용자 없음'));
      await expect(badge('unknown')).rejects.toThrow('사용자 없음');
    });
  });
});
