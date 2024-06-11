import BaseError, { HttpStatusCode } from "./base-error.exception";

export type ErrorConstraintsType = {
  [property: string]: string;
}

class ValidationException extends BaseError {
  public readonly errors: ErrorConstraintsType;

  constructor(errors: ErrorConstraintsType) {
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
