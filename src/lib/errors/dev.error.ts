import { BaseError } from './base.error';

export class DevError extends BaseError {
  constructor(message: string) {
    super({ message, shouldCaptureException: false });
  }
}

export class EnvNotFoundError extends DevError {
  constructor(message: string) {
    super(`${message}이(가) ENV에서 설정되지 않았습니다`);
  }
}

export class ParentNotFoundError extends DevError {
  constructor() {
    super('컴파운드 형태의 컴포넌트는 부모 컴포넌트 아래에서만 사용해야 합니다');
  }
}
