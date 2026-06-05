import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from '../CopyButton';

const mockWriteText = jest.fn();

beforeEach(() => {
  mockWriteText.mockClear();
  mockWriteText.mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText },
  });
});

describe('CopyButton', () => {
  describe('렌더링', () => {
    it('type="default"일 때 url 텍스트를 직접 표시해야 한다', () => {
      render(<CopyButton url="https://example.com" />);
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });

    it('type="code"일 때 code 태그 안에 url을 표시해야 한다', () => {
      render(<CopyButton url="npm install package" type="code" />);
      expect(screen.getByRole('button').querySelector('code')).toBeInTheDocument();
      expect(screen.getByText('npm install package')).toBeInTheDocument();
    });

    it('url이 없을 때 렌더링되어야 한다', () => {
      render(<CopyButton />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('클릭 동작', () => {
    it('클릭 시 navigator.clipboard.writeText가 호출되어야 한다', async () => {
      render(<CopyButton url="https://example.com" />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => expect(mockWriteText).toHaveBeenCalledWith('https://example.com'));
    });

    it('url이 없을 때 클릭해도 clipboard가 호출되지 않아야 한다', () => {
      render(<CopyButton />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('disabled 상태일 때 클릭해도 clipboard가 호출되지 않아야 한다', () => {
      render(<CopyButton url="https://example.com" disabled />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('disabled 상태일 때 버튼이 비활성화되어야 한다', () => {
      render(<CopyButton url="https://example.com" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('클릭 후 이미 클릭된 상태에서 다시 클릭해도 clipboard를 한 번만 호출해야 한다', async () => {
      render(<CopyButton url="https://example.com" />);

      fireEvent.click(screen.getByRole('button'));
      // 첫 번째 클릭의 async 핸들러가 완료되어 clicked=true가 될 때까지 대기
      await waitFor(() => expect(mockWriteText).toHaveBeenCalledTimes(1));

      // clicked=true인 상태에서 두 번째 클릭 → 1000ms reset timer 전이므로 guard 동작
      fireEvent.click(screen.getByRole('button'));

      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });
  });

  describe('클릭 후 상태 초기화', () => {
    it('1초 후 클릭 상태가 초기화되어야 한다', async () => {
      jest.useFakeTimers();

      render(<CopyButton url="https://example.com" />);

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(mockWriteText).toHaveBeenCalledTimes(1));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(mockWriteText).toHaveBeenCalledTimes(2));

      jest.useRealTimers();
    });
  });

  describe('스타일', () => {
    it('추가 className이 병합되어야 한다', () => {
      render(<CopyButton url="https://example.com" className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('클립보드 오류 처리', () => {
    it('clipboard.writeText가 실패해도 에러를 throw하지 않아야 한다', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('clipboard error'));

      render(<CopyButton url="https://example.com" />);

      fireEvent.click(screen.getByRole('button'));

      // 에러가 throw되지 않고 컴포넌트가 여전히 렌더링되어 있어야 함
      expect(await screen.findByRole('button')).toBeInTheDocument();
    });
  });

  describe('빈 문자열 url', () => {
    it('url이 빈 문자열일 때 clipboard가 호출되지 않아야 한다', () => {
      render(<CopyButton url="" />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockWriteText).not.toHaveBeenCalled();
    });
  });

  describe('언마운트 시 타이머 정리', () => {
    it('클릭 후 언마운트 시 타이머가 정리되어야 한다', async () => {
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(<CopyButton url="https://example.com" />);

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(mockWriteText).toHaveBeenCalledTimes(1));

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });
  });
});
