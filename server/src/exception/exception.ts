class Exception {
  constructor(public message: string, public status: number) {
    this.status = status;
    this.message = message;
  }

  static badRequest(message: string) {
    return new Exception(message, 400);
  }

  static notFound(message: string) {
    return new Exception(message, 404);
  }

  static internal(message: string) {
    return new Exception(message, 500);
  }
};

export default Exception;