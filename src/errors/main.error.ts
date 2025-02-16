import { CustomError } from './instance.error';

export class UserNameNotFound extends CustomError {
  constructor() {
    super('username not found', 'UserNameNotFound');
  }
}
