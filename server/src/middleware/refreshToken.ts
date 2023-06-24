import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieOptions from "../config/cookieOptions";
import routeException from "../helper/routeException";
dotenv.config();

interface CustomRequest extends Request {
  refreshToken?: boolean;
};

const refreshToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  if(routeException(req.path)) return next();
  const secret = process.env.REFRESH_TKN_SECRET!;
  const cookieToken = req.cookies.REFRESH_TOKEN;

  jwt.verify(cookieToken, secret, { ignoreExpiration: true },(error:any, decoded:any) => {
    if(error?.name === "UnauthorizedError") return res.status(401).send({ error, message: "Token is not valid"});
    if(error?.name === "JsonWebTokenError") return res.status(401).send({ error, message: "Token is unknown" });
    if(error?.name === "TokenExpiredError") {
      req.refreshToken = true;
      const { user_id, username } = decoded;
      const REFRESH_TKN = jwt.sign({ user_id, username, }, secret, { expiresIn: "7d" });
      res.cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions);
    };
    next();
  });
};

export default refreshToken;