import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Summary } from '..';

jest.mock('../../../../hooks/useModal', () => ({ useModal: () => ({ open: jest.fn() }) }));

const stats = { totalViews: 2500, yesterdayViews: 180, totalLikes: 100, yesterdayLikes: 90 };

describe('Summary', () => {
  it('사이드바와 모바일 요약에 같은 증가분(오늘 - 어제)을 보여 준다', async () => {
    render(<Summary totalPostCount={12} yesterdayPostCount={10} stats={stats as never} />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveTextContent('2,320↑');
    expect(sidebar).toHaveTextContent('10↑');
    expect(sidebar).toHaveTextContent('2↑');

    await userEvent.click(screen.getByText('요약 정보 펼치기'));
    // 사이드바도 같은 값을 보여 주므로 뒤에 그려지는 모바일 요약의 값을 본다
    expect(screen.getAllByText('2,500회').at(-1)).toHaveAttribute('data-increasement', '2,320');
    expect(screen.getAllByText('100개').at(-1)).toHaveAttribute('data-increasement', '10');
    expect(screen.getAllByText('12개').at(-1)).toHaveAttribute('data-increasement', '2');
  });

  it('어제 값이 없으면 증가분을 표시하지 않는다', () => {
    render(<Summary totalPostCount={12} stats={{ totalViews: 2500 } as never} />);

    expect(screen.getByRole('complementary')).not.toHaveTextContent('↑');
  });
});
