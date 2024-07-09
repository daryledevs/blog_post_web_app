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
exports.TokenSecret = exports.Expiration = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const dotenv = __importStar(require("dotenv"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
dotenv.config();
var Expiration;
(function (Expiration) {
    Expiration["REFRESH_TOKEN_EXPIRATION"] = "7d";
    Expiration["ACCESS_TOKEN_EXPIRATION"] = "15m";
    Expiration["RESET_TOKEN_EXPIRATION"] = "1hr";
})(Expiration || (exports.Expiration = Expiration = {}));
;
var TokenSecret;
(function (TokenSecret) {
    TokenSecret[TokenSecret["REFRESH_SECRET"] = process.env.REFRESH_TKN_SECRET] = "REFRESH_SECRET";
    TokenSecret[TokenSecret["ACCESS_SECRET"] = process.env.ACCESS_TKN_SECRET] = "ACCESS_SECRET";
    TokenSecret[TokenSecret["RESET_SECRET"] = process.env.RESET_PWD_TKN_SECRET] = "RESET_SECRET";
})(TokenSecret || (exports.TokenSecret = TokenSecret = {}));
;
;
class AuthTokensUtil {
    static referenceToken = async () => (0, nanoid_1.nanoid)(10);
    static generateToken = (data) => {
        const { payload, secret, expiration } = data;
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiration });
    };
    static verifyAuthToken = (token, secret, tokenName) => {
        return new Promise((resolve, reject) => {
            const errorField = `${tokenName}Error`;
            const decodeField = `${tokenName}Decode`;
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, secret);
                resolve({ [errorField]: null, [decodeField]: decodedToken });
            }
            catch (error) {
                const decodedToken = jsonwebtoken_1.default.decode(token);
                return resolve({
                    [errorField]: error?.name,
                    [decodeField]: decodedToken,
                });
            }
        });
    };
    static verifyResetPasswordToken = (decryptedToken, tokenId) => {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
                // Explicitly type 'decode' as 'any'
                if (error)
                    reject(api_exception_1.default.HTTP400Error("Invalid or expired token"));
                const { email, user_id } = decode;
                resolve({
                    render: "resetPassword",
                    data: { email, user_id, tokenId },
                });
            });
        });
    };
}
exports.default = AuthTokensUtil;
