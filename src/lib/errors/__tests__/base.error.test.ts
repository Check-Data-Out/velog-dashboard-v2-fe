import { StatsAlreadyRefreshedError, VelogUnavailableError } from '../api.error';
import { BaseError } from '../base.error';
import { DevError, EnvNotFoundError, ParentNotFoundError } from '../dev.error';
import {
  AuthRequiredError,
  ExceededRateLimitError,
  FetchError,
  FetchResponseError,
  NotFoundError,
  TimeoutError,
  UnknownError,
} from '../fetch.error';

const options = { url: '/api/test', method: 'GET' };

describe('BaseError', () => {
  it('Error를 상속해야 한다', () => {
    const error = new BaseError({ message: '오류 발생' });
    expect(error).toBeInstanceOf(Error);
  });

  it('메시지를 올바르게 설정해야 한다', () => {
    const error = new BaseError({ message: '테스트 오류 메시지' });
    expect(error.message).toBe('테스트 오류 메시지');
  });

  it('name이 클래스명으로 설정되어야 한다', () => {
    const error = new BaseError({ message: '오류' });
    expect(error.name).toBe('BaseError');
  });

  it('shouldCaptureException 기본값은 true여야 한다', () => {
    const error = new BaseError({ message: '오류' });
    expect(error.shouldCaptureException).toBe(true);
  });

  it('shouldCaptureException을 false로 설정할 수 있어야 한다', () => {
    const error = new BaseError({ message: '오류', shouldCaptureException: false });
    expect(error.shouldCaptureException).toBe(false);
  });

  it('shouldCaptureException을 명시적으로 true로 설정할 수 있어야 한다', () => {
    const error = new BaseError({ message: '오류', shouldCaptureException: true });
    expect(error.shouldCaptureException).toBe(true);
  });

  // 운영 번들은 클래스를 이름 없이(`class extends ...`) 내보내 constructor.name 이 빈 문자열이 된다
  it.each<[string, object, () => Error]>([
    ['BaseError', BaseError, () => new BaseError({ message: '오류' })],
    [
      'FetchResponseError',
      FetchResponseError,
      () => new FetchResponseError({ message: '오류', options, code: 500 }),
    ],
    ['FetchError', FetchError, () => new FetchError({ message: '오류' })],
    ['NotFoundError', NotFoundError, () => new NotFoundError('없음', options)],
    ['AuthRequiredError', AuthRequiredError, () => new AuthRequiredError(options)],
    ['TimeoutError', TimeoutError, () => new TimeoutError()],
    ['ExceededRateLimitError', ExceededRateLimitError, () => new ExceededRateLimitError(options)],
    ['UnknownError', UnknownError, () => new UnknownError(options, 502)],
    [
      'StatsAlreadyRefreshedError',
      StatsAlreadyRefreshedError,
      () => new StatsAlreadyRefreshedError(options),
    ],
    ['VelogUnavailableError', VelogUnavailableError, () => new VelogUnavailableError(options)],
    ['DevError', DevError, () => new DevError('오류')],
    ['EnvNotFoundError', EnvNotFoundError, () => new EnvNotFoundError('KEY')],
    ['ParentNotFoundError', ParentNotFoundError, () => new ParentNotFoundError()],
  ])(
    '클래스 이름이 지워진 운영 빌드에서도 %s 의 name 이 유지되어야 한다',
    (expected, ErrorClass, create) => {
      Object.defineProperty(ErrorClass, 'name', { value: '' });
      try {
        expect(create().name).toBe(expected);
      } finally {
        Object.defineProperty(ErrorClass, 'name', { value: expected });
      }
    },
  );
});
