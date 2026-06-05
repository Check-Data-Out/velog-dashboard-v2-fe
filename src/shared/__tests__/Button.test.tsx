import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('children을 렌더링해야 한다', () => {
    render(<Button size="SMALL">클릭하세요</Button>);
    expect(screen.getByRole('button', { name: '클릭하세요' })).toBeInTheDocument();
  });

  it('기본 form이 SMALL이어야 한다', () => {
    render(<Button size="SMALL">버튼</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-5');
    expect(button).toHaveClass('h-8');
  });

  it('form="LARGE"일 때 LARGE 스타일이 적용되어야 한다', () => {
    render(
      <Button form="LARGE" size="FULL">
        버튼
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('py-4');
  });

  it('disabled 상태일 때 버튼이 비활성화되어야 한다', () => {
    render(
      <Button size="SMALL" disabled>
        버튼
      </Button>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disabled 스타일이 적용되어야 한다', () => {
    render(
      <Button size="SMALL" disabled>
        버튼
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('onClick 핸들러가 호출되어야 한다', () => {
    const handleClick = jest.fn();
    render(
      <Button size="SMALL" onClick={handleClick}>
        클릭
      </Button>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서는 onClick이 호출되지 않아야 한다', () => {
    const handleClick = jest.fn();
    render(
      <Button size="SMALL" disabled onClick={handleClick}>
        클릭
      </Button>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('추가 className이 병합되어야 한다', () => {
    render(
      <Button size="SMALL" className="extra-class">
        버튼
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('extra-class');
  });

  it('size 값이 className에 적용되어야 한다', () => {
    render(<Button size="FULL">버튼</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-[100%]');
  });
});
