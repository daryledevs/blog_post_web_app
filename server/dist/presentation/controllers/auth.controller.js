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
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const dotenv = __importStar(require("dotenv"));
const cookie_options_config_1 = __importDefault(require("@/config/cookie-options.config"));
const class_transformer_1 = require("class-transformer");
dotenv.config();
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res) => {
        const data = req.body;
        const userDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, data);
        const result = await this.authService.register(userDto);
        res
            .status(201)
            .send({ message: result.message, user: result.user?.getUsers() });
    };
    login = async (req, res) => {
        const { userCredentials, password } = req.body;
        const result = await this.authService.login(userCredentials, password);
        res
            .cookie("REFRESH_TOKEN", result.refreshToken, cookie_options_config_1.default)
            .status(200)
            .send({ message: result.message, token: result.token });
    };
    forgotPassword = async (req, res) => {
        const result = await this.authService.forgotPassword(req.body?.email);
        res.status(200).send({ message: result });
    };
    resetPasswordForm = async (req, res) => {
        const query = req.query.token;
        const result = await this.authService.resetPasswordForm(query);
        res.status(201).render(result.render, result.data);
    };
    resetPassword = async (req, res) => {
        const result = await this.authService.resetPassword(req.body);
        res.status(200).send({ message: result });
    };
    logout = async (req, res) => {
        res
            .clearCookie("REFRESH_TOKEN", {
            sameSite: "none",
            secure: cookie_options_config_1.default.secure,
            httpOnly: true,
        })
            .status(200)
            .send({ message: "Logout successfully" });
    };
}
;
exports.default = AuthController;
