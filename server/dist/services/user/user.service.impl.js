"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    ;
    async getUserById(id) {
        // If no parameters are provided, return an error
        if (!id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by user_id
        const data = await this.userRepository.findUserById(id);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return data;
    }
    ;
    async getUserByUsername(username) {
        // If no parameters are provided, return an error
        if (!username)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by username
        const data = await this.userRepository.findUserByUsername(username);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return data;
    }
    ;
    async getUserByEmail(email) {
        // If no parameters are provided, return an error
        if (!email)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by email
        const data = await this.userRepository.findUserByEmail(email);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return data;
    }
    ;
    async updateUser(id, user) {
        // If no parameters are provided, return an error
        if (!id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by email
        const data = await this.userRepository.findUserById(id);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        return await this.userRepository.updateUser(id, user);
    }
    ;
    async deleteUserById(id) {
        // If no parameters are provided, return an error
        if (!id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by email
        const data = await this.userRepository.findUserById(id);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("User not found");
        await this.userRepository.deleteUser(id);
        return "User deleted successfully";
    }
    ;
    async searchUserByFields(search) {
        // If no parameters are provided, return an error
        if (!search)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by search query
        return await this.userRepository.searchUsersByQuery(search);
    }
    ;
}
;
exports.default = UserService;
