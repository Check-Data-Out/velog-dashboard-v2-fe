import { BaseError } from './base.error';

export type fetchOptions = {
  url: string;
  method: string;
  body?: Record<string, unknown>; // GET/DELETE 메서드의 경우 body가 없을 수도 있음
};

interface IFetchResponseProp {
  message: string;
  options: fetchOptions;
  code: number;
}

export class FetchResponseError extends BaseError {
  options: fetchOptions;
  code: number;

  constructor({ message, options, code }: IFetchResponseProp) {
    super({ message, shouldCaptureException: code >= 500 }); // 서버 측 오류일 경우에만 capture
    this.code = code;
    this.options = options;
  }

  getToastMessage() {
    return `${this.message} (${this.code})`;
  }
}

interface IFetchProp {
  message: string;
  shouldCaptureException?: boolean;
}

export class FetchError extends BaseError {
  constructor({ message, shouldCaptureException = false }: IFetchProp) {
    super({ message, shouldCaptureException });
  }

  getToastMessage() {
    return `${this.message} (${this.name})`;
  }
}

export class NotFoundError extends FetchResponseError {
  constructor(message: string, options: fetchOptions) {
    super({ message, options, code: 404 });
  }
}

export class AuthRequiredError extends FetchResponseError {
  constructor(options: fetchOptions) {
    super({ message: '로그인이 필요합니다.', options, code: 401 });
  }
}

export class TimeoutError extends FetchError {
  constructor() {
    super({ message: '잠시 후 다시 시도해주세요.', shouldCaptureException: true });
  }
}

export class ExceededRateLimitError extends FetchResponseError {
  constructor(options: fetchOptions) {
    super({ message: '잠시 후 다시 시도해주세요.', options, code: 429 });
  }
}

export class UnknownError extends FetchResponseError {
  constructor(options: fetchOptions, code: number) {
    super({ message: '알 수 없는 오류가 발생했습니다.', options, code });
  }
}
