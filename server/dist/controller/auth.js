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
const authTokens_1 = require("../util/authTokens");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const cookieOptions_1 = __importDefault(require("../config/cookieOptions"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const encrypt_1 = __importDefault(require("../util/encrypt"));
const decrypt_1 = __importDefault(require("../util/decrypt"));
const query_1 = __importDefault(require("../database/query"));
dotenv.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password, first_name, last_name } = req.body;
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        const sqlSelect = "SELECT * FROM USERS WHERE EMAIL = ? OR USERNAME = ?";
        const sqlInsert = "INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, FIRST_NAME, LAST_NAME) VALUES (?, ?, ?, ?, ?)";
        // Check to see if the user is already in the database.
        const [user] = yield (0, query_1.default)(sqlSelect, [email, username]);
        if (user)
            return res.status(409).send({ message: "User is already exists" });
        // Save the user to the database
        yield (0, query_1.default)(sqlInsert, [username, email, hashPassword, first_name, last_name]);
        return res.status(200).send({ message: "Registration is successful" });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
    ;
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const isMissing = (!req.body || (!username && !email) || !password);
        const sql = "SELECT * FROM USERS WHERE (USERNAME = ? OR EMAIL = ?)";
        if (isMissing)
            return res.status(400).send({ message: "Missing required fields" });
        // Check if the user is exists.
        const [user] = yield (0, query_1.default)(sql, [username || "", email || ""]);
        if (!user)
            return res.status(404).send({ message: "User not found" });
        // Compare the password from database and from request body.
        if (bcrypt_1.default.compareSync(password, user.PASSWORD)) {
            const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(user);
            const REFRESH_TOKEN = (0, authTokens_1.generateRefreshToken)(user);
            res
                .cookie("REFRESH_TOKEN", REFRESH_TOKEN, cookieOptions_1.default)
                .status(200)
                .send({ message: "Login successfully", token: ACCESS_TOKEN });
            return;
        }
        else {
            return res.status(404).send({ message: "Password is incorrect" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "An error occurred", error });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const sqlSelect = "SELECT * FROM USERS WHERE EMAIL = ?;";
        const sqlInsert = "INSERT INTO RESET_PASSWORD_TOKEN (TOKEN_ID, ENCRYPTED) VALUES (?, ?);";
        // Check if user exists
        const [user] = yield (0, query_1.default)(sqlSelect, [email]);
        if (!user)
            return res.status(404).send({ message: "User doesn't exist" });
        // Generate tokens
        const token = (0, authTokens_1.generateResetToken)(user);
        const shortToken = yield (0, authTokens_1.referenceToken)();
        const encryptedToken = (0, encrypt_1.default)(token);
        const encodedToken = encodeURIComponent(shortToken);
        // Save token to the database
        yield (0, query_1.default)(sqlInsert, [shortToken, encryptedToken]);
        // Send reset password email
        (0, nodemailer_1.default)(email, "Reset Password", encodedToken);
        res.json({ message: "Password reset email sent" });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
exports.forgotPassword = forgotPassword;
const resetPasswordForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        const decodedToken = decodeURIComponent(token);
        const sqlSelect = "SELECT * FROM RESET_PASSWORD_TOKEN WHERE TOKEN_ID = (?);";
        // Check if the token (id) exists in the database.
        const [data] = yield (0, query_1.default)(sqlSelect, [decodedToken]);
        const decryptedToken = (0, decrypt_1.default)(data.ENCRYPTED);
        // then decrypt the code to check if it is still valid.
        jsonwebtoken_1.default.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
            if (error)
                return res.status(500).send({ message: "Cannot access the reset password form", error });
            const { email, user_id } = decode;
            res.status(200).render("resetPassword", { email, user_id });
        });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
});
exports.resetPasswordForm = resetPasswordForm;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId, user_id, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword)
            return res.status(422).send({ message: "Password does not match confirm password" });
        if (password.length <= 5)
            return res.status(400).json({ error: "Password should be at least 5 characters long." });
        // Used limit here due to "safe update mode" error.
        const sqlDelete = "DELETE FROM RESET_PASSWORD_TOKEN WHERE id = (?) LIMIT 1;";
        const sqlUpdate = "UPDATE USERS SET PASSWORD = (?) WHERE EMAIL = (?) AND USER_ID = (?);";
        const sqlSelect = "SELECT * FROM USERS WHERE EMAIL = (?) AND USER_ID = (?);";
        const decodedTokenId = decodeURIComponent(tokenId);
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // Check if the user exists.
        const [user] = yield (0, query_1.default)(sqlSelect, [email, user_id]);
        if (!user)
            return res.status(404).send({ message: "User not found" });
        // Update the user's password and delete the reset password token from the database.
        yield (0, query_1.default)(sqlUpdate, [hashPassword, email, user_id]);
        yield (0, query_1.default)(sqlDelete, [decodedTokenId]);
        res.status(200).send({ message: "Reset password successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error });
    }
    ;
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
