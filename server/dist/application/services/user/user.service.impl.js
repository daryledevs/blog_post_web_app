"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserById = async (uuid) => {
        // search the user by id, return an error if the user is not found
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return this.plainToDto(user);
    };
    getUserByUsername = async (username) => {
        // search the user by username, return an error if the user is not found
        const user = await this.userRepository.findUserByUsername(username);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return this.plainToDto(user);
    };
    getUserByEmail = async (email) => {
        // search the user by email, return an error if the user is not found
        const user = await this.userRepository.findUserByEmail(email);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return this.plainToDto(user);
    };
    updateUserById = async (uuid, data) => {
        // search the user by email, return an error if the user is not found
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        const updatedUser = await this.userRepository.updateUserById(uuid, data);
        if (!updatedUser) {
            throw api_exception_1.default.HTTP500Error("Failed to update user");
        }
        return this.plainToDto(user);
    };
    deleteUserById = async (uuid) => {
        // search the user by email, return an error if the user is not found
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        await this.userRepository.deleteUserById(user.getId());
        return "User deleted successfully";
    };
    searchUserByFields = async (search) => {
        // If no parameters are provided, return an error
        if (!search)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by search query
        const searches = await this.userRepository.searchUsersByQuery(search);
        return searches.map((user) => (0, class_transformer_1.plainToInstance)(user_dto_1.default, user));
    };
    plainToDto = (user) => {
        return (0, class_transformer_1.plainToInstance)(user_dto_1.default, user, {
            excludeExtraneousValues: true,
        });
    };
}
exports.default = UserService;
