import ApiErrorException       from "@/exceptions/api.exception";
import DatabaseException       from "@/exceptions/database.exception";
import { ErrorRequestHandler } from "express";

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof DatabaseException) {
    return res.status(500).send(err);
  };

  if (err instanceof ApiErrorException) {
    const { name, httpCode, message, isOperational, error } = err;
    return res
      .status(httpCode)
      .send({ name, isOperational, message, stack: error?.stack });
  };
};

export default errorHandler;