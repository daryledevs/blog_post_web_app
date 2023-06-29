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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const cookieOptions_1 = __importDefault(require("../config/cookieOptions"));
const routeException_1 = __importDefault(require("../helper/routeException"));
dotenv.config();
const refreshToken = (req, res, next) => {
    try {
        if ((0, routeException_1.default)(req.path))
            return next();
        const secret = process.env.REFRESH_TKN_SECRET;
        const cookieToken = req.cookies.REFRESH_TOKEN;
        jsonwebtoken_1.default.verify(cookieToken, secret, (error) => {
            if ((error === null || error === void 0 ? void 0 : error.name) === "UnauthorizedError")
                return res.status(401).send({ error, message: "Token is not valid" });
            if ((error === null || error === void 0 ? void 0 : error.name) === "JsonWebTokenError")
                return res.status(401).send({ error, message: "Token is unknown" });
            if ((error === null || error === void 0 ? void 0 : error.name) === "TokenExpiredError") {
                const { user_id, username } = jsonwebtoken_1.default.decode(cookieToken);
                const REFRESH_TKN = jsonwebtoken_1.default.sign({ user_id, username, }, secret, { expiresIn: "7d" });
                res.cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions_1.default);
            }
            ;
            next();
        });
    }
    catch (error) {
        res.status(500).send({ message: "Something went wrong", error });
    }
};
exports.default = refreshToken;
