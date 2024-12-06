export class ServerNotRespondingError extends Error {
  constructor() {
    super('잠시 후 다시 시도해 주세요');
    this.name = 'ServerNotRespondingError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request Timed Out');
    this.name = 'TimeoutError';
  }
}
