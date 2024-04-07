"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    ;
    async getUserById(id) {
        try {
            // If no parameters are provided, return an error
            if (!id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by user_id
            const data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserByUsername(username) {
        try {
            // If no parameters are provided, return an error
            if (!username)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by username
            const data = await this.userRepository.findUserByUsername(username);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserByEmail(email) {
        try {
            // If no parameters are provided, return an error
            if (!email)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by email
            const data = await this.userRepository.findUserByEmail(email);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async updateUser(id, user) {
        try {
            // If no parameters are provided, return an error
            if (!id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by email
            const data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return await this.userRepository.updateUser(id, user);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async deleteUserById(id) {
        try {
            // If no parameters are provided, return an error
            if (!id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by email
            const data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            await this.userRepository.deleteUser(id);
            return "User deleted successfully";
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async searchUserByFields(search) {
        try {
            // If no parameters are provided, return an error
            if (!search)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by search query
            return await this.userRepository.searchUsersByQuery(search);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = UserService;
