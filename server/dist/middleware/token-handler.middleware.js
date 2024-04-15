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
const auth_token_util_1 = __importStar(require("@/utils/auth-token.util"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const token_invalid_util_1 = __importDefault(require("@/utils/token-invalid.util"));
const route_exception_util_1 = __importDefault(require("@/utils/route-exception.util"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
dotenv_1.default.config();
const tokenHandler = async (req, res, next) => {
    try {
        if ((0, route_exception_util_1.default)(req.path))
            return next();
        const userRepository = new user_repository_impl_1.default();
        const refreshToken = req.cookies.REFRESH_TOKEN;
        const accessToken = req.headers.authorization?.split(" ")[1];
        const refreshSecret = process.env.REFRESH_TKN_SECRET;
        const accessSecret = process.env.ACCESS_TKN_SECRET;
        const isTokenInvalid = (0, token_invalid_util_1.default)(accessToken, refreshToken);
        // if the token is not provided, return an error
        if (isTokenInvalid)
            return next(api_exception_1.default.HTTP401Error("Token is not provided"));
        // verify the refresh token and access token
        const { refreshError, refreshDecode } = await auth_token_util_1.default.verifyAuthToken(refreshToken, refreshSecret, "refresh");
        const { accessError, accessDecode } = await auth_token_util_1.default.verifyAuthToken(accessToken, accessSecret, "access");
        const isTokenError = [refreshError, accessError].some((status) => status === "JsonWebTokenError");
        // if the refresh token is not provided, return an error
        if (isTokenError)
            return next(api_exception_1.default.HTTP401Error("Token is not valid"));
        // if user is not found, return an error
        const result = await userRepository.findUserById(refreshDecode.user_id);
        if (!result)
            return next(api_exception_1.default.HTTP404Error("User not found"));
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
            const REFRESH_TKN = auth_token_util_1.default.generateToken(args.accessToken);
            const ACCESS_TOKEN = auth_token_util_1.default.generateToken(args.refreshToken);
            res.cookie("REFRESH_TOKEN", REFRESH_TKN, req.body.cookieOptions);
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        }
        ;
        // if the access token is not provided, generate a new access token
        if (!accessToken) {
            const { user_id, roles } = result;
            const ACCESS_TOKEN = auth_token_util_1.default.generateToken({
                payload: { user_id, roles, },
                secret: auth_token_util_1.TokenSecret.ACCESS_SECRET,
                expiration: auth_token_util_1.Expiration.ACCESS_TOKEN_EXPIRATION,
            });
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        }
        ;
        // if the access token is provided, decode the token and pass the user_id and roles to the next middleware
        req.body.user_id = refreshDecode.user_id;
        req.body.roles = accessDecode.roles;
        next();
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.default = tokenHandler;
