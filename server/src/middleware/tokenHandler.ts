import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieOptions from "../config/cookieOptions";
import routeException from "../helper/routeException";
import { errorName, generateAccessToken, generateRefreshToken, verifyToken } from "../util/authTokens";
dotenv.config();

const tokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (routeException(req.path)) return next();
    const refreshToken = req.cookies.REFRESH_TOKEN;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshSecret = process.env.REFRESH_TKN_SECRET!;
    const accessSecret = process.env.ACCESS_TKN_SECRET!;
    if (!accessToken) return res.status(401).send({ message: "Unauthorized" });

    const { refreshError, refreshDecode } = await verifyToken(refreshToken, refreshSecret);
    const { accessError, accessDecode } = await verifyToken(accessToken, accessSecret);
    const isError = errorName(refreshError?.name) || errorName(accessError?.name);
    const REFRESH_TKN = generateRefreshToken(refreshDecode);
    const ACCESS_TOKEN = generateAccessToken(accessDecode);

    if (isError) return res.status(401).send({ message: "Token is not valid" });
    if (refreshError.error) res.cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions);
    if (accessError.error) return res.status(200).send({ accessToken: ACCESS_TOKEN });

    req.body.user_id = refreshDecode.user_id;
    req.body.roles = accessDecode.roles;
    next();
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error });
  }
};

export default tokenHandler;
