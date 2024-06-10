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
const user_dto_1 = __importDefault(require("@/dto/user.dto"));
const dotenv = __importStar(require("dotenv"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const class_transformer_1 = require("class-transformer");
dotenv.config();
class AuthController {
    authService;
    wrap = new async_wrapper_util_1.default();
    constructor(authService) {
        this.authService = authService;
    }
    register = this.wrap.apiWrap(async (req, res, next) => {
        const { cookieOptions, ...rest } = req.body;
        const userDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, rest);
        const result = await this.authService.register(userDto);
        res.status(201).send(result);
    });
    login = this.wrap.apiWrap(async (req, res, next) => {
        const { userCredential, password } = req.body;
        const result = await this.authService.login(userCredential, password);
        res
            .cookie("REFRESH_TOKEN", result.refreshToken, req.body.cookieOptions)
            .status(200)
            .send({ message: result.message, token: result.token });
    });
    forgotPassword = this.wrap.apiWrap(async (req, res, next) => {
        const result = await this.authService.forgotPassword(req.body);
        res.status(200).send({ message: result });
    });
    resetPasswordForm = this.wrap.apiWrap(async (req, res, next) => {
        const result = await this.authService.resetPasswordForm(req.body);
        res.status(201).render(result.render, result.data);
    });
    resetPassword = this.wrap.apiWrap(async (req, res, next) => {
        const result = await this.authService.resetPassword(req.body);
        res.status(200).send({ message: result });
    });
    logout = this.wrap.apiWrap(async (req, res, next) => {
        res
            .clearCookie("REFRESH_TOKEN", {
            sameSite: "none",
            secure: req.body.cookieOptions.secure,
            httpOnly: true,
        })
            .status(200)
            .send({ message: "Logout successfully" });
    });
}
;
exports.default = AuthController;
