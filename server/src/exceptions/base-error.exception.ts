export enum HttpStatusCode {
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  CONFLICT = 409,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
};

class BaseError extends Error {
  public readonly name:          string;
  public readonly httpCode:      HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly error?:        Error | undefined;

  constructor(
    name:          string,
    httpCode:      HttpStatusCode,
    description:   string,
    isOperational: boolean,
    error?:        Error | undefined
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name =          name;
    this.httpCode =      httpCode;
    this.isOperational = isOperational;
    this.error =         error;

    Error.captureStackTrace(this);
  }
};

export default BaseError;