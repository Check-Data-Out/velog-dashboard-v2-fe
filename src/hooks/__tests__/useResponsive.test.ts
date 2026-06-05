import { renderHook, act } from '@testing-library/react';
import { useResponsive } from '../useResponsive';

describe('useResponsive', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('마운트 후 window.innerWidth 값을 반환해야 한다', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });

    const { result } = renderHook(() => useResponsive());

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toBe(1280);
  });

  it('초기 렌더링 시 기본값 1024를 반환해야 한다', () => {
    const { result } = renderHook(() => useResponsive());
    expect(result.current).toBe(1024);
  });

  it('resize 이벤트 후 업데이트된 너비를 반환해야 한다', () => {
    const { result } = renderHook(() => useResponsive());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(15);
    });

    expect(result.current).toBe(768);
  });

  it('resize 이벤트가 debounce 시간(10ms) 이전에는 적용되지 않아야 한다', () => {
    const { result } = renderHook(() => useResponsive());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(5);
    });

    expect(result.current).not.toBe(375);
  });

  it('연속적인 resize 이벤트는 마지막 값만 반영해야 한다 (debounce)', () => {
    const { result } = renderHook(() => useResponsive());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(5);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(15);
    });

    expect(result.current).toBe(600);
  });

  it('언마운트 시 resize 이벤트 리스너가 제거되어야 한다', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useResponsive());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
