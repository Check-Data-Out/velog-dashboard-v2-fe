interface ICustomError {
  name: string;
  message: string;
  code: string;
  statusCode?: number;
}

export class CustomError extends Error implements ICustomError {
  code: string;
  statusCode?: number;
  shouldCaptureException?: boolean;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    // 현재 api 인스턴스 코드에서 오류가 발생할 경우 무조건 sentry에 오류를 전송하도록 되어있음
    // 그러나 일부 오류의 경우 sentry에 알릴 필요 없이 단순 클라이언트 측에만 노출해야 하는 경우가 있는데, 해당 값으로 이를 구분하도록 구현했음
    // (ex: 새로고침이 완료되지 않은 상태에서 새로고침을 누를 경우 409 오류 발생, 그러나 이는 의도된 오류이므로 Sentry에 전송할 필요 없음)
    shouldCaptureException: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.shouldCaptureException = shouldCaptureException;
  }
}
