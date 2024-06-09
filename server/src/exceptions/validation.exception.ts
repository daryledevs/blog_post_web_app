import BaseError, { HttpStatusCode } from "./base-error.exception";

class ValidationException extends BaseError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      "Validation errors occurred",
      true
    );
    this.errors = errors;
  }
}

export default ValidationException;
