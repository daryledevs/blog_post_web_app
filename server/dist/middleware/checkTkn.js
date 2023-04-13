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
const checkTkn = (req, res, next) => {
    const token = req.headers.authorization;
    if ((token === null || token === void 0 ? void 0 : token.slice(0, 7)) !== "Bearer ")
        return res.status(401).send({ message: "Unauthorized" });
    const sliced_token = token === null || token === void 0 ? void 0 : token.slice(7);
    jsonwebtoken_1.default.verify(sliced_token, process.env.ACCESS_TKN_SECRET, (error, decoded) => {
        if (error)
            return res.status(500).send({ message: "Forbidden", error, token });
        const { user_id, roles } = decoded;
        req.body.user_id = user_id;
        req.body.roles = roles;
        next();
    });
};
exports.default = checkTkn;
