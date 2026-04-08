import { render, screen, fireEvent } from '@testing-library/react';
import { Check } from '../Check';

describe('Check', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('숨겨진 체크박스 인풋을 렌더링해야 한다', () => {
    const { container } = render(<Check checked={false} onChange={mockOnChange} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeInTheDocument();
  });

  it('label이 있을 때 렌더링해야 한다', () => {
    render(<Check checked={false} onChange={mockOnChange} label="공개 여부" />);
    expect(screen.getByText('공개 여부')).toBeInTheDocument();
  });

  it('label이 없을 때 렌더링하지 않아야 한다', () => {
    render(<Check checked={false} onChange={mockOnChange} />);
    expect(screen.queryByText('공개 여부')).not.toBeInTheDocument();
  });

  it('checked=true일 때 체크된 스타일이 적용되어야 한다', () => {
    const { container } = render(<Check checked={true} onChange={mockOnChange} label="테스트" />);
    const indicator = container.querySelector('[data-label="테스트"]') as HTMLElement;
    expect(indicator.className).toContain('border-PRIMARY-MAIN');
    expect(indicator.className).toContain('bg-PRIMARY-SUB');
  });

  it('checked=false일 때 미체크 스타일이 적용되어야 한다', () => {
    const { container } = render(<Check checked={false} onChange={mockOnChange} label="테스트" />);
    const indicator = container.querySelector('[data-label="테스트"]') as HTMLElement;
    expect(indicator.className).toContain('border-BORDER-SUB');
    expect(indicator.className).toContain('bg-BG-ALT');
  });

  it('체크박스 변경 시 onChange가 호출되어야 한다', () => {
    const { container } = render(<Check checked={false} onChange={mockOnChange} />);
    const label = container.querySelector('label') as HTMLLabelElement;
    fireEvent.click(label);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('direction="left"일 때 flex-row가 적용되어야 한다 (기본값)', () => {
    const { container } = render(<Check checked={false} onChange={mockOnChange} label="라벨" />);
    const label = container.querySelector('label') as HTMLElement;
    expect(label.className).toContain('flex-row');
  });

  it('direction="right"일 때 flex-row-reverse가 적용되어야 한다', () => {
    const { container } = render(
      <Check checked={false} onChange={mockOnChange} label="라벨" direction="right" />,
    );
    const label = container.querySelector('label') as HTMLElement;
    expect(label.className).toContain('flex-row-reverse');
  });

  it('checked 값이 인풋에 반영되어야 한다', () => {
    const { container } = render(<Check checked={true} onChange={mockOnChange} />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });
});
