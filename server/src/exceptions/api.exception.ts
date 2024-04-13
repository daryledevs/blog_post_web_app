import BaseError, { HttpStatusCode } from "./base-error.exception";

class ApiErrorException extends BaseError {
  public status: number;
  public message: string;
  public httpCode: HttpStatusCode;
  public isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(name, httpCode, description, isOperational);
    this.status = httpCode;
    this.message = description;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
  };

  public static HTTP401Error = (message: string): ApiErrorException => {
    return new ApiErrorException(
      "UNAUTHORIZED",
      HttpStatusCode.UNAUTHORIZED,
      message,
      true
    );
  };

  public static HTTP400Error = (message: string): ApiErrorException => {
    return new ApiErrorException(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      message,
      true
    );
  };

  public static HTTP404Error = (message: string): ApiErrorException => {
    return new ApiErrorException(
      "NOT FOUND",
      HttpStatusCode.NOT_FOUND,
      message,
      true
    );
  };

  public static HTTP403Error = (message: string): ApiErrorException => {
    return new ApiErrorException(
      "FORBIDDEN",
      HttpStatusCode.FORBIDDEN,
      message,
      true
    );
  };

  public static HTTP409Error = (message: string): ApiErrorException => {
    return new ApiErrorException(
      "CONFLICT",
      HttpStatusCode.CONFLICT,
      message,
      true
    );
  };

  public static HTTP500Error = (message: string): ApiErrorException => {
    return new ApiErrorException(
      "INTERNAL SERVER ERROR",
      HttpStatusCode.INTERNAL_SERVER,
      message,
      false
    );
  };
};

export default ApiErrorException;
