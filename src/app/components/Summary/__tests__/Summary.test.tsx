import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Summary } from '..';

jest.mock('../../../../hooks/useModal', () => ({ useModal: () => ({ open: jest.fn() }) }));

const stats = {
  totalViews: 2500,
  yesterdayViews: 180,
  totalLikes: 100,
  yesterdayLikes: 90,
  lastUpdatedDate: '2026-10-27T00:00:00Z',
};

describe('Summary', () => {
  it('사이드바와 모바일 요약에 같은 증가분(오늘 - 어제)을 보여 준다', async () => {
    render(<Summary totalPostCount={12} yesterdayPostCount={10} stats={stats} />);

    const sidebar = screen.getByRole('complementary');
    expect(within(sidebar).getByText('2,320↑')).toBeInTheDocument();
    expect(within(sidebar).getByText('10↑')).toBeInTheDocument();
    expect(within(sidebar).getByText('2↑')).toBeInTheDocument();

    await userEvent.click(screen.getByText('요약 정보 펼치기'));
    // 사이드바도 같은 값을 보여 주므로 뒤에 그려지는 모바일 요약의 값을 본다
    expect(screen.getAllByText('2,500회').at(-1)).toHaveAttribute('data-increasement', '2,320');
    expect(screen.getAllByText('100개').at(-1)).toHaveAttribute('data-increasement', '10');
    expect(screen.getAllByText('12개').at(-1)).toHaveAttribute('data-increasement', '2');
  });
});
