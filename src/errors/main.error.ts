import { CustomError } from './instance.error';

export class UserNameNotFoundError extends CustomError {
  constructor() {
    super('username not found', 'UserNameNotFound');
  }
}
