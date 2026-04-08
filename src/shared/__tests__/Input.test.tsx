import { render, screen } from '@testing-library/react';
import React from 'react';
import { Input } from '../Input';

describe('Input', () => {
  it('input 요소를 렌더링해야 한다', () => {
    render(<Input size="SMALL" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('기본 form이 LARGE여야 한다', () => {
    render(<Input size="SMALL" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('p-4');
  });

  it('form="SMALL"일 때 SMALL 스타일이 적용되어야 한다', () => {
    render(<Input form="SMALL" size="SMALL" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('p-2');
    expect(input).toHaveClass('h-[36px]');
  });

  it('size="FULL"일 때 w-[100%] 스타일이 적용되어야 한다', () => {
    render(<Input size="FULL" />);
    expect(screen.getByRole('textbox')).toHaveClass('w-[100%]');
  });

  it('size="LARGE"일 때 w-[400px] 스타일이 적용되어야 한다', () => {
    render(<Input size="LARGE" />);
    expect(screen.getByRole('textbox')).toHaveClass('w-[400px]');
  });

  it('size="SMALL"일 때 w-[100px] 스타일이 적용되어야 한다', () => {
    render(<Input size="SMALL" />);
    expect(screen.getByRole('textbox')).toHaveClass('w-[100px]');
  });

  it('placeholder가 data-placeholder 속성으로 설정되어야 한다', () => {
    render(<Input size="SMALL" placeholder="검색어를 입력하세요" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-placeholder', '검색어를 입력하세요');
  });

  it('disabled 상태일 때 비활성화되어야 한다', () => {
    render(<Input size="SMALL" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('disabled 스타일이 적용되어야 한다', () => {
    render(<Input size="SMALL" disabled />);
    expect(screen.getByRole('textbox')).toHaveClass('disabled:cursor-not-allowed');
  });

  it('추가 className이 병합되어야 한다', () => {
    render(<Input size="SMALL" className="extra-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('extra-class');
  });

  it('ref를 올바르게 전달해야 한다', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input size="SMALL" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('displayName이 "Input"이어야 한다', () => {
    expect(Input.displayName).toBe('Input');
  });

  it('나머지 HTML 속성들이 전달되어야 한다', () => {
    render(<Input size="SMALL" type="text" name="username" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'username');
  });
});
