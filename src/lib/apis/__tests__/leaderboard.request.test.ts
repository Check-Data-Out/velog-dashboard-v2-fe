import { leaderboardList } from '../leaderboard.request';
import { PATHS } from '@/lib/constants/paths.constant';

jest.mock('../instance.request', () => ({
  instance: jest.fn(),
}));

import { instance } from '../instance.request';

const mockInstance = instance as jest.Mock;

describe('leaderboard.request', () => {
  beforeEach(() => {
    mockInstance.mockClear();
  });

  describe('leaderboardList', () => {
    const defaultParams = {
      based: 'users',
      sort: 'view',
      dateRange: '7',
      limit: '20',
    };

    it('모든 파라미터를 포함한 URL로 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({ users: [], posts: [] });

      await leaderboardList(defaultParams);

      expect(mockInstance).toHaveBeenCalledWith(
        `${PATHS.LEADERBOARD}/users?sort=view&dateRange=7&limit=20`,
      );
    });

    it('based가 posts일 때 올바른 URL을 생성해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({ users: [], posts: [] });

      await leaderboardList({ based: 'posts', sort: 'like', dateRange: '30', limit: '10' });

      expect(mockInstance).toHaveBeenCalledWith(
        `${PATHS.LEADERBOARD}/posts?sort=like&dateRange=30&limit=10`,
      );
    });

    it('instance의 반환값을 그대로 반환해야 한다', async () => {
      const mockData = { users: [{ rank: 1, username: 'user1' }] };
      mockInstance.mockResolvedValueOnce(mockData);

      const result = await leaderboardList(defaultParams);
      expect(result).toBe(mockData);
    });

    it('instance가 에러를 throw하면 전파되어야 한다', async () => {
      const mockError = new Error('API 오류');
      mockInstance.mockRejectedValueOnce(mockError);

      await expect(leaderboardList(defaultParams)).rejects.toThrow('API 오류');
    });
  });
});
