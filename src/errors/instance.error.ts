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
    shouldCaptureException?: boolean,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.shouldCaptureException = shouldCaptureException;
  }
}
