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
exports.logout = exports.resetPassword = exports.resetPasswordForm = exports.forgotPassword = exports.login = exports.register = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const cookieOptions_1 = __importDefault(require("../config/cookieOptions"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
dotenv.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, first_name, last_name } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    database_1.default.query(sql, [email, username], (err, data) => {
        if (err)
            return res.status(500).send(err);
        if (data.length)
            return res.status(409).send({ message: "User is already exists" });
        const sql = "INSERT INTO users(`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?)";
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        const values = [username, email, hashPassword, first_name, last_name];
        database_1.default.query(sql, [values], (error, data) => {
            if (error)
                return res.status(500).send(error);
            return res.status(200).send({ message: "Registration is successful" });
        });
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = (?) OR email =(?)";
    database_1.default.query(sql, [username, email], (error, data) => {
        if (error)
            return res.status(500).send(error);
        if (!data.length)
            return res.status(404).send({ message: "User not found" });
        let [userDetails] = data;
        // '!' non-null assertion operator 
        const ACCESS_SECRET = process.env.ACCESS_TKN_SECRET;
        const REFRESH_SECRET = process.env.REFRESH_TKN_SECRET;
        if (bcrypt_1.default.compareSync(password, userDetails.password)) {
            const ACCESS_TOKEN = jsonwebtoken_1.default.sign({ user_id: userDetails.user_id, roles: userDetails.roles }, ACCESS_SECRET, { expiresIn: "15m" });
            const REFRESH_TKN = jsonwebtoken_1.default.sign({ user_id: userDetails.user_id, username: userDetails.username }, REFRESH_SECRET, { expiresIn: "7d" });
            res
                .cookie("REFRESH_TOKEN", REFRESH_TKN, cookieOptions_1.default)
                .status(200)
                .send({ message: "Login successfully", token: ACCESS_TOKEN });
            return;
        }
        else {
            return res.status(404).send({ message: "Password is incorrect" });
        }
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const sql = "SELECT * FROM users WHERE email = (?);";
    database_1.default.query(sql, [email], (error, data) => {
        if (error)
            return res.status(500).send({ error, message: "Forgot password failed" });
        if (!data.length)
            return res.status(404).send({ error, message: "User doesn't exists" });
        let [user] = data;
        const token = jsonwebtoken_1.default.sign({ email: user.email, user_id: user.user_id }, process.env.RESET_PWD_TKN_SECRET, { expiresIn: "1hr", });
        (0, nodemailer_1.default)(email, "Reset Password", token);
        res.json({ message: "Password reset email sent" });
    });
});
exports.forgotPassword = forgotPassword;
const resetPasswordForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // need this because of the query parameter can be a single value or an array of values
    const token = req.query.token;
    jsonwebtoken_1.default.verify(token, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
        if (error)
            return res.status(500).send({ message: "Cannot access the reset password form", error });
        const { email, user_id } = decode;
        res.status(200).render("resetPassword", { email, user_id });
    });
});
exports.resetPasswordForm = resetPasswordForm;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, user_id, password, confirmPassword } = req.body;
    const isMatch = password !== confirmPassword;
    const errMsg = "Password does not match confirm password";
    if (isMatch)
        return res.status(401).send({ message: errMsg });
    const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
    const sql = `
    SELECT * FROM users WHERE email = (?) AND user_id = (?);
    UPDATE users SET password = (?) WHERE email = (?) AND user_id = (?);
  `;
    database_1.default.query(sql, [
        email, user_id,
        hashPassword, email, user_id
    ], (error, data) => {
        if (error)
            return res.status(500).send({ message: "Reset password failed", error });
        if (!data.length)
            return res.status(404).send({ message: "User not found" });
        res.status(200).send({ message: "Reset password successfully" });
    });
});
exports.resetPassword = resetPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("REFRESH_TOKEN", {
        sameSite: "none",
        secure: cookieOptions_1.default.secure,
        httpOnly: true,
    })
        .status(200)
        .send({ message: "Logout successfully" });
});
exports.logout = logout;
