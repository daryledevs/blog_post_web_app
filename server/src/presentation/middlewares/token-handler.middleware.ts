import AuthTokensUtil, {
  Expiration,
  TokenSecret,
}                                          from "@/application/utils/auth-token.util";
import dotenv                              from "dotenv";
import ApiException                        from "@/application/exceptions/api.exception";
import isTokenValid                        from "@/application/utils/token-invalid.util";
import routeException                      from "@/application/utils/route-exception.util";
import UserRepository                      from "@/infrastructure/repositories/user.repository.impl";
import { SelectUsers }                     from "@/domain/types/table.types";
import { Request, Response, NextFunction } from "express";
dotenv.config();

const tokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (routeException(req.path)) return next();
    const userRepository: UserRepository = new UserRepository();

    // get the refresh token and access token from the request
    const refreshToken = req.cookies.REFRESH_TOKEN;
    const accessToken = req.headers.authorization?.split(" ")[1];

    // get the secret keys from the environment variables
    const refreshSecret = process.env.REFRESH_TKN_SECRET!;
    const accessSecret = process.env.ACCESS_TKN_SECRET!;

    // check if the refresh token and access token are valid
    const isRefreshTokenInvalid = isTokenValid(refreshToken);
    const isAccessTokenInvalid = isTokenValid(accessToken);

    // if the token is not provided, return an error
    if (isRefreshTokenInvalid) {
      return next(ApiException.HTTP401Error("Token is not provided"));
    }

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

    // if the token is not undefined or null but JsonWebTokenError, return an error
    if (!isAccessTokenInvalid && accessError === "JsonWebTokenError") {
      return next(ApiException.HTTP401Error("Token is not valid"));
    } else if (!isRefreshTokenInvalid && refreshError === "JsonWebTokenError") {
      return next(ApiException.HTTP401Error("Token is not valid"));
    }

    const result: SelectUsers | undefined = await userRepository.findUserById(
      refreshDecode.tkn_user_uuid
    );

    // if user is not found, return an error
    if (!result) return next(ApiException.HTTP404Error("User not found"));

    const isTokenExpired = [refreshError, accessError].some(
      (status) => status === "TokenExpiredError"
    );

    // if the refresh token is expired, generate a new token
    if (isTokenExpired) {
      // token options
      const payload = {
        access: {
          tkn_user_uuid: accessDecode.tkn_user_uuid,
          roles: accessDecode.roles,
        },
        refresh: {
          tkn_user_uuid: refreshDecode.tkn_user_uuid,
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
    }

    // if the access token is not provided but refresh token is exists
    if (!accessToken) {
      const { uuid: tkn_user_uuid, roles } = result;
      const ACCESS_TOKEN = AuthTokensUtil.generateToken({
        payload: { tkn_user_uuid, roles },
        secret: TokenSecret.ACCESS_SECRET,
        expiration: Expiration.ACCESS_TOKEN_EXPIRATION,
      });
      return res.status(200).send({ accessToken: ACCESS_TOKEN });
    }
    
    next();
  } catch (error) {
    next(error);
  };
};

export default tokenHandler;
