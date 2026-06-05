import { PATHS } from '@/lib/constants/paths.constant';
import { instance } from '../instance.request';
import { notiList } from '../notice.request';

jest.mock('../instance.request', () => ({
  instance: jest.fn(),
}));

const mockInstance = instance as jest.Mock;

describe('notice.request', () => {
  beforeEach(() => {
    mockInstance.mockClear();
  });

  describe('notiList', () => {
    it('올바른 엔드포인트를 호출해야 한다', async () => {
      mockInstance.mockResolvedValueOnce([]);

      await notiList();

      expect(mockInstance).toHaveBeenCalledWith(PATHS.NOTIS);
      expect(mockInstance).toHaveBeenCalledTimes(1);
    });

    it('instance의 반환값을 그대로 반환해야 한다', async () => {
      const mockData = [{ id: 1, title: '공지사항', content: '내용' }];
      mockInstance.mockResolvedValueOnce(mockData);

      const result = await notiList();
      expect(result).toBe(mockData);
    });

    it('instance가 에러를 throw하면 전파되어야 한다', async () => {
      const mockError = new Error('네트워크 오류');
      mockInstance.mockRejectedValueOnce(mockError);

      await expect(notiList()).rejects.toThrow('네트워크 오류');
    });
  });
});
