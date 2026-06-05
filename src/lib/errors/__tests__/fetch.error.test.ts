import { BaseError } from '../base.error';
import {
  FetchResponseError,
  FetchError,
  AuthRequiredError,
  TimeoutError,
  ExceededRateLimitError,
  UnknownError,
  NotFoundError,
} from '../fetch.error';

const mockOptions = { url: '/api/test', method: 'GET' };

describe('FetchResponseError', () => {
  it('BaseError를 상속해야 한다', () => {
    const error = new FetchResponseError({ message: '오류', options: mockOptions, code: 400 });
    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(Error);
  });

  it('code와 options를 올바르게 설정해야 한다', () => {
    const error = new FetchResponseError({ message: '오류', options: mockOptions, code: 422 });
    expect(error.code).toBe(422);
    expect(error.options).toBe(mockOptions);
    expect(error.message).toBe('오류');
  });

  it('5xx 에러에서 shouldCaptureException이 true여야 한다', () => {
    const error500 = new FetchResponseError({
      message: '서버 오류',
      options: mockOptions,
      code: 500,
    });
    expect(error500.shouldCaptureException).toBe(true);

    const error503 = new FetchResponseError({
      message: '서버 오류',
      options: mockOptions,
      code: 503,
    });
    expect(error503.shouldCaptureException).toBe(true);
  });

  it('4xx 에러에서 shouldCaptureException이 false여야 한다', () => {
    const error404 = new FetchResponseError({ message: '없음', options: mockOptions, code: 404 });
    expect(error404.shouldCaptureException).toBe(false);

    const error429 = new FetchResponseError({
      message: '요청 제한',
      options: mockOptions,
      code: 429,
    });
    expect(error429.shouldCaptureException).toBe(false);
  });

  it('getToastMessage가 "메시지 (코드)" 형식을 반환해야 한다', () => {
    const error = new FetchResponseError({ message: '서버 오류', options: mockOptions, code: 500 });
    expect(error.getToastMessage()).toBe('서버 오류 (500)');
  });

  it('name이 "FetchResponseError"여야 한다', () => {
    const error = new FetchResponseError({ message: '오류', options: mockOptions, code: 400 });
    expect(error.name).toBe('FetchResponseError');
  });
});

describe('FetchError', () => {
  it('BaseError를 상속해야 한다', () => {
    const error = new FetchError({ message: '네트워크 오류' });
    expect(error).toBeInstanceOf(BaseError);
  });

  it('메시지를 올바르게 설정해야 한다', () => {
    const error = new FetchError({ message: '연결 실패' });
    expect(error.message).toBe('연결 실패');
  });

  it('shouldCaptureException 기본값은 false여야 한다', () => {
    const error = new FetchError({ message: '오류' });
    expect(error.shouldCaptureException).toBe(false);
  });

  it('shouldCaptureException을 true로 설정할 수 있어야 한다', () => {
    const error = new FetchError({ message: '오류', shouldCaptureException: true });
    expect(error.shouldCaptureException).toBe(true);
  });

  it('getToastMessage가 "메시지 (이름)" 형식을 반환해야 한다', () => {
    const error = new FetchError({ message: '연결 실패' });
    expect(error.getToastMessage()).toBe('연결 실패 (FetchError)');
  });
});

describe('NotFoundError', () => {
  it('FetchResponseError를 상속해야 한다', () => {
    const error = new NotFoundError('찾을 수 없음', mockOptions);
    expect(error).toBeInstanceOf(FetchResponseError);
  });

  it('code가 404여야 한다', () => {
    const error = new NotFoundError('리소스를 찾을 수 없습니다', mockOptions);
    expect(error.code).toBe(404);
    expect(error.message).toBe('리소스를 찾을 수 없습니다');
    expect(error.options).toBe(mockOptions);
  });
});

describe('AuthRequiredError', () => {
  it('FetchResponseError를 상속해야 한다', () => {
    const error = new AuthRequiredError(mockOptions);
    expect(error).toBeInstanceOf(FetchResponseError);
  });

  it('code가 401이고 올바른 메시지를 가져야 한다', () => {
    const error = new AuthRequiredError(mockOptions);
    expect(error.code).toBe(401);
    expect(error.message).toBe('로그인이 필요합니다.');
    expect(error.options).toBe(mockOptions);
  });

  it('shouldCaptureException이 false여야 한다 (401 < 500)', () => {
    const error = new AuthRequiredError(mockOptions);
    expect(error.shouldCaptureException).toBe(false);
  });
});

describe('TimeoutError', () => {
  it('FetchError를 상속해야 한다', () => {
    const error = new TimeoutError();
    expect(error).toBeInstanceOf(FetchError);
  });

  it('올바른 메시지와 shouldCaptureException을 가져야 한다', () => {
    const error = new TimeoutError();
    expect(error.message).toBe('잠시 후 다시 시도해주세요.');
    expect(error.shouldCaptureException).toBe(true);
  });

  it('name이 "TimeoutError"여야 한다', () => {
    const error = new TimeoutError();
    expect(error.name).toBe('TimeoutError');
  });
});

describe('ExceededRateLimitError', () => {
  it('FetchResponseError를 상속해야 한다', () => {
    const error = new ExceededRateLimitError(mockOptions);
    expect(error).toBeInstanceOf(FetchResponseError);
  });

  it('code가 429이고 올바른 메시지를 가져야 한다', () => {
    const error = new ExceededRateLimitError(mockOptions);
    expect(error.code).toBe(429);
    expect(error.message).toBe('잠시 후 다시 시도해주세요.');
    expect(error.options).toBe(mockOptions);
  });

  it('shouldCaptureException이 false여야 한다 (429 < 500)', () => {
    const error = new ExceededRateLimitError(mockOptions);
    expect(error.shouldCaptureException).toBe(false);
  });
});

describe('UnknownError', () => {
  it('FetchResponseError를 상속해야 한다', () => {
    const error = new UnknownError(mockOptions, 422);
    expect(error).toBeInstanceOf(FetchResponseError);
  });

  it('전달받은 code와 고정 메시지를 가져야 한다', () => {
    const error = new UnknownError(mockOptions, 422);
    expect(error.code).toBe(422);
    expect(error.message).toBe('알 수 없는 오류가 발생했습니다.');
    expect(error.options).toBe(mockOptions);
  });

  it('5xx 코드에서 shouldCaptureException이 true여야 한다', () => {
    const error = new UnknownError(mockOptions, 502);
    expect(error.shouldCaptureException).toBe(true);
  });

  it('4xx 코드에서 shouldCaptureException이 false여야 한다', () => {
    const error = new UnknownError(mockOptions, 422);
    expect(error.shouldCaptureException).toBe(false);
  });
});
