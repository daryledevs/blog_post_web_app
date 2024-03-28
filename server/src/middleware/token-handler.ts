import dotenv                                                     from "dotenv";
import Exception                                                  from "../exception/exception";
import isTokenValid                                               from "../util/is-token-invalid";
import { SelectUsers }                                            from "../types/table.types";
import routeException                                             from "../util/routeException";
import UserRepository                                             from "../repository/user/user.repository.impl";
import { Request, Response, NextFunction }                        from "express";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../util/authTokens";
dotenv.config();

const tokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (routeException(req.path)) return next();
    const userRepository: UserRepository = new UserRepository();
    const refreshToken = req.cookies.REFRESH_TOKEN;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshSecret = process.env.REFRESH_TKN_SECRET!;
    const accessSecret = process.env.ACCESS_TKN_SECRET!;
    const isTokenInvalid = isTokenValid(accessToken, refreshToken);

    // if the token is not provided, return an error
    if (isTokenInvalid) return next(Exception.unauthorized("Token is not provided"));
    
    // verify the refresh token and access token
    const { refreshError, refreshDecode } = await verifyToken(refreshToken, refreshSecret, "refresh");
    const { accessError, accessDecode } = await verifyToken(accessToken, accessSecret, "access");
    const isTokenError = [refreshError, accessError].some((status) => status === "JsonWebTokenError");
    
    // if the refresh token is not provided, return an error
    if (isTokenError) return next(Exception.unauthorized("Token is not valid"));

    // if user is not found, return an error
    const result: SelectUsers | undefined = await userRepository.findUserById(refreshDecode.user_id);
    if (!result) return next(Exception.notFound("User not found"));

    // if the refresh token is expired, generate a new refresh token and access token
    if (refreshError === "TokenExpiredError" || accessError === "TokenExpiredError") {
      // token options
      const ACCESS_OPTION = { user_id: accessDecode.user_id, roles: accessDecode.roles };
      const REFRESH_OPTION = { user_id: refreshDecode.user_id, username: refreshDecode.username };

      // generate new tokens
      const REFRESH_TKN = generateRefreshToken(REFRESH_OPTION);
      const ACCESS_TOKEN = generateAccessToken(ACCESS_OPTION);
      res.cookie("REFRESH_TOKEN", REFRESH_TKN, req.body.cookieOptions);
      return res.status(200).send({ accessToken: ACCESS_TOKEN });
    };
    
    // if the access token is not provided, generate a new access token
    if (!accessToken) {
      const ACCESS_TOKEN = generateAccessToken({
        user_id: result?.user_id as any,
        roles: result?.roles as any,
      });
      return res.status(200).send({ accessToken: ACCESS_TOKEN });
    };
  
    // if the access token is provided, decode the token and pass the user_id and roles to the next middleware
    req.body.user_id = refreshDecode.user_id;
    req.body.roles = accessDecode.roles;
    next();
  } catch (error) {
    next(error);
  };
};

export default tokenHandler;
