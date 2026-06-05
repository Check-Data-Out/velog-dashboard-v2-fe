import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('title을 렌더링해야 한다', () => {
    render(<EmptyState title="데이터가 없습니다" />);
    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument();
  });

  it('description을 렌더링해야 한다', () => {
    render(<EmptyState title="제목" description="상세 설명입니다" />);
    expect(screen.getByText('상세 설명입니다')).toBeInTheDocument();
  });

  it('description이 없을 때 렌더링하지 않아야 한다', () => {
    render(<EmptyState title="제목" />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('icon이 있을 때 렌더링해야 한다', () => {
    render(<EmptyState title="제목" icon={<span data-testid="icon">🔍</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('icon이 없을 때 icon 컨테이너를 렌더링하지 않아야 한다', () => {
    const { container } = render(<EmptyState title="제목" />);
    const iconContainer = container.querySelector('.text-TEXT-ALT.text-6xl');
    expect(iconContainer).not.toBeInTheDocument();
  });

  it('title과 description을 함께 렌더링할 수 있어야 한다', () => {
    render(<EmptyState title="검색 결과 없음" description="다른 키워드로 검색해보세요" />);
    expect(screen.getByText('검색 결과 없음')).toBeInTheDocument();
    expect(screen.getByText('다른 키워드로 검색해보세요')).toBeInTheDocument();
  });

  it('최소 높이 300px의 컨테이너를 렌더링해야 한다', () => {
    const { container } = render(<EmptyState title="제목" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('min-h-[300px]');
  });
});
