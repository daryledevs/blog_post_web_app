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
const user_model_1 = __importDefault(require("@/domain/models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const crypto_service_lib_1 = __importDefault(require("@/application/libs/crypto-service.lib"));
const email_service_lib_1 = __importDefault(require("@/application/libs/email-service.lib"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
const auth_token_util_1 = __importStar(require("@/application/utils/auth-token.util"));
class AuthService {
    authRepository;
    userRepository;
    wrap = new async_wrapper_util_1.default();
    constructor(authRepository, userRepository) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }
    register = this.wrap.serviceWrap(async (userDto) => {
        // check to see if the user is already in the database.
        const email = await this.userRepository.findUserByEmail(userDto.getEmail());
        // if the email is already in the exists, return an error
        if (email)
            throw api_exception_1.default.HTTP409Error("Email already exists");
        // check to see if the username is already in the database.
        const username = await this.userRepository.findUserByUsername(userDto.getUsername());
        // if the username is already in the database, return an error
        if (username)
            throw api_exception_1.default.HTTP409Error("Username already exists");
        const hashPassword = bcrypt_1.default.hashSync(userDto.getPassword(), bcrypt_1.default.genSaltSync(10));
        userDto.setPassword(hashPassword);
        const userInstance = (0, class_transformer_1.plainToInstance)(user_model_1.default, userDto);
        const newUser = userInstance.save();
        // Save the user to the database
        const user = await this.authRepository.createUser(newUser);
        if (!user)
            throw api_exception_1.default.HTTP400Error("User not created");
        const newUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, user, {
            excludeExtraneousValues: true,
        });
        return { message: "Registration is successful", user: newUserDto };
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
        if (!isPasswordMatch) {
            throw api_exception_1.default.HTTP401Error("Invalid password");
        }
        const args = {
            accessToken: {
                payload: { tkn_user_uuid: user.uuid, roles: user.roles },
                secret: auth_token_util_1.TokenSecret.ACCESS_SECRET,
                expiration: auth_token_util_1.Expiration.ACCESS_TOKEN_EXPIRATION,
            },
            refreshToken: {
                payload: { tkn_user_uuid: user.uuid, username: user.username },
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
                email: user.getEmail(),
                user_id: user.getId(),
            },
            secret: auth_token_util_1.TokenSecret.RESET_SECRET,
            expiration: auth_token_util_1.Expiration.RESET_TOKEN_EXPIRATION,
        };
        // Generate tokens
        const resetToken = auth_token_util_1.default.generateToken(args);
        const shortToken = await auth_token_util_1.default.referenceToken();
        const encryptedToken = crypto_service_lib_1.default.encryptData(resetToken);
        const encodedToken = encodeURIComponent(shortToken);
        // Save token to the database
        await this.authRepository.saveResetToken({
            user_id: user.getId(),
            encrypted: encryptedToken,
        });
        // Send reset password email
        email_service_lib_1.default.sendEmail(user.getEmail(), "Reset Password", encodedToken);
        return "Token sent to your email";
    });
    resetPasswordForm = this.wrap.serviceWrap(async (tokenId) => {
        const decodedToken = decodeURIComponent(tokenId);
        // Check if the token (id) exists in the database.
        const data = await this.authRepository.findResetTokenById(decodedToken);
        if (!data)
            throw api_exception_1.default.HTTP400Error("Invalid or expired token");
        const decryptedToken = crypto_service_lib_1.default.decryptData(data.encrypted);
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
        if (passwordLength) {
            throw api_exception_1.default.HTTP400Error("Password must be at least 6 characters");
        }
        // Decrypt the token
        const decodedTokenId = decodeURIComponent(tokenId);
        const hashPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_id);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Update the user's password and delete the reset password token from the database.
        await this.userRepository.updateUserById(user_id, {
            password: hashPassword,
        });
        await this.authRepository.deleteResetToken(decodedTokenId);
        // add here confirmation email to the user that the password has been reset.
        return "Reset password successfully";
    });
}
;
exports.default = AuthService;
