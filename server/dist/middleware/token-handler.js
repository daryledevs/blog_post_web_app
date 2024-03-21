"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const exception_1 = __importDefault(require("../exception/exception"));
const is_token_invalid_1 = __importDefault(require("../util/is-token-invalid"));
const routeException_1 = __importDefault(require("../util/routeException"));
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const authTokens_1 = require("../util/authTokens");
dotenv_1.default.config();
const tokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if ((0, routeException_1.default)(req.path))
            return next();
        const refreshToken = req.cookies.REFRESH_TOKEN;
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const refreshSecret = process.env.REFRESH_TKN_SECRET;
        const accessSecret = process.env.ACCESS_TKN_SECRET;
        const isTokenInvalid = (0, is_token_invalid_1.default)(accessToken, refreshToken);
        // if the token is not provided, return an error
        if (isTokenInvalid)
            return next(exception_1.default.unauthorized("Token is not provided"));
        // verify the refresh token and access token
        const { refreshError, refreshDecode } = yield (0, authTokens_1.verifyToken)(refreshToken, refreshSecret, "refresh");
        const { accessError, accessDecode } = yield (0, authTokens_1.verifyToken)(accessToken, accessSecret, "access");
        const isTokenError = [refreshError, accessError].some((status) => status === "JsonWebTokenError");
        // if the refresh token is not provided, return an error
        if (isTokenError)
            return next(exception_1.default.unauthorized("Token is not valid"));
        // if user is not found, return an error
        const result = yield user_repository_1.default.findUserById(refreshDecode.user_id);
        if (!result)
            return next(exception_1.default.notFound("User not found"));
        // if the refresh token is expired, generate a new refresh token and access token
        if (refreshError === "TokenExpiredError" || accessError === "TokenExpiredError") {
            // token options
            const ACCESS_OPTION = { user_id: accessDecode.user_id, roles: accessDecode.roles };
            const REFRESH_OPTION = { user_id: refreshDecode.user_id, username: refreshDecode.username };
            // generate new tokens
            const REFRESH_TKN = (0, authTokens_1.generateRefreshToken)(REFRESH_OPTION);
            const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(ACCESS_OPTION);
            res.cookie("REFRESH_TOKEN", REFRESH_TKN, req.body.cookieOptions);
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        }
        ;
        // if the access token is not provided, generate a new access token
        if (!accessToken) {
            const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)({
                user_id: result === null || result === void 0 ? void 0 : result.user_id,
                roles: result === null || result === void 0 ? void 0 : result.roles,
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
});
exports.default = tokenHandler;
