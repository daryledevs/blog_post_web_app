import { ErrorRequestHandler, Request, Response } from "express";
import Exception from "../exception/exception";

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {

  if(err instanceof Exception) {
    const { status, message } = err;
    return res.status(status).send({ message });
  }

  res.status(500).send({ message: "Something went wrong" });
};

export {
  errorHandler,
};