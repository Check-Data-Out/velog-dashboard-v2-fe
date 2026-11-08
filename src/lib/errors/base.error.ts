interface IBaseProp {
  message: string;
  shouldCaptureException?: boolean;
}

export class BaseError extends Error {
  // 운영 번들은 클래스 이름을 지우므로(constructor.name 이 빈 문자열) 클래스마다 이름을 문자열로 적는다
  name = 'BaseError';
  shouldCaptureException: boolean;

  constructor({ message, shouldCaptureException = true }: IBaseProp) {
    super(message);
    this.shouldCaptureException = shouldCaptureException;
  }
}
