import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

const mockClose = jest.fn();

jest.mock('../../hooks/useModal', () => ({
  useModal: () => ({ close: mockClose }),
}));

jest.mock('../Icon', () => ({
  Icon: ({
    onClick,
    role,
    'aria-label': ariaLabel,
    className,
  }: React.HTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} role={role} aria-label={ariaLabel} className={className} />
  ),
}));

describe('Modal', () => {
  beforeEach(() => {
    mockClose.mockClear();
    document.body.style.overflow = '';
  });

  it('title을 렌더링해야 한다', () => {
    render(<Modal title="테스트 모달">내용</Modal>);
    expect(screen.getByText('테스트 모달')).toBeInTheDocument();
  });

  it('children을 렌더링해야 한다', () => {
    render(<Modal title="모달">모달 내용입니다</Modal>);
    expect(screen.getByText('모달 내용입니다')).toBeInTheDocument();
  });

  it('닫기 버튼이 렌더링되어야 한다', () => {
    render(<Modal title="모달">내용</Modal>);
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 close가 호출되어야 한다', () => {
    render(<Modal title="모달">내용</Modal>);
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('Escape 키 입력 시 close가 호출되어야 한다', () => {
    render(<Modal title="모달">내용</Modal>);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('Escape 외 키 입력 시 close가 호출되지 않아야 한다', () => {
    render(<Modal title="모달">내용</Modal>);
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('오버레이 클릭 시 close가 호출되어야 한다', () => {
    const { container } = render(<Modal title="모달">내용</Modal>);
    const overlay = container.firstChild as HTMLElement;
    fireEvent.mouseDown(overlay);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('모달 내부 클릭 시 close가 호출되지 않아야 한다', () => {
    render(<Modal title="모달">내용</Modal>);
    fireEvent.mouseDown(screen.getByText('모달'));
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('마운트 시 body overflow가 hidden으로 설정되어야 한다', () => {
    render(<Modal title="모달">내용</Modal>);
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
  });

  it('언마운트 시 body overflow가 복원되어야 한다', () => {
    const { unmount } = render(<Modal title="모달">내용</Modal>);
    unmount();
    expect(document.body).toHaveStyle({ overflow: '' });
  });

  it('언마운트 시 keydown 이벤트 리스너가 제거되어야 한다', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Modal title="모달">내용</Modal>);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('추가 className이 모달 컨텐츠에 적용되어야 한다', () => {
    const { container } = render(
      <Modal title="모달" className="custom-modal">
        내용
      </Modal>,
    );
    const innerModal = container.querySelector('.custom-modal');
    expect(innerModal).toBeInTheDocument();
  });

  it('마운트 전 body overflow가 이미 hidden이었어도 언마운트 시 복원되어야 한다', () => {
    document.body.style.overflow = 'hidden';
    const { unmount } = render(<Modal title="모달">내용</Modal>);
    unmount();
    // 언마운트 후 overflow가 빈 문자열로 복원됨
    expect(document.body).toHaveStyle({ overflow: '' });
  });
});
