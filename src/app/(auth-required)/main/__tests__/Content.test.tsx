import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { postList, postSummary, refreshStats, totalStats } from '@/lib/apis/dashboard.request';
import { me } from '@/lib/apis/user.request';
import { StatsAlreadyRefreshedError } from '@/lib/errors/api.error';
import { Content } from '../Content';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../../../lib/apis/dashboard.request', () => ({
  postList: jest.fn(),
  postSummary: jest.fn(),
  totalStats: jest.fn(),
  refreshStats: jest.fn(),
}));

jest.mock('../../../../lib/apis/user.request', () => ({
  me: jest.fn(),
}));

const REFRESH_WAIT_TIME = 5000;
const mockRefreshStats = refreshStats as jest.Mock;

// 409 응답. lastUpdatedAt 이 있으면 새로고침이 끝난 상태, 없으면 진행 중이다
const conflict = (lastUpdatedAt?: string) =>
  new StatsAlreadyRefreshedError({
    url: '/api/stats-refresh',
    method: 'POST',
    body: { data: lastUpdatedAt ? { lastUpdatedAt } : null },
  });

const renderContent = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>,
  );
};

const clickRefresh = async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await user.click(screen.getByRole('button', { name: '새로고침' }));
};

const waitNextCycle = async () =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(REFRESH_WAIT_TIME);
  });

describe('메인 Content 통계 새로고침', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn() });
    (usePathname as jest.Mock).mockReturnValue('/main');
    (postList as jest.Mock).mockResolvedValue({ posts: [], nextCursor: null });
    (postSummary as jest.Mock).mockResolvedValue(null);
    (totalStats as jest.Mock).mockResolvedValue([]);
    (me as jest.Mock).mockResolvedValue({ username: 'tester' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('새로고침이 시작되면 안내하고 버튼을 잠근 뒤 주기적으로 상태를 확인한다', async () => {
    mockRefreshStats.mockResolvedValue({});
    renderContent();

    await clickRefresh();

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('통계 새로고침이 시작되었습니다!'),
    );
    expect(screen.getByRole('button', { name: '새로고침' })).toBeDisabled();
    await waitNextCycle();
    expect(mockRefreshStats).toHaveBeenCalledTimes(2);
  });

  it('이미 최신 상태면 오류 토스트만 띄우고 다시 확인하지 않는다', async () => {
    mockRefreshStats.mockRejectedValue(conflict('2026-10-27T00:00:00Z'));
    renderContent();

    await clickRefresh();

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('통계가 최신 상태입니다. (409)'));
    await waitNextCycle();
    expect(mockRefreshStats).toHaveBeenCalledTimes(1);
  });

  it('다른 곳에서 새로고침이 진행 중이면 상태를 맞추고 주기적으로 확인한다', async () => {
    mockRefreshStats.mockRejectedValue(conflict());
    renderContent();

    await clickRefresh();

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('새로고침 실행 상태를 동기화하였습니다'),
    );
    expect(screen.getByRole('button', { name: '새로고침' })).toBeDisabled();
    await waitNextCycle();
    expect(mockRefreshStats).toHaveBeenCalledTimes(2);
  });

  it('확인 중 새로고침이 끝나면 완료를 알리고 통계를 다시 불러오며 버튼을 푼다', async () => {
    mockRefreshStats
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(conflict('2026-10-27T00:00:00Z'));
    renderContent();
    await waitFor(() => expect(postSummary).toHaveBeenCalledTimes(1));

    await clickRefresh();
    await waitNextCycle();

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('새로고침이 완료되었습니다!'));
    await waitFor(() => expect(postSummary).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('button', { name: '새로고침' })).toBeEnabled();
  });
});
