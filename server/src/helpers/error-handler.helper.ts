import ApiErrorException       from "@/exceptions/api.exception";
import DatabaseException       from "@/exceptions/database.exception";
import ValidationException from "@/exceptions/validation.exception";
import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationException) {
    const { name, httpCode, message, isOperational, errors } = err;
    return res
      .status(httpCode)
      .send({ name, isOperational, message, errors: errors });
  }

  if (err instanceof DatabaseException) {
    return res.status(500).send(err);
  }

  if (err instanceof ApiErrorException) {
    const { name, httpCode, message, isOperational, error } = err;
    return res
      .status(httpCode)
      .send({ name, isOperational, message, stack: error?.stack });
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