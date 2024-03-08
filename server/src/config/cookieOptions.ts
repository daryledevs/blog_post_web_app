import { NextFunction, Request, Response } from "express";

const cookieOptions = async (req: Request, res: Response, next: NextFunction) => {
  const { secure, sameSite }: any = (function () {
    return `${process.env.NODE_ENV}`.trim() === "development"
      ? { secure: false, sameSite: "lax" }
      : { secure: true, sameSite: "none" };
  })();

  const domain = req.headers?.host?.split(":")[0] ?? "";

  req.body.cookieOptions = {
    httpOnly: true,
    secure: secure,
    sameSite: sameSite,
    domain: domain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (days, hours, mins, milliseconds)
  };

  next();
};

export default cookieOptions;
