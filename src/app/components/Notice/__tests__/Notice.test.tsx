import { captureException } from '@sentry/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { instance } from '@/lib/apis/instance.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { FetchResponseError } from '@/lib/errors/fetch.error';
import { errorHandler } from '@/lib/utils/error.util';
import { Notice } from '..';

jest.mock('../../../../lib/apis/instance.request', () => ({
  instance: jest.fn(),
}));

const mockScope = { setContext: jest.fn(), setTags: jest.fn() };

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  withScope: (cb: (scope: typeof mockScope) => void) => cb(mockScope),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('../../../../hooks/useModal', () => ({
  useModal: () => ({ open: jest.fn() }),
}));

const mockInstance = instance as jest.Mock;
const mockCaptureException = captureException as jest.Mock;
const mockToastError = toast.error as unknown as jest.Mock;

const notiOptions = { url: '/api/notis', method: 'GET' };

// 앱 QueryClient 와 같은 오류 정책(throwOnError: errorHandler)을 쓴다.
// 공지 쿼리 옵션이 이 기본값을 덮어쓰지 않으면 조회 실패가 렌더 오류로 번지는 조건이다.
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
    mockToastError.mockClear();
    mockScope.setContext.mockClear();
    mockScope.setTags.mockClear();
  });

  describe('공지 조회가 실패해도 페이지를 깨뜨리지 않고, 처리되지 않은 오류와 5xx 만 토스트 없이 보고해야 한다', () => {
    it('네트워크 단절(TypeError)이면 형제 노드를 유지하고 notice 태그로 1회 보고한다', async () => {
      const error = new TypeError('Failed to fetch');
      mockInstance.mockRejectedValue(error);

      mountNotice();

      await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(1));
      expect(mockCaptureException).toHaveBeenCalledWith(error);
      expect(mockScope.setTags).toHaveBeenCalledWith({ feature: 'notice' });
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(mockToastError).not.toHaveBeenCalled();
    });

    it('5xx 응답이면 요청 컨텍스트(API Data)와 notice 태그를 붙여 보고한다', async () => {
      const error = new FetchResponseError({
        message: '서버 오류',
        options: notiOptions,
        code: 500,
      });
      mockInstance.mockRejectedValue(error);

      mountNotice();

      await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(1));
      expect(mockCaptureException).toHaveBeenCalledWith(error);
      expect(mockScope.setContext).toHaveBeenCalledWith('API Data', notiOptions);
      expect(mockScope.setTags).toHaveBeenCalledWith({ feature: 'notice' });
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(mockToastError).not.toHaveBeenCalled();
    });

    it('4xx 응답이면 형제 노드를 유지하고 Sentry 보고도 토스트도 하지 않는다', async () => {
      mockInstance.mockRejectedValue(
        new FetchResponseError({ message: '없음', options: notiOptions, code: 404 }),
      );

      const client = mountNotice();

      await waitFor(() => expect(client.getQueryState(queryKeys.notis())?.status).toBe('error'));
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(mockCaptureException).not.toHaveBeenCalled();
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });
});
