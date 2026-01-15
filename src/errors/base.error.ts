export interface IBaseError {
  getToastMessage: () => string;
}

interface IBaseProp {
  message: string;
  shouldCaptureException?: boolean;
}

export class BaseError extends Error {
  shouldCaptureException: boolean;

  constructor({ message, shouldCaptureException = true }: IBaseProp) {
    super(message);
    this.name = this.constructor.name;
    this.shouldCaptureException = shouldCaptureException;
  }
}
