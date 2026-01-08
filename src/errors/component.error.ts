import { CustomError } from './instance.error';

export class ParentNotFoundError extends CustomError {
  constructor() {
    super(
      '컴파운드 형태의 컴포넌트는 부모 컴포넌트 아래에서만 사용해야 합니다',
      'ParentNotFoundError',
      500,
      false,
    );
  }
}
