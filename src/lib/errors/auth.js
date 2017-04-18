import {BaseError} from './base';

export class AuthenticationError extends BaseError {}

export class IncorrectUsernameError extends AuthenticationError {
  constructor(message = 'User was not found') {
    super(message);
  }
}

export class IncorrectPasswordError extends AuthenticationError {
  constructor(message = 'Provided password is incorrect') {
    super(message);
  }
}

