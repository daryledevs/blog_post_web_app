import ApiErrorException from "@/application/exceptions/api.exception";
import DatabaseException                   from "@/application/exceptions/database.exception";
import { NextFunction, Request, Response } from "express";

class AsyncWrapper {
  apiWrap = (cb: Function) => {
    return (req: Request, res: Response, next: NextFunction) =>
      cb(req, res, next).catch((error: Error) => {
        if (
          error instanceof DatabaseException ||
          error instanceof ApiErrorException
        ) return next(error);

        next(
          ApiErrorException.HTTP500Error(
            "An unexpected error occurred", 
            error
          )
        );
      });
  };

  serviceWrap = (fn: Function) => {
    return (...args: any) => {
      return fn.apply(this, args).catch((error: Error) => {
        throw error;
      });
    };
  };

  repoWrap = (fn: Function) => {
    return (...args: any) => {
      return fn.apply(this, args).catch((error: Error) => {
        throw DatabaseException.error(error);
      });
    };
  };
};

export default AsyncWrapper;