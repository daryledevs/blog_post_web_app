import BaseError, { HttpStatusCode } from "./base-error.exception";

// ErrorConstraintsType defines the structure of constraints for a single property
export type ErrorConstraintsType = {
  [property: string]: string;
}

// ValidationErrorArrayFormat represents the error format with array indices
export interface ValidationErrorArrayFormat {
  arrayIndex: number;
  errors: ErrorConstraintsType;
}

// ValidationErrorKeyValueFormat represents the error format without array indices
export interface ValidationErrorKeyValueFormat {
  [property: string]: string;
}

// ResponseErrorType defines the structure of the response errors
export interface ResponseErrorType {
  [key: string]: ValidationErrorArrayFormat[] | ErrorConstraintsType;
}


class ValidationException extends BaseError {
  constructor(error: ResponseErrorType) {
    super(
      "BAD REQUEST",
      HttpStatusCode.BAD_REQUEST,
      "Validation errors occurred",
      true,
      error as any
    );
  }
}

export default ValidationException;
