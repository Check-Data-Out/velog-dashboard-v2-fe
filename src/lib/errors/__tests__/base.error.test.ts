import { BaseError } from '../base.error';

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

  it('서브클래스의 name이 클래스명으로 설정되어야 한다', () => {
    class MyCustomError extends BaseError {
      constructor() {
        super({ message: '커스텀 오류' });
      }
    }
    const error = new MyCustomError();
    expect(error.name).toBe('MyCustomError');
    expect(error.message).toBe('커스텀 오류');
  });
});
