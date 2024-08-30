import ApiErrorException                   from "@/application/exceptions/api.exception";
import DatabaseException                   from "@/application/exceptions/database.exception";
import { NextFunction, Request, Response } from "express";

class AsyncWrapper {
  asyncErrorHandler = (cb: Function) => {
    return (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(cb(req, res, next)).catch((error: Error) => {
        // if the error is a database error, throw a database exception
        if ((error as any).code) {
          return next(DatabaseException.error(error));
        }

        // if the error is an API error, throw an API exception
        if (error instanceof ApiErrorException) {
          return next(error);
        }

        // if the error is a general error, throw a internal server error exception
        next(
          ApiErrorException.HTTP500Error("An unexpected error occurred", error)
        );
      });
  };
};

export default AsyncWrapper;