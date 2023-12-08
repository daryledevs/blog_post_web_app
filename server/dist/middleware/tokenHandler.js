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
const cookieOptions_1 = __importDefault(require("../config/cookieOptions"));
const routeException_1 = __importDefault(require("../helper/routeException"));
const query_1 = __importDefault(require("../database/query"));
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
        const sqlSelect = "SELECT USER_ID, ROLES FROM USERS WHERE USER_ID = (?);";
        if (!refreshToken)
            return res.status(401).send({ message: "Unauthorized" });
        if (accessToken && refreshToken && !isInvalidToken(accessToken, refreshToken)) {
            const { refreshError, refreshDecode } = yield (0, authTokens_1.verifyToken)(refreshToken, refreshSecret, "refresh");
            const { accessError, accessDecode } = yield (0, authTokens_1.verifyToken)(accessToken, accessSecret, "access");
            const isTokenError = [refreshError, accessError].some((status) => status === "JsonWebTokenError");
            if (isTokenError)
                return res.status(401).send({ message: "Token is not valid" });
            if (refreshError === "TokenExpiredError" || accessError === "TokenExpiredError") {
                const ACCESS_OPTION = { USER_ID: accessDecode.user_id, ROLES: accessDecode.roles };
                const REFRESH_OPTION = { USER_ID: refreshDecode.user_id, USERNAME: refreshDecode.username };
                const REFRESH_TKN = (0, authTokens_1.generateRefreshToken)(REFRESH_OPTION);
                const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(ACCESS_OPTION);
                res.cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions_1.default);
                return res.status(200).send({ accessToken: ACCESS_TOKEN });
            }
            req.body.user_id = refreshDecode.user_id;
            req.body.roles = accessDecode.roles;
            next();
        }
        else if (refreshToken) {
            const { refreshError, refreshDecode } = yield (0, authTokens_1.verifyToken)(refreshToken, refreshSecret, "refresh");
            if (refreshError === "JsonWebTokenError")
                return res.status(401).send({ message: "Token is not valid" });
            const [result] = yield (0, query_1.default)(sqlSelect, [refreshDecode.user_id]);
            const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(result);
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        }
        else {
            throw new Error("Token: Unknown Error");
        }
    }
    catch (error) {
        res.status(500).send({ message: "Something went wrong", error: error === null || error === void 0 ? void 0 : error.message });
    }
});
// an empty token returns null as a string when used sessionStorage.getItem(...) function
function isInvalidToken(accessToken, refreshToken) {
    if (accessToken === "null" || accessToken === null)
        return true;
    if (accessToken === "undefined" || accessToken === undefined)
        return true;
    if (refreshToken === "null" || refreshToken === null)
        return true;
    if (refreshToken === "undefined" || refreshToken === undefined)
        return true;
    return false;
}
;
exports.default = tokenHandler;
