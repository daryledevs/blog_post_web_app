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
dotenv.config();
const accessToken = (req, res, next) => {
    var _a;
    const secret = process.env.ACCESS_TKN_SECRET;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!accessToken)
        return res.status(401).send({ message: "Unauthorized" });
    jsonwebtoken_1.default.verify(accessToken, secret, (error) => {
        const { user_id, roles } = jsonwebtoken_1.default.decode(accessToken);
        req.body.user_id = user_id;
        req.body.roles = roles;
        if ((error === null || error === void 0 ? void 0 : error.name) === "UnauthorizedError")
            return res.status(401).send({ error, message: "Token is not valid" });
        if ((error === null || error === void 0 ? void 0 : error.name) === "JsonWebTokenError")
            return res.status(401).send({ error, message: "Token is unknown" });
        if ((error === null || error === void 0 ? void 0 : error.name) === "TokenExpiredError") {
            const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET;
            const ACCESS_TOKEN = jsonwebtoken_1.default.sign({ user_id, roles }, ACCESS_SECRET, { expiresIn: "15m" });
            return res.status(200).send({ accessToken: ACCESS_TOKEN });
        }
        ;
        return next();
    });
};
exports.default = accessToken;
