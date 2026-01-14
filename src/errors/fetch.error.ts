import { CustomError } from './instance.error';

export class TimeoutError extends CustomError {
  constructor() {
    super('Request Timed Out', 'RequestTimedOut', 500);
  }
}

export class ServerNotRespondingError extends CustomError {
  constructor() {
    super('잠시 후 다시 시도해 주세요', 'ServerNotResponding', 500);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, code: string) {
    super(message, code, 400);
  }
}

export class ExceededRateLimitError extends CustomError {
  constructor() {
    super(
      '비정상적 접근이 감지되었습니다. 잠시 후 다시 시도해주세요.',
      'ExceededRateLimitError',
      429,
      false,
    );
  }
}
export class EnvNotFoundError extends CustomError {
  constructor(message: string) {
    super(`${message}이(가) ENV에서 설정되지 않았습니다`, 'EnvNotFoundError', 500, false);
  }
}
