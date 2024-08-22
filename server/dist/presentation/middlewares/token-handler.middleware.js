"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_token_util_1 = __importStar(require("@/application/utils/auth-token.util"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const token_invalid_util_1 = __importDefault(require("@/application/utils/token-invalid.util"));
const route_exception_util_1 = __importDefault(require("@/application/utils/route-exception.util"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
dotenv_1.default.config();
const tokenHandler = async (req, res, next) => {
    try {
        if ((0, route_exception_util_1.default)(req.path))
            return next();
        const userRepository = new user_repository_impl_1.default();
        // get the refresh token and access token from the request
        const refreshToken = req.cookies.REFRESH_TOKEN;
        const accessToken = req.headers.authorization?.split(" ")[1];
        // get the secret keys from the environment variables
        const refreshSecret = process.env.REFRESH_TKN_SECRET;
        const accessSecret = process.env.ACCESS_TKN_SECRET;
        // check if the refresh token and access token are valid
        const isRefreshTokenInvalid = (0, token_invalid_util_1.default)(refreshToken);
        const isAccessTokenInvalid = (0, token_invalid_util_1.default)(accessToken);
        // if the token is not provided, return an error
        if (isRefreshTokenInvalid) {
            return next(api_exception_1.default.HTTP401Error("Token is not provided"));
        }
        // verify the refresh token and access token
        const { refreshError, refreshDecode } = await auth_token_util_1.default.verifyAuthToken(refreshToken, refreshSecret, "refresh");
        const { accessError, accessDecode } = await auth_token_util_1.default.verifyAuthToken(accessToken, accessSecret, "access");
        // if the token is not undefined or null but JsonWebTokenError, return an error
        if (!isAccessTokenInvalid && accessError === "JsonWebTokenError") {
            return next(api_exception_1.default.HTTP401Error("Token is not valid"));
        }
        else if (!isRefreshTokenInvalid && refreshError === "JsonWebTokenError") {
            return next(api_exception_1.default.HTTP401Error("Token is not valid"));
        }
        const result = await userRepository.findUserById(refreshDecode.tkn_user_uuid);
        // if user is not found, return an error
        if (!result)
            return next(api_exception_1.default.HTTP404Error("User not found"));
        const isTokenExpired = [refreshError, accessError].some((status) => status === "TokenExpiredError");
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
                    secret: auth_token_util_1.TokenSecret.ACCESS_SECRET,
                    expiration: auth_token_util_1.Expiration.ACCESS_TOKEN_EXPIRATION,
                },
                refreshToken: {
                    payload: payload.refresh,
                    secret: auth_token_util_1.TokenSecret.REFRESH_SECRET,
                    expiration: auth_token_util_1.Expiration.REFRESH_TOKEN_EXPIRATION,
                },
            };
            // generate new tokens
            const REFRESH_TKN = auth_token_util_1.default.generateToken(args.refreshToken);
            const ACCESS_TOKEN = auth_token_util_1.default.generateToken(args.accessToken);
            return res
                .cookie("REFRESH_TOKEN", REFRESH_TKN, req.body.cookieOptions)
                .status(200)
                .send({ accessToken: ACCESS_TOKEN });
        }
        // if the access token is not provided but refresh token is exists
        if (!accessToken) {
            const { uuid: tkn_user_uuid, roles } = result;
            const ACCESS_TOKEN = auth_token_util_1.default.generateToken({
                payload: { tkn_user_uuid, roles },
                secret: auth_token_util_1.TokenSecret.ACCESS_SECRET,
                expiration: auth_token_util_1.Expiration.ACCESS_TOKEN_EXPIRATION,
            });
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        }
        next();
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.default = tokenHandler;
