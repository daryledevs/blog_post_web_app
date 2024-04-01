"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const send_email_util_1 = __importDefault(require("@/utils/send-email.util"));
const crypto_util_1 = __importDefault(require("@/utils/crypto.util"));
const auth_token_util_1 = __importDefault(require("@/utils/auth-token.util"));
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
class AuthService {
    authRepository;
    userRepository;
    constructor(authRepository, userRepository) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }
    async register(data) {
        try {
            const { email, username, password } = data;
            const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
            if (!email || !username || !password)
                throw error_exception_1.default.badRequest("All fields are required");
            if (password.length <= 5)
                throw error_exception_1.default.badRequest("Password must be at least 6 characters");
            // Check to see if the user is already in the database.
            const userByEmail = await this.userRepository.findUserByEmail(email);
            const userByUsername = await this.userRepository.findUserByUsername(username);
            if (userByUsername)
                throw error_exception_1.default.conflict("Username already exists");
            if (userByEmail)
                throw error_exception_1.default.conflict("Email already exists");
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
            const user = await this.userRepository.findUserByCredentials(userCredential);
            if (!user)
                throw error_exception_1.default.notFound("User not found");
            const isPasswordMatch = bcrypt_1.default.compareSync(password, user.password);
            if (!isPasswordMatch)
                throw error_exception_1.default.unauthorized("Invalid password");
            const ACCESS_TOKEN = auth_token_util_1.default.generateAccessToken(user);
            const REFRESH_TOKEN = auth_token_util_1.default.generateRefreshToken(user);
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
                throw error_exception_1.default.notFound("User not found");
            // Generate tokens
            const resetToken = auth_token_util_1.default.generateResetToken({
                EMAIL: data.email,
                user_id: user.user_id,
            });
            const shortToken = await auth_token_util_1.default.referenceToken();
            const encryptedToken = crypto_util_1.default.encryptData(resetToken);
            const encodedToken = encodeURIComponent(shortToken);
            // Save token to the database
            await this.authRepository.saveResetToken({
                user_id: user.user_id,
                encrypted: encryptedToken,
            });
            // Send reset password email
            (0, send_email_util_1.default)(data.email, "Reset Password", encodedToken);
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
                throw error_exception_1.default.badRequest("Invalid or expired token");
            const decryptedToken = crypto_util_1.default.decryptData(data.encrypted);
            // then decrypt the code to check if it is still valid.
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
                    if (error)
                        reject(error_exception_1.default.badRequest("Invalid or expired token"));
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
                throw error_exception_1.default.badRequest("Password does not match");
            if (passwordLength)
                throw error_exception_1.default.badRequest("Password must be at least 6 characters");
            const decodedTokenId = decodeURIComponent(tokenId);
            const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
            // Check if the user exists.
            const user = await this.userRepository.findUserById(user_id);
            if (!user)
                throw error_exception_1.default.notFound("User not found");
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
