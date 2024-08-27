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
const nodemailer_config_1 = __importDefault(require("@/config/nodemailer.config"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class EmailService {
    static sendEmail(to, subject, token) {
        let mailDetails = {
            from: process.env.EMAIL,
            to,
            subject,
            html: `
        <p>Please click the following link to reset your password:</p>
        <a href="http://localhost:5000/api/v1/auth/reset-password-form?token=${token}">Reset Password</a>
      `,
        };
        nodemailer_config_1.default.sendMail(mailDetails, function (error, data) {
            if (error) {
                console.error("Error sending email:", error);
            }
            else {
                console.log("Password reset email sent:", data.response);
            }
        });
    }
}
exports.default = EmailService;
