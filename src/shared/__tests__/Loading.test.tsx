import { render, screen, act } from '@testing-library/react';
import { Loading } from '../Loading';

describe('Loading', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('초기 렌더링 시 "업데이트중"을 표시해야 한다', () => {
    render(<Loading />);
    expect(screen.getByText('업데이트중')).toBeInTheDocument();
  });

  it('500ms 후 "업데이트중."을 표시해야 한다', () => {
    render(<Loading />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('업데이트중.')).toBeInTheDocument();
  });

  it('1000ms 후 "업데이트중.."을 표시해야 한다', () => {
    render(<Loading />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('업데이트중..')).toBeInTheDocument();
  });

  it('1500ms 후 "업데이트중..."을 표시해야 한다', () => {
    render(<Loading />);
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText('업데이트중...')).toBeInTheDocument();
  });

  it('2000ms 후 "업데이트중"으로 순환해야 한다', () => {
    render(<Loading />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('업데이트중')).toBeInTheDocument();
  });

  it('언마운트 시 타이머가 정리되어야 한다', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<Loading />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
