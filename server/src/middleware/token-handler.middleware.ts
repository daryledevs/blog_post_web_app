import AuthTokensUtil, {
  Expiration,
  TokenSecret,
}                                          from "@/utils/auth-token.util";
import dotenv                              from "dotenv";
import ApiException                        from "@/exceptions/api.exception";
import isTokenValid                        from "@/utils/token-invalid.util";
import routeException                      from "@/utils/route-exception.util";
import UserRepository                      from "@/repositories/user/user.repository.impl";
import { SelectUsers }                     from "@/types/table.types";
import { Request, Response, NextFunction } from "express";
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
    if (isTokenInvalid) return next(ApiException.HTTP401Error("Token is not provided"));
    
    // verify the refresh token and access token
    const { refreshError, refreshDecode } = await AuthTokensUtil.verifyAuthToken(
        refreshToken,
        refreshSecret,
        "refresh"
      );

    const { accessError, accessDecode } = await AuthTokensUtil.verifyAuthToken(
      accessToken,
      accessSecret,
      "access"
    );

    const isTokenError = [refreshError, accessError].some((status) => status === "JsonWebTokenError");
    
    // if the refresh token is not provided, return an error
    if (isTokenError) return next(ApiException.HTTP401Error("Token is not valid"));

    // if user is not found, return an error
    const result: SelectUsers | undefined = await userRepository.findUserById(refreshDecode.user_id);
    if (!result) return next(ApiException.HTTP404Error("User not found"));

    // if the refresh token is expired, generate a new refresh token and access token
    if (refreshError === "TokenExpiredError" || accessError === "TokenExpiredError") {
      // token options
      const payload = {
        access: {
          user_id: accessDecode.user_id,
          roles: accessDecode.roles,
        },
        refresh: {
          user_id: refreshDecode.user_id,
          username: refreshDecode.username,
        },
      };

      const args = {
        accessToken: {
          payload: payload.access,
          secret: TokenSecret.ACCESS_SECRET,
          expiration: Expiration.ACCESS_TOKEN_EXPIRATION,
        },
        refreshToken: {
          payload: payload.refresh,
          secret: TokenSecret.REFRESH_SECRET,
          expiration: Expiration.REFRESH_TOKEN_EXPIRATION,
        },
      };

      // generate new tokens
      const REFRESH_TKN = AuthTokensUtil.generateToken(args.refreshToken);
      const ACCESS_TOKEN = AuthTokensUtil.generateToken(args.accessToken);

      return res
        .cookie("REFRESH_TOKEN", REFRESH_TKN, req.body.cookieOptions)
        .status(200)
        .send({ accessToken: ACCESS_TOKEN });
    };
    
    // if the access token is not provided, generate a new access token
    if (!accessToken) {
      const { user_id, roles } = result;
      const ACCESS_TOKEN = AuthTokensUtil.generateToken({
        payload: { user_id, roles, },
        secret: TokenSecret.ACCESS_SECRET,
        expiration: Expiration.ACCESS_TOKEN_EXPIRATION,
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
