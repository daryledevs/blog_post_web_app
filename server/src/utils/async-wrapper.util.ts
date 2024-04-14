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

  serviceWrap = (fn: Function) => {
    return (...args: any) => {
      return fn.apply(this, args).catch((error: any) => {
        throw error;
      });
    };
  };

  repoWrap = (fn: Function) => {
    return (...args: any) => {
      return fn.apply(this, args).catch((error: any) => {
        throw DatabaseException.error(error);
      });
    };
  };
};

export default AsyncWrapper;