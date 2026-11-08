interface IBaseProp {
  message: string;
  shouldCaptureException?: boolean;
}

export class BaseError extends Error {
  // 운영 번들은 클래스 이름을 줄이거나 지운다(constructor.name 이 'c' 같은 한 글자이거나 빈 문자열). 그래서 이름을 문자열로 적는다
  // 새 오류 클래스도 name 을 적고 __tests__/base.error.test.ts 의 이름 유지 목록에 넣는다. 빠뜨리면 부모 이름을 물려받는다
  name = 'BaseError';
  shouldCaptureException: boolean;

  constructor({ message, shouldCaptureException = true }: IBaseProp) {
    super(message);
    this.shouldCaptureException = shouldCaptureException;
  }
}
