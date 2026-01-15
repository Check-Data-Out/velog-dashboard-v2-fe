import { BaseError } from './base.error';

// TODO: Runtime이라는 이름이 어색함, 사실상 개발환경 전용 오류라 바꿀 필요가 있음

export class RuntimeError extends BaseError {
  constructor(message: string) {
    super({ message, shouldCaptureException: false });
  }
}

export class EnvNotFoundError extends RuntimeError {
  constructor(message: string) {
    super(`${message}이(가) ENV에서 설정되지 않았습니다`);
  }
}

export class ParentNotFoundError extends RuntimeError {
  constructor() {
    super('컴파운드 형태의 컴포넌트는 부모 컴포넌트 아래에서만 사용해야 합니다');
  }
}
