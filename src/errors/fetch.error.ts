import { CustomError } from './instance.error';

export class TimeoutError extends CustomError {
  constructor() {
    super('Request Timed Out', 'RequestTimedOut');
  }
}

export class ServerNotRespondingError extends CustomError {
  constructor() {
    super('잠시 후 다시 시도해 주세요', 'ServerNotResponding');
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, code: string) {
    super(message, code, 400);
  }
}
