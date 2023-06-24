import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  user_id: string;
  roles: string;
}

interface CustomRequest extends Request {
  refreshToken?: boolean;
  accessToken?: string;
};

const accessToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const secret = process.env.ACCESS_TKN_SECRET!;
  const accessToken = req.headers.authorization?.split(" ")[1];
  if(!accessToken) return res.status(401).send({ message: "Unauthorized" });

  jwt.verify(accessToken, secret,  { ignoreExpiration: true }, (error:any, decoded:any) => {
    const { user_id, roles } = decoded as JwtPayload;
    req.body.user_id = user_id;
    req.body.roles = roles;

    if(error === "UnauthorizedError") return res.status(401).send({ error, message: "Token is not valid"});
    if(error === "JsonWebTokenError") return res.status(401).send({ error, message: "Token is unknown" });
    if(error?.name === "TokenExpiredError" && req.refreshToken) {
      const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET!;
      const ACCESS_TOKEN = jwt.sign({ user_id, roles }, ACCESS_SECRET, { expiresIn: "15m" });
      return res.status(200).send({ accessToken: ACCESS_TOKEN });
    };
    return next();
  });
};

export default accessToken;