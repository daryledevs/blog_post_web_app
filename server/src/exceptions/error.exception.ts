interface HttpException {
  status: number;
  message: string;
};

class ErrorException extends Error implements HttpException {
  public status: number;
  public message: string;
  
  constructor(message: string, status: number) {
    super(message)
    this.status = status;
    this.message = message;
  };

  static badRequest(message: string) {
    return new ErrorException(message, 400);
  };

  static unauthorized(message: string) {
    return new ErrorException(message, 401);
  };

  static notFound(message: string) {
    return new ErrorException(message, 404);
  };

  static conflict(message: string) {
    return new ErrorException(message, 409);
  };

  static internal(message: string) {
    return new ErrorException(message, 500);
  };
};

export default ErrorException;
