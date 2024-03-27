class Exception {
  constructor(public message: string, public status: number) {
    this.status = status;
    this.message = message;
  };

  static badRequest(message: string) {
    return new Exception(message, 400);
  };

  static unauthorized(message: string) {
    return new Exception(message, 401);
  };

  static notFound(message: string) {
    return new Exception(message, 404);
  };

  static conflict(message: string) {
    return new Exception(message, 409);
  };

  static internal(message: string) {
    return new Exception(message, 500);
  };
};

export default Exception;