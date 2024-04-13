import ApiErrorException                   from "@/exceptions/api.exception";
import DatabaseException                   from "@/exceptions/database.exception";
import { NextFunction, Request, Response } from "express";

class AsyncWrapper {
  apiWrap = (cb: Function) => {
    return (req: Request, res: Response, next: NextFunction) =>
      cb(req, res, next).catch(
        next(ApiErrorException.HTTP500Error("Something went wrong"))
      );
  };

  asyncWrap = (fn: Function) => {
    return (...args: any) => {
      return fn.apply(null, args).catch((error: any) => {
        if (!(error instanceof DatabaseException)) throw error;
        throw DatabaseException.error(error);
      });
    };
  };
};

export default AsyncWrapper;