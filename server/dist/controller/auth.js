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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.resetPasswordForm = exports.forgotPassword = exports.login = exports.register = void 0;
const authTokens_1 = require("../util/authTokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const exception_1 = __importDefault(require("../exception/exception"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const dotenv = __importStar(require("dotenv"));
const encrypt_1 = __importDefault(require("../util/encrypt"));
const decrypt_1 = __importDefault(require("../util/decrypt"));
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const auth_repository_1 = __importDefault(require("../repository/auth-repository"));
dotenv.config();
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // Check to see if the user is already in the database.
        const user = yield user_repository_1.default.findUserByCredentials(username, email);
        if (user)
            return res.status(409).send({ message: "User is already exists" });
        const _a = req.body, { cookieOptions } = _a, rest = __rest(_a, ["cookieOptions"]);
        // Save the user to the database
        yield auth_repository_1.default.createUser(Object.assign(Object.assign({}, rest), { password: hashPassword }));
        return res.status(200).send({ message: "Registration is successful" });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userCredential, password } = req.body;
        const isMissing = !req.body || !userCredential || !password;
        if (isMissing)
            return res.status(400).send({ message: "Missing required fields" });
        // Check if the user is exists.
        const user = yield user_repository_1.default.findUserByCredentials(userCredential, userCredential);
        if (!user)
            return next(exception_1.default.notFound("User not found"));
        // Compare the password from database and from request body.
        if (bcrypt_1.default.compareSync(password, user.PASSWORD)) {
            const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(user);
            const REFRESH_TOKEN = (0, authTokens_1.generateRefreshToken)(user);
            res
                .cookie("REFRESH_TOKEN", REFRESH_TOKEN, req.body.cookieOptions)
                .status(200)
                .send({ message: "Login successfully", token: ACCESS_TOKEN });
            return;
        }
        else {
            return res.status(404).send({ message: "Password is incorrect" });
        }
        ;
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.login = login;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Check if user exists
        const user = yield user_repository_1.default.findUserByEmail(email);
        if (!user)
            next(exception_1.default.notFound("User doesn't exists"));
        // Generate tokens
        const token = (0, authTokens_1.generateResetToken)({ EMAIL: email, USER_ID: user.USER_ID });
        const shortToken = yield (0, authTokens_1.referenceToken)();
        const encryptedToken = (0, encrypt_1.default)(token);
        const encodedToken = encodeURIComponent(shortToken);
        // Save token to the database
        yield auth_repository_1.default.saveResetToken({
            user_id: user.USER_ID,
            encrypted: encryptedToken
        });
        // Send reset password email
        (0, nodemailer_1.default)(email, "Reset Password", encodedToken);
        res.json({ message: "Password reset email sent" });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.forgotPassword = forgotPassword;
const resetPasswordForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        const decodedToken = decodeURIComponent(token);
        // Check if the token (id) exists in the database.
        const data = yield auth_repository_1.default.findResetTokenById(decodedToken);
        const decryptedToken = (0, decrypt_1.default)(data === null || data === void 0 ? void 0 : data.ENCRYPTED);
        // then decrypt the code to check if it is still valid.
        jsonwebtoken_1.default.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
            if (error)
                return next(exception_1.default.badRequest("Invalid or expired token"));
            const { email, user_id } = decode;
            res.status(200).render("resetPassword", { email, user_id });
        });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.resetPasswordForm = resetPasswordForm;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId, user_id, email, password, confirmPassword } = req.body;
        const isPasswordMismatch = password !== confirmPassword;
        const passwordLength = password.length <= 5;
        if (isPasswordMismatch)
            return next(exception_1.default.badRequest("Password does not match"));
        if (passwordLength)
            return next(exception_1.default.badRequest("Password must be at least 6 characters"));
        const decodedTokenId = decodeURIComponent(tokenId);
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // Check if the user exists.
        const user = yield user_repository_1.default.findUserById(user_id);
        if (!user)
            return next(exception_1.default.notFound("User not found"));
        // Update the user's password and delete the reset password token from the database.
        yield user_repository_1.default.updateUser(user_id, { PASSWORD: hashPassword });
        yield auth_repository_1.default.deleteResetToken(decodedTokenId);
        // add here confirmation email to the user that the password has been reset.
        res.status(200).send({ message: "Reset password successfully" });
    }
    catch (error) {
        next(error);
    }
    ;
});
exports.resetPassword = resetPassword;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("REFRESH_TOKEN", {
        sameSite: "none",
        secure: req.body.cookieOptions.secure,
        httpOnly: true,
    })
        .status(200)
        .send({ message: "Logout successfully" });
});
exports.logout = logout;
