"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class UserService {
    wrap = new async_wrapper_util_1.default();
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserById = this.wrap.serviceWrap(async (uuid) => {
        // If no parameters are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by user_id
        const data = await this.userRepository.findUserById(uuid);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return data;
    });
    getUserByUsername = this.wrap.serviceWrap(async (username) => {
        // If no parameters are provided, return an error
        if (!username)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by username
        const data = await this.userRepository.findUserByUsername(username);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return data;
    });
    getUserByEmail = this.wrap.serviceWrap(async (email) => {
        // If no parameters are provided, return an error
        if (!email)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by email
        const data = await this.userRepository.findUserByEmail(email);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return data;
    });
    updateUserById = this.wrap.serviceWrap(async (uuid, user) => {
        // If no parameters are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by email
        const data = await this.userRepository.findUserById(uuid);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return await this.userRepository.updateUserById(uuid, user);
    });
    deleteUserById = this.wrap.serviceWrap(async (uuid) => {
        // If no parameters are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by email
        const data = await this.userRepository.findUserById(uuid);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        await this.userRepository.deleteUserById(uuid);
        return "User deleted successfully";
    });
    searchUserByFields = this.wrap.serviceWrap(async (search) => {
        // If no parameters are provided, return an error
        if (!search)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by search query
        return await this.userRepository.searchUsersByQuery(search);
    });
}
exports.default = UserService;
