import database from "../database";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  user_id: string;
  roles: string;
}

const checkTkn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token?.slice(0, 7) !== "Bearer ") return res.status(401).send({ message: "Unauthorized" });
  const sliced_token = token?.slice(7);

  jwt.verify(
    sliced_token,
    process.env.ACCESS_TKN_SECRET!,
    (error, decoded) => {
      if(error) return res.status(500).send({ message: "Forbidden", error, token });
      const { user_id, roles } = decoded as JwtPayload;
      
      req.body.user_id = user_id;
      req.body.roles = roles;

      next();
    }
  );
};

export default checkTkn;
