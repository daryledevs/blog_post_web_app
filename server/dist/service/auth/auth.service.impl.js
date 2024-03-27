"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authTokens_1 = require("@/util/authTokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const exception_1 = __importDefault(require("@/exception/exception"));
const nodemailer_1 = __importDefault(require("@/config/nodemailer"));
const encrypt_1 = __importDefault(require("@/util/encrypt"));
const decrypt_1 = __importDefault(require("@/util/decrypt"));
const auth_repository_1 = __importDefault(require("@/repository/auth.repository"));
const user_repository_1 = __importDefault(require("@/repository/user.repository"));
class AuthService {
    constructor() {
        this.authRepository = new auth_repository_1.default();
        this.userRepository = new user_repository_1.default();
    }
    async register(data) {
        try {
            const { email, username, password } = data;
            const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
            // Check to see if the user is already in the database.
            const user = await this.userRepository.findUserByCredentials(username, email);
            if (user)
                throw exception_1.default.conflict("User already exists");
            // Save the user to the database
            await this.authRepository.createUser({ ...data, password: hashPassword });
            return "Registration is successful";
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async login(userCredential, password) {
        try {
            const user = await this.userRepository.findUserByCredentials(userCredential, // username 
            userCredential // or email
            );
            if (!user)
                throw exception_1.default.notFound("User not found");
            const isPasswordMatch = bcrypt_1.default.compareSync(password, user.password);
            if (!isPasswordMatch)
                throw exception_1.default.unauthorized("Invalid password");
            const ACCESS_TOKEN = (0, authTokens_1.generateAccessToken)(user);
            const REFRESH_TOKEN = (0, authTokens_1.generateRefreshToken)(user);
            return { message: "Login successfully", token: ACCESS_TOKEN, refreshToken: REFRESH_TOKEN, };
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async forgotPassword(data) {
        try {
            const user = await this.userRepository.findUserByEmail(data.email);
            if (!user)
                throw exception_1.default.notFound("User not found");
            // Generate tokens
            const resetToken = (0, authTokens_1.generateResetToken)({
                EMAIL: data.email,
                user_id: user.user_id,
            });
            const shortToken = await (0, authTokens_1.referenceToken)();
            const encryptedToken = (0, encrypt_1.default)(resetToken);
            const encodedToken = encodeURIComponent(shortToken);
            // Save token to the database
            await this.authRepository.saveResetToken({
                user_id: user.user_id,
                encrypted: encryptedToken,
            });
            // Send reset password email
            (0, nodemailer_1.default)(data.email, "Reset Password", encodedToken);
            return "Token sent to your email";
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async resetPasswordForm(tokenId) {
        try {
            const decodedToken = decodeURIComponent(tokenId);
            // Check if the token (id) exists in the database.
            const data = await this.authRepository.findResetTokenById(decodedToken);
            if (!data)
                throw exception_1.default.badRequest("Invalid or expired token");
            const decryptedToken = (0, decrypt_1.default)(data.encrypted);
            // then decrypt the code to check if it is still valid.
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
                    if (error)
                        reject(exception_1.default.badRequest("Invalid or expired token"));
                    const { email, user_id } = decode;
                    resolve({
                        render: "resetPassword",
                        data: { email, user_id, tokenId },
                    });
                });
            });
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async resetPassword(data) {
        try {
            const { tokenId, user_id, email, password, confirmPassword } = data;
            const isPasswordMismatch = password !== confirmPassword;
            const passwordLength = password.length <= 5;
            if (isPasswordMismatch)
                throw exception_1.default.badRequest("Password does not match");
            if (passwordLength)
                throw exception_1.default.badRequest("Password must be at least 6 characters");
            const decodedTokenId = decodeURIComponent(tokenId);
            const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
            // Check if the user exists.
            const user = await this.userRepository.findUserById(user_id);
            if (!user)
                throw exception_1.default.notFound("User not found");
            // Update the user's password and delete the reset password token from the database.
            await this.userRepository.updateUser(user_id, { password: hashPassword });
            await this.authRepository.deleteResetToken(decodedTokenId);
            // add here confirmation email to the user that the password has been reset.
            return "Reset password successfully";
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = AuthService;
