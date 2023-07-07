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
const dotenv = __importStar(require("dotenv"));
const cookieOptions_1 = __importDefault(require("../config/cookieOptions"));
const routeException_1 = __importDefault(require("../helper/routeException"));
const authTokens_1 = require("../util/authTokens");
dotenv.config();
const tokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if ((0, routeException_1.default)(req.path))
            return next();
        const refreshToken = req.cookies.REFRESH_TOKEN;
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const refreshSecret = process.env.REFRESH_TKN_SECRET;
        const accessSecret = process.env.ACCESS_TKN_SECRET;
        if (!accessToken)
            return res.status(401).send({ message: "Unauthorized" });
        const { refreshError, refreshDecode } = yield (0, authTokens_1.verifyToken)(refreshToken, refreshSecret);
        const { accessError, accessDecode } = yield (0, authTokens_1.verifyToken)(accessToken, accessSecret);
        const isError = (0, authTokens_1.errorName)(refreshError === null || refreshError === void 0 ? void 0 : refreshError.name) || (0, authTokens_1.errorName)(accessError === null || accessError === void 0 ? void 0 : accessError.name);
        const REFRESH_TKN = (0, authTokens_1.generateRefreshToken)(refreshDecode);
        const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(accessDecode);
        if (isError)
            return res.status(401).send({ message: "Token is not valid" });
        if (refreshError.error)
            res.cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions_1.default);
        if (accessError.error)
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        req.body.user_id = refreshDecode.user_id;
        req.body.roles = accessDecode.roles;
        next();
    }
    catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
});
exports.default = tokenHandler;
