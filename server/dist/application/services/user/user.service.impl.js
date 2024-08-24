"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
class UserService {
    wrap = new async_wrapper_util_1.default();
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserById = this.wrap.serviceWrap(async (uuid) => {
        // search the user by id, return an error if the user is not found
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return this.userDtoClass(user);
    });
    getUserByUsername = this.wrap.serviceWrap(async (username) => {
        // search the user by username, return an error if the user is not found
        const user = await this.userRepository.findUserByUsername(username);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return this.userDtoClass(user);
    });
    getUserByEmail = this.wrap.serviceWrap(async (email) => {
        // search the user by email, return an error if the user is not found
        const user = await this.userRepository.findUserByEmail(email);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return this.userDtoClass(user);
    });
    updateUserById = this.wrap.serviceWrap(async (uuid, data) => {
        // search the user by email, return an error if the user is not found
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        const updatedUser = await this.userRepository.updateUserById(uuid, data);
        if (!updatedUser)
            throw api_exception_1.default.HTTP500Error("Failed to update user");
        return this.userDtoClass(user);
    });
    deleteUserById = this.wrap.serviceWrap(async (uuid) => {
        // search the user by email, return an error if the user is not found
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        await this.userRepository.deleteUserById(user.getId());
        return "User deleted successfully";
    });
    searchUserByFields = this.wrap.serviceWrap(async (search) => {
        // If no parameters are provided, return an error
        if (!search)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // search the user by search query
        const searches = await this.userRepository.searchUsersByQuery(search);
        return searches.map((user) => (0, class_transformer_1.plainToInstance)(user_dto_1.default, user));
    });
    userDtoClass = (user) => {
        return (0, class_transformer_1.plainToInstance)(user_dto_1.default, user, {
            excludeExtraneousValues: true,
        });
    };
}
exports.default = UserService;
