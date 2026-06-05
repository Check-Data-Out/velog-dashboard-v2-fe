import { BaseError } from '../base.error';
import { DevError, EnvNotFoundError, ParentNotFoundError } from '../dev.error';

describe('DevError', () => {
  it('BaseError를 상속해야 한다', () => {
    const error = new DevError('개발 오류');
    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(Error);
  });

  it('메시지를 올바르게 설정해야 한다', () => {
    const error = new DevError('잘못된 사용법');
    expect(error.message).toBe('잘못된 사용법');
  });

  it('shouldCaptureException이 false여야 한다 (개발 전용 오류)', () => {
    const error = new DevError('개발 오류');
    expect(error.shouldCaptureException).toBe(false);
  });

  it('name이 "DevError"여야 한다', () => {
    const error = new DevError('오류');
    expect(error.name).toBe('DevError');
  });
});

describe('EnvNotFoundError', () => {
  it('DevError를 상속해야 한다', () => {
    const error = new EnvNotFoundError('NEXT_PUBLIC_BASE_URL');
    expect(error).toBeInstanceOf(DevError);
  });

  it('올바른 형식의 메시지를 가져야 한다', () => {
    const error = new EnvNotFoundError('NEXT_PUBLIC_BASE_URL');
    expect(error.message).toBe('NEXT_PUBLIC_BASE_URL이(가) ENV에서 설정되지 않았습니다');
  });

  it('다른 환경변수명으로도 올바른 메시지를 생성해야 한다', () => {
    const error = new EnvNotFoundError('SOME_API_KEY');
    expect(error.message).toBe('SOME_API_KEY이(가) ENV에서 설정되지 않았습니다');
  });

  it('shouldCaptureException이 false여야 한다', () => {
    const error = new EnvNotFoundError('KEY');
    expect(error.shouldCaptureException).toBe(false);
  });

  it('name이 "EnvNotFoundError"여야 한다', () => {
    const error = new EnvNotFoundError('KEY');
    expect(error.name).toBe('EnvNotFoundError');
  });
});

describe('ParentNotFoundError', () => {
  it('DevError를 상속해야 한다', () => {
    const error = new ParentNotFoundError();
    expect(error).toBeInstanceOf(DevError);
  });

  it('올바른 고정 메시지를 가져야 한다', () => {
    const error = new ParentNotFoundError();
    expect(error.message).toBe(
      '컴파운드 형태의 컴포넌트는 부모 컴포넌트 아래에서만 사용해야 합니다',
    );
  });

  it('shouldCaptureException이 false여야 한다', () => {
    const error = new ParentNotFoundError();
    expect(error.shouldCaptureException).toBe(false);
  });

  it('name이 "ParentNotFoundError"여야 한다', () => {
    const error = new ParentNotFoundError();
    expect(error.name).toBe('ParentNotFoundError');
  });
});
