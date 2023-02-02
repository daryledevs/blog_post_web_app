import { expressjwt } from "express-jwt";
import { Request } from "express";
import * as dotenv from "dotenv";
dotenv.config();
// @ts-ignore
function authJWT() {
  const secret = process.env.JWT_SECRET!;
  const token = (req: Request) => req.cookies.authorization_key;

  return expressjwt({
    secret: secret,
    getToken: token,
    algorithms: ["HS256"],
  }).unless({
    path: [{ url: /\/api\/v1\/users\/login/, methods: ["GET", "POST"] }],
  });
}

export default authJWT;
