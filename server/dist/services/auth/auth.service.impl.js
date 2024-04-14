"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const send_email_util_1 = __importDefault(require("@/utils/send-email.util"));
const crypto_util_1 = __importDefault(require("@/utils/crypto.util"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const auth_token_util_1 = __importDefault(require("@/utils/auth-token.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class AuthService {
    authRepository;
    userRepository;
    wrap = new async_wrapper_util_1.default();
    constructor(authRepository, userRepository) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }
    register = this.wrap.serviceWrap(async (data) => {
        const { email, username, password } = data;
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // Check if the user has provided all the required fields
        if (!email || !username || !password)
            throw api_exception_1.default
                .HTTP400Error("All fields are required");
        // Check if the password is less than 6 characters
        if (password.length <= 5)
            throw api_exception_1.default
                .HTTP400Error("Password must be at least 6 characters");
        // Check to see if the user is already in the database.
        const userByEmail = await this.userRepository.findUserByEmail(email);
        const userByUsername = await this.userRepository
            .findUserByUsername(username);
        if (userByUsername)
            throw api_exception_1.default
                .HTTP409Error("Username already exists");
        if (userByEmail)
            throw api_exception_1.default
                .HTTP409Error("Email already exists");
        // Save the user to the database
        await this.authRepository.createUser({ ...data, password: hashPassword });
        return "Registration is successful";
    });
    login = this.wrap.serviceWrap(async (userCredential, password) => {
        // Check if the user exists in the database
        const user = await this.userRepository.findUserByCredentials(userCredential);
        // If the user does not exist, return an error
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Check if the password is correct
        const isPasswordMatch = bcrypt_1.default.compareSync(password, user.password);
        // If the password is incorrect, return an error
        if (!isPasswordMatch)
            throw api_exception_1.default
                .HTTP401Error("Invalid password");
        // Generate tokens
        const ACCESS_TOKEN = auth_token_util_1.default.generateAccessToken(user);
        const REFRESH_TOKEN = auth_token_util_1.default.generateRefreshToken(user);
        return {
            message: "Login successfully",
            token: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN,
        };
    });
    forgotPassword = this.wrap.serviceWrap(async (data) => {
        // If the user is not found, return an error
        const user = await this.userRepository.findUserByEmail(data.email);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
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
    });
    resetPasswordForm = this.wrap.serviceWrap(async (tokenId) => {
        const decodedToken = decodeURIComponent(tokenId);
        // Check if the token (id) exists in the database.
        const data = await this.authRepository.findResetTokenById(decodedToken);
        if (!data)
            throw api_exception_1.default.HTTP400Error("Invalid or expired token");
        const decryptedToken = crypto_util_1.default.decryptData(data.encrypted);
        // then decrypt the code to check if it is still valid.
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(decryptedToken, process.env.RESET_PWD_TKN_SECRET, (error, decode) => {
                if (error)
                    reject(api_exception_1.default.HTTP400Error("Invalid or expired token"));
                const { email, user_id } = decode;
                resolve({
                    render: "resetPassword",
                    data: { email, user_id, tokenId },
                });
            });
        });
    });
    resetPassword = this.wrap.serviceWrap(async (data) => {
        const { tokenId, user_id, email, password, confirmPassword } = data;
        const isPasswordMismatch = password !== confirmPassword;
        const passwordLength = password.length <= 5;
        // Check if the password and confirm password match
        if (isPasswordMismatch)
            throw api_exception_1.default
                .HTTP400Error("Password does not match");
        // Check if the password is less than 6 characters
        if (passwordLength)
            throw api_exception_1.default
                .HTTP400Error("Password must be at least 6 characters");
        // Decrypt the token
        const decodedTokenId = decodeURIComponent(tokenId);
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_id);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Update the user's password and delete the reset password token from the database.
        await this.userRepository.updateUser(user_id, { password: hashPassword });
        await this.authRepository.deleteResetToken(decodedTokenId);
        // add here confirmation email to the user that the password has been reset.
        return "Reset password successfully";
    });
}
;
exports.default = AuthService;
