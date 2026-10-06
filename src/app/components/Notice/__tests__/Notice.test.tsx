import { captureException } from '@sentry/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { instance } from '@/lib/apis/instance.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { FetchResponseError } from '@/lib/errors/fetch.error';
import { errorHandler } from '@/lib/utils/error.util';
import { Notice } from '..';

jest.mock('../../../../lib/apis/instance.request', () => ({
  instance: jest.fn(),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  withScope: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('../../../../hooks/useModal', () => ({
  useModal: () => ({ open: jest.fn() }),
}));

const mockInstance = instance as jest.Mock;
const mockCaptureException = captureException as jest.Mock;

// 앱과 같은 오류 정책(throwOnError: errorHandler)을 가진 클라이언트를 테스트마다 새로 만든다
const mountNotice = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, throwOnError: errorHandler } },
  });
  render(
    <QueryClientProvider client={client}>
      <Notice />
      <p role="status">sibling</p>
    </QueryClientProvider>,
  );
  return client;
};

describe('Notice', () => {
  beforeEach(() => {
    mockInstance.mockReset();
    mockCaptureException.mockClear();
  });

  describe('공지 조회가 실패해도 페이지를 깨뜨리지 않고 서버 오류만 Sentry 에 보고해야 한다', () => {
    it('네트워크 단절(TypeError)이면 형제 노드를 유지하고 notice 태그로 1회 보고한다', async () => {
      const error = new TypeError('Failed to fetch');
      mockInstance.mockRejectedValue(error);

      mountNotice();

      await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(1));
      expect(mockCaptureException).toHaveBeenCalledWith(error, { tags: { feature: 'notice' } });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('4xx 응답이면 형제 노드를 유지하고 Sentry 에 보고하지 않는다', async () => {
      mockInstance.mockRejectedValue(
        new FetchResponseError({
          message: '없음',
          options: { url: '/api/notis', method: 'GET' },
          code: 404,
        }),
      );

      const client = mountNotice();

      await waitFor(() => expect(client.getQueryState(queryKeys.notis())?.status).toBe('error'));
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(mockCaptureException).not.toHaveBeenCalled();
    });
  });
});
