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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    ;
    register = async (req, res, next) => {
        try {
            const { cookieOptions, ...rest } = req.body;
            const result = await this.authService.register(rest);
            res.status(201).send({ message: result });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    login = async (req, res, next) => {
        try {
            const { userCredential, password } = req.body;
            const result = await this.authService.login(userCredential, password);
            res
                .cookie("REFRESH_TOKEN", result.refreshToken, req.body.cookieOptions)
                .status(200)
                .send({ message: result.message, token: result.token });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    forgotPassword = async (req, res, next) => {
        try {
            const result = await this.authService.forgotPassword(req.body);
            res.status(200).send({ message: result });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    resetPasswordForm = async (req, res, next) => {
        try {
            const result = await this.authService.resetPasswordForm(req.body);
            res.status(201).render(result.render, result.data);
        }
        catch (error) {
            next(error);
        }
        ;
    };
    resetPassword = async (req, res, next) => {
        try {
            const result = await this.authService.resetPassword(req.body);
            res.status(200).send({ message: result });
        }
        catch (error) {
            next(error);
        }
        ;
    };
    logout = async (req, res, next) => {
        try {
            res
                .clearCookie("REFRESH_TOKEN", {
                sameSite: "none",
                secure: req.body.cookieOptions.secure,
                httpOnly: true,
            })
                .status(200)
                .send({ message: "Logout successfully" });
        }
        catch (error) {
            next(error);
        }
        ;
    };
}
;
exports.default = AuthController;
