import ApiErrorException       from "@/application/exceptions/api.exception";
import DatabaseException       from "@/application/exceptions/database.exception";
import ValidationException from "@/application/exceptions/validation.exception";
import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationException) {
    const { name, httpCode, message, isOperational, error } = err;
    return res
      .status(httpCode)
      .send({ httpCode, name, isOperational, message, errors: error });
  }

  if (err instanceof DatabaseException) {
    return res.status(500).send(err);
  }

  if (err instanceof ApiErrorException) {
    const { name, httpCode, message, isOperational, error } = err;
    return res
      .status(httpCode)
      .send({ httpCode, name, isOperational, message, stack: error?.stack });
  }

  // Default error handling
  return res.status(500).send({
    name: 'InternalServerError',
    isOperational: false,
    message: 'An unexpected error occurred',
    error: err.message || 'Unknown error'
  });
};


export default errorHandler;