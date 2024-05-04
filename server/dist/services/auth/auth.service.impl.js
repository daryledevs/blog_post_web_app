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
const bcrypt_1 = __importDefault(require("bcrypt"));
const send_email_lib_1 = __importDefault(require("@/libraries/nodemailer/send-email.lib"));
const crypto_lib_1 = __importDefault(require("@/libraries/crypto/crypto.lib"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const auth_token_util_1 = __importStar(require("@/utils/auth-token.util"));
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
        if (!email || !username || !password) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // Check if the password is less than 6 characters
        if (password.length <= 5) {
            throw api_exception_1.default.HTTP400Error("Password must be at least 6 characters");
        }
        // Check to see if the user is already in the database.
        const userByEmail = await this.userRepository.findUserByEmail(email);
        if (userByEmail)
            throw api_exception_1.default.HTTP409Error("Email already exists");
        const userByUsername = await this.userRepository.findUserByUsername(username);
        if (userByUsername)
            throw api_exception_1.default.HTTP409Error("Username already exists");
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
        console.log(password, user.password, isPasswordMatch);
        // If the password is incorrect, return an error
        if (!isPasswordMatch)
            throw api_exception_1.default.HTTP401Error("Invalid password");
        const args = {
            accessToken: {
                payload: { user_id: user.user_id, roles: user.roles },
                secret: auth_token_util_1.TokenSecret.ACCESS_SECRET,
                expiration: auth_token_util_1.Expiration.ACCESS_TOKEN_EXPIRATION,
            },
            refreshToken: {
                payload: { user_id: user.user_id, username: user.username },
                secret: auth_token_util_1.TokenSecret.REFRESH_SECRET,
                expiration: auth_token_util_1.Expiration.REFRESH_TOKEN_EXPIRATION,
            },
        };
        // Generate tokens
        const ACCESS_TOKEN = auth_token_util_1.default.generateToken(args.accessToken);
        const REFRESH_TOKEN = auth_token_util_1.default.generateToken(args.refreshToken);
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
        const args = {
            payload: {
                email: data.email,
                user_id: user.user_id,
            },
            secret: auth_token_util_1.TokenSecret.RESET_SECRET,
            expiration: auth_token_util_1.Expiration.RESET_TOKEN_EXPIRATION,
        };
        // Generate tokens
        const resetToken = auth_token_util_1.default.generateToken(args);
        const shortToken = await auth_token_util_1.default.referenceToken();
        const encryptedToken = crypto_lib_1.default.encryptData(resetToken);
        const encodedToken = encodeURIComponent(shortToken);
        // Save token to the database
        await this.authRepository.saveResetToken({
            user_id: user.user_id,
            encrypted: encryptedToken,
        });
        // Send reset password email
        (0, send_email_lib_1.default)(data.email, "Reset Password", encodedToken);
        return "Token sent to your email";
    });
    resetPasswordForm = this.wrap.serviceWrap(async (tokenId) => {
        const decodedToken = decodeURIComponent(tokenId);
        // Check if the token (id) exists in the database.
        const data = await this.authRepository.findResetTokenById(decodedToken);
        if (!data)
            throw api_exception_1.default.HTTP400Error("Invalid or expired token");
        const decryptedToken = crypto_lib_1.default.decryptData(data.encrypted);
        // then decrypt the code to check if it is still valid.
        return auth_token_util_1.default.verifyResetPasswordToken(decryptedToken, tokenId);
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
