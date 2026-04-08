import { PATHS } from '@/lib/constants/paths.constant';
import { StatsAlreadyRefreshedError } from '@/lib/errors/api.error';
import { postList, postSummary, postDetail, totalStats, refreshStats } from '../dashboard.request';

jest.mock('../instance.request', () => ({
  instance: jest.fn(),
}));

import { instance } from '../instance.request';

const mockInstance = instance as jest.Mock;

describe('dashboard.request', () => {
  beforeEach(() => {
    mockInstance.mockClear();
  });

  describe('postList', () => {
    const sort = { asc: false, sort: 'view' };

    it('cursor 없이 올바른 URL로 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({ posts: [], cursor: null });

      await postList(sort);

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.POSTS}?asc=false&sort=view`);
    });

    it('cursor가 있을 때 URL에 cursor를 포함해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({ posts: [], cursor: null });

      await postList(sort, 'cursor-abc-123');

      expect(mockInstance).toHaveBeenCalledWith(
        `${PATHS.POSTS}?cursor=cursor-abc-123&asc=false&sort=view`,
      );
    });

    it('asc=true일 때 올바른 URL을 생성해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({ posts: [] });

      await postList({ asc: true, sort: 'like' });

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.POSTS}?asc=true&sort=like`);
    });

    it('instance의 반환값을 그대로 반환해야 한다', async () => {
      const mockData = { posts: [{ id: '1' }], cursor: 'next-cursor' };
      mockInstance.mockResolvedValueOnce(mockData);

      const result = await postList(sort);
      expect(result).toBe(mockData);
    });
  });

  describe('postSummary', () => {
    it('올바른 엔드포인트를 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await postSummary();

      expect(mockInstance).toHaveBeenCalledWith(PATHS.SUMMARY);
    });
  });

  describe('postDetail', () => {
    it('path, start, end를 포함한 URL로 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await postDetail('my-post-slug', '2025-01-01', '2025-01-07');

      expect(mockInstance).toHaveBeenCalledWith(
        `${PATHS.DETAIL}/my-post-slug?start=2025-01-01&end=2025-01-07`,
      );
    });

    it('다른 path와 날짜로도 올바른 URL을 생성해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await postDetail('another-post', '2024-12-01', '2024-12-31');

      expect(mockInstance).toHaveBeenCalledWith(
        `${PATHS.DETAIL}/another-post?start=2024-12-01&end=2024-12-31`,
      );
    });
  });

  describe('totalStats', () => {
    it('type과 기본 period(7)로 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await totalStats('view');

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.TOTALSTATS}?period=7&type=view`);
    });

    it('명시적인 period 값으로 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await totalStats('like', 30);

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.TOTALSTATS}?period=30&type=like`);
    });

    it('post 타입으로도 올바르게 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({});

      await totalStats('post', 14);

      expect(mockInstance).toHaveBeenCalledWith(`${PATHS.TOTALSTATS}?period=14&type=post`);
    });
  });

  describe('refreshStats', () => {
    it('POST 메서드로 stats-refresh 엔드포인트를 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce({ refreshed: true });

      await refreshStats();

      expect(mockInstance).toHaveBeenCalledWith(
        PATHS.REFRESHSTATS,
        { method: 'POST' },
        { 409: StatsAlreadyRefreshedError },
      );
    });

    it('instance의 반환값을 그대로 반환해야 한다', async () => {
      const mockData = { refreshed: true, updatedAt: '2025-01-01' };
      mockInstance.mockResolvedValueOnce(mockData);

      const result = await refreshStats();
      expect(result).toBe(mockData);
    });
  });

  describe('에러 전파', () => {
    it('postList — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('네트워크 오류'));
      await expect(postList({ asc: false, sort: 'view' })).rejects.toThrow('네트워크 오류');
    });

    it('postSummary — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('서버 오류'));
      await expect(postSummary()).rejects.toThrow('서버 오류');
    });

    it('postDetail — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('404 Not Found'));
      await expect(postDetail('slug', '2025-01-01', '2025-01-07')).rejects.toThrow('404 Not Found');
    });

    it('totalStats — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(new Error('타임아웃'));
      await expect(totalStats('view')).rejects.toThrow('타임아웃');
    });

    it('refreshStats — instance가 에러를 throw하면 전파되어야 한다', async () => {
      mockInstance.mockRejectedValueOnce(
        new StatsAlreadyRefreshedError({ url: '/api/stats-refresh', method: 'POST', body: {} }),
      );
      await expect(refreshStats()).rejects.toBeInstanceOf(StatsAlreadyRefreshedError);
    });
  });
});
