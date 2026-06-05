import {
  FetchResponseError,
  FetchError,
  AuthRequiredError,
  TimeoutError,
  ExceededRateLimitError,
} from '@/lib/errors/fetch.error';
import { errorHandler } from '../error.util';

const mockWithScope = jest.fn();
const mockCaptureException = jest.fn();
const mockToastError = jest.fn();

jest.mock('@sentry/nextjs', () => ({
  withScope: (cb: (scope: unknown) => void) => {
    mockWithScope(cb);
    cb({ setContext: jest.fn() });
  },
  captureException: (...args: unknown[]) => mockCaptureException(...args),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const mockOptions = { url: '/api/test', method: 'GET' };

const flushMicrotasks = async () => Promise.resolve();

describe('errorHandler', () => {
  beforeEach(() => {
    mockWithScope.mockClear();
    mockCaptureException.mockClear();
    mockToastError.mockClear();
  });

  describe('알 수 없는 오류 타입', () => {
    it('일반 Error에 대해 true를 반환해야 한다', () => {
      expect(errorHandler(new Error('일반 오류'))).toBe(true);
    });

    it('문자열에 대해 true를 반환해야 한다', () => {
      expect(errorHandler('오류 문자열')).toBe(true);
    });

    it('null에 대해 true를 반환해야 한다', () => {
      expect(errorHandler(null)).toBe(true);
    });

    it('일반 오류에서는 Sentry가 호출되지 않아야 한다', () => {
      errorHandler(new Error('오류'));
      expect(mockCaptureException).not.toHaveBeenCalled();
    });

    it('일반 오류에서는 toast가 호출되지 않아야 한다', async () => {
      errorHandler(new Error('오류'));
      await flushMicrotasks();
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });

  describe('AuthRequiredError', () => {
    it('false를 반환해야 한다', () => {
      const error = new AuthRequiredError(mockOptions);
      expect(errorHandler(error)).toBe(false);
    });

    it('Sentry가 호출되지 않아야 한다', () => {
      const error = new AuthRequiredError(mockOptions);
      errorHandler(error);
      expect(mockCaptureException).not.toHaveBeenCalled();
    });

    it('toast가 호출되지 않아야 한다 (조기 반환)', async () => {
      const error = new AuthRequiredError(mockOptions);
      errorHandler(error);
      await flushMicrotasks();
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });

  describe('FetchResponseError (shouldCaptureException: true)', () => {
    it('false를 반환해야 한다', () => {
      const error = new FetchResponseError({
        message: '서버 오류',
        options: mockOptions,
        code: 500,
      });
      expect(errorHandler(error)).toBe(false);
    });

    it('Sentry captureException이 호출되어야 한다', () => {
      const error = new FetchResponseError({
        message: '서버 오류',
        options: mockOptions,
        code: 500,
      });
      errorHandler(error);
      expect(mockCaptureException).toHaveBeenCalledWith(error);
    });

    it('toast.error가 호출되어야 한다', async () => {
      const error = new FetchResponseError({
        message: '서버 오류',
        options: mockOptions,
        code: 500,
      });
      errorHandler(error);
      await flushMicrotasks();
      expect(mockToastError).toHaveBeenCalledWith(
        error.getToastMessage(),
        expect.objectContaining({ toastId: error.name }),
      );
    });
  });

  describe('FetchResponseError (shouldCaptureException: false)', () => {
    it('false를 반환해야 한다', () => {
      const error = new ExceededRateLimitError(mockOptions);
      expect(errorHandler(error)).toBe(false);
    });

    it('Sentry가 호출되지 않아야 한다', () => {
      const error = new ExceededRateLimitError(mockOptions);
      errorHandler(error);
      expect(mockCaptureException).not.toHaveBeenCalled();
    });

    it('toast.error는 호출되어야 한다', async () => {
      const error = new ExceededRateLimitError(mockOptions);
      errorHandler(error);
      await flushMicrotasks();
      expect(mockToastError).toHaveBeenCalled();
    });
  });

  describe('TimeoutError (FetchError, shouldCaptureException: true)', () => {
    it('false를 반환해야 한다', () => {
      const error = new TimeoutError();
      expect(errorHandler(error)).toBe(false);
    });

    it('Sentry captureException이 호출되어야 한다', () => {
      const error = new TimeoutError();
      errorHandler(error);
      expect(mockCaptureException).toHaveBeenCalledWith(error);
    });

    it('toast.error가 호출되어야 한다', async () => {
      const error = new TimeoutError();
      errorHandler(error);
      await flushMicrotasks();
      expect(mockToastError).toHaveBeenCalled();
    });
  });

  describe('FetchError (shouldCaptureException: false)', () => {
    it('false를 반환해야 한다', () => {
      const error = new FetchError({ message: '네트워크 오류' });
      expect(errorHandler(error)).toBe(false);
    });

    it('Sentry가 호출되지 않아야 한다', () => {
      const error = new FetchError({ message: '네트워크 오류' });
      errorHandler(error);
      expect(mockCaptureException).not.toHaveBeenCalled();
    });

    it('toast.error가 호출되어야 한다', async () => {
      const error = new FetchError({ message: '네트워크 오류' });
      errorHandler(error);
      await flushMicrotasks();
      expect(mockToastError).toHaveBeenCalled();
    });
  });
});
