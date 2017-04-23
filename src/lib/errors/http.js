import BaseError from './base';

export class HttpError extends BaseError {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }

  toJSON() {
    const obj = {
      name: this.name,
      status: this.status,
      message: this.message,
    };
    if (this.details) {
      obj.details = this.details;
    }
    return obj;
  }
}

const DEFAULT_FORBIDDEN_MESSAGE = 'Current resource either does not exist'
                                  + ' or not enough permissions for'
                                  + ' accessing the resource.';

export class ForbiddenError extends HttpError {

  constructor(message = DEFAULT_FORBIDDEN_MESSAGE, details = null) {
    super(message, 403, details);
  }
}

/**
 * @apiDefine UnauthorizedError
 *
 * @apiError (Error 401) {String} name Error name (UnauthorizedError)
 * @apiError (Error 401) {Number} status Error status (401)
 * @apiError (Error 401) {String} message Short message
 * @apiError (Error 401) {Object} details Error details
 *
 * @apiErrorExample Unauthorized
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "name": "UnauthorizedError",
 *       "status": 401,
 *       "message": "Authentication token is either invalid or expired.",
 *       "details": "No authorization token was found"
 *     }
 */
export class UnauthorizedError extends HttpError {
  constructor(message, details = null) {
    super(message, 401, details);
  }
}

export class BadRequestError extends HttpError {
  constructor(message, details = null) {
    super(message, 400, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message, details = null) {
    super(message, 404, details);
  }
}

export class ValidationError extends HttpError {}
