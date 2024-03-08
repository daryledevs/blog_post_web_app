import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import routeException from "../helper/routeException";
import db from "../database/query";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../util/authTokens";

dotenv.config();

const tokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (routeException(req.path)) return next();
    const refreshToken = req.cookies.REFRESH_TOKEN;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshSecret = process.env.REFRESH_TKN_SECRET!;
    const accessSecret = process.env.ACCESS_TKN_SECRET!;
    const sqlSelect = "SELECT USER_ID, ROLES FROM USERS WHERE USER_ID = (?);";
    if (!refreshToken) return res.status(401).send({ message: "Unauthorized" });
    
    if (accessToken && refreshToken && !isInvalidToken(accessToken, refreshToken)) {
  
      const { refreshError, refreshDecode } = await verifyToken(refreshToken, refreshSecret, "refresh");
      const { accessError, accessDecode } = await verifyToken(accessToken, accessSecret, "access");

      const isTokenError = [refreshError, accessError].some((status) => status === "JsonWebTokenError");
      if (isTokenError) return res.status(401).send({ message: "Token is not valid" });

      if (refreshError === "TokenExpiredError" || accessError === "TokenExpiredError") {
        const ACCESS_OPTION = { USER_ID: accessDecode.user_id, ROLES: accessDecode.roles };
        const REFRESH_OPTION = { USER_ID: refreshDecode.user_id, USERNAME: refreshDecode.username };
        const REFRESH_TKN = generateRefreshToken(REFRESH_OPTION);
        const ACCESS_TOKEN = generateAccessToken(ACCESS_OPTION);
        res.cookie("REFRESH_TOKEN", REFRESH_TKN, req.body.cookieOptions);
        return res.status(200).send({ accessToken: ACCESS_TOKEN });
      }
      
      req.body.user_id = refreshDecode.user_id;
      req.body.roles = accessDecode.roles;
      next();
    } else if (refreshToken) {
      const { refreshError, refreshDecode } = await verifyToken(refreshToken, refreshSecret, "refresh");
      if (refreshError === "JsonWebTokenError") return res.status(401).send({ message: "Token is not valid" });
      const [result] = await db(sqlSelect, [refreshDecode.user_id]);
      const ACCESS_TOKEN = generateAccessToken(result);
      return res.status(200).send({ accessToken: ACCESS_TOKEN });
    } else {
      throw new Error("Token: Unknown Error");
    }

  } catch (error:any) {
    res.status(500).send({ message: "Something went wrong", error: error?.message });
  }
};

// an empty token returns null as a string when used sessionStorage.getItem(...) function
function isInvalidToken(accessToken:any, refreshToken:any){
  if(accessToken === "null" || accessToken === null) return true;
  if(accessToken === "undefined" || accessToken === undefined) return true;
  if(refreshToken === "null" || refreshToken === null) return true;
  if(refreshToken === "undefined" || refreshToken === undefined) return true;
  return false;
};

export default tokenHandler;
