import Exception                                  from "@/exceptions/api.exception";
import DatabaseException                          from "@/exceptions/database.exception";
import { ErrorRequestHandler, Request, Response } from "express";

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {

  if(err instanceof DatabaseException) {
    return res.status(500).send(err);
  }

  if(err instanceof Exception) {
    const { name, httpCode, message, isOperational } = err;
    return res.status(httpCode).send({ name, isOperational, message });
  }

  res.status(500).send({ message: "Something went wrong", error: err.message });
};

export default errorHandler;