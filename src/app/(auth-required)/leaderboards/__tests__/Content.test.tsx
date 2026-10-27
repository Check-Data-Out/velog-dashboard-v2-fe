import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { leaderboardList } from '@/lib/apis/leaderboard.request';
import { Content } from '../Content';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('../../../../lib/apis/leaderboard.request', () => ({
  leaderboardList: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.Mock;

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const ui = () => (
  <QueryClientProvider client={queryClient}>
    <Content />
  </QueryClientProvider>
);

describe('리더보드 Content', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn() });
    (usePathname as jest.Mock).mockReturnValue('/leaderboards');
    (leaderboardList as jest.Mock).mockResolvedValue({ users: [], posts: [] });
  });

  it('URL 조건으로 바로 들어오면 드롭다운이 그 조건을 보여 준다', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('based=post&sort=likeCount&dateRange=7&limit=30'),
    );

    render(ui());

    const [based, sort, limit, dateRange] = screen.getAllByRole('combobox');
    expect(based).toHaveDisplayValue('게시글 기준');
    expect(sort).toHaveDisplayValue('좋아요 증가순');
    expect(limit).toHaveDisplayValue('30위까지');
    expect(dateRange).toHaveDisplayValue('지난 7일');
  });

  it('뒤로 가기로 URL 만 바뀌어도 드롭다운이 바뀐 조건을 보여 준다', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('limit=30&dateRange=7'));
    const { rerender } = render(ui());

    mockUseSearchParams.mockReturnValue(new URLSearchParams('limit=10&dateRange=30'));
    rerender(ui());

    const [, , limit, dateRange] = screen.getAllByRole('combobox');
    expect(limit).toHaveDisplayValue('10위까지');
    expect(dateRange).toHaveDisplayValue('지난 30일');
  });
});
