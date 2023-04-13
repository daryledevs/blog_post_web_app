import { expressjwt } from "express-jwt";
import { Request } from "express";
import * as dotenv from "dotenv";
dotenv.config();
// @ts-ignore
function authJWT() {
  const secret = process.env.REFRESH_TKN_SECRET!;
  const token = (req: Request) => req.cookies.REFRESH_TOKEN;
  return expressjwt({
    secret: secret,
    getToken: token,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/api\/v1\/login/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/user\/register/, methods: ["POST"] },
    ],
  });
}

export default authJWT;
