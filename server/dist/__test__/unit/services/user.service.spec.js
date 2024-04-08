"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_impl_1 = __importDefault(require("@/services/user/user.service.impl"));
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const user_mock_1 = require("@/__mock__/data/user.mock");
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
(0, vitest_1.describe)("UserService", () => {
    let userService;
    let userRepository;
    const noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    const userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
    // Create a mock of the user service
    let users = (0, user_mock_1.createUserList)(10);
    const notFoundUser = (0, user_mock_1.createUser)();
    const existingUser = users[0];
    (0, vitest_1.beforeEach)(() => {
        userRepository = new user_repository_impl_1.default();
        userService = new user_service_impl_1.default(userRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getUserById (Get user's data by id)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            const result = await userService.getUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.getUserById(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(userService.getUserById(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.user_id);
        });
    });
    (0, vitest_1.describe)("getUserByUsername (Get user's data by username)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserByUsername = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            const result = await userService.getUserByUsername(existingUser.username);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(userRepository.findUserByUsername)
                .toHaveBeenCalledWith(existingUser.username);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.getUserByUsername(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserByUsername).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserByUsername = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(userService.getUserByUsername(notFoundUser.username)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserByUsername)
                .toHaveBeenCalledWith(notFoundUser.username);
        });
    });
    (0, vitest_1.describe)("getUserByEmail (Get user data by email)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserByEmail = vitest_1.vi.fn().mockResolvedValue(existingUser);
            const result = await userService.getUserByEmail(existingUser.email);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(userRepository.findUserByEmail)
                .toHaveBeenCalledWith(existingUser.email);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.getUserByEmail(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserByEmail).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserByEmail = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(userService.getUserByEmail(notFoundUser.email)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserByEmail)
                .toHaveBeenCalledWith(notFoundUser.email);
        });
    });
    (0, vitest_1.describe)("updateUser (Update user's data)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            userRepository.updateUser = vitest_1.vi.fn().mockResolvedValue(existingUser);
            const result = await userService.updateUser(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(result).toStrictEqual(existingUser);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.updateUser(undefined, existingUser)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(userRepository.updateUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(userService.updateUser(notFoundUser.user_id, notFoundUser)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(userRepository.updateUser).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("deleteUserById (Delete user's data)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            userRepository.deleteUser = vitest_1.vi.fn();
            const result = await userService.deleteUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe("User deleted successfully");
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(userRepository.deleteUser)
                .toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.deleteUserById(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(userRepository.deleteUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(userService.deleteUserById(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(userRepository.deleteUser).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("searchUserByFields (Find users by search)", () => {
        (0, vitest_1.test)("should return the correct result with username", async () => {
            userRepository.searchUsersByQuery = vitest_1.vi
                .fn()
                .mockResolvedValue([existingUser]);
            const result = await userService
                .searchUserByFields(existingUser.username);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery)
                .toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery).toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the correct result with first name", async () => {
            userRepository.searchUsersByQuery = vitest_1.vi
                .fn()
                .mockResolvedValue([existingUser]);
            const result = await userService
                .searchUserByFields(existingUser.first_name);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery)
                .toHaveBeenCalledWith(existingUser.first_name);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery).toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the correct result with last name", async () => {
            userRepository.searchUsersByQuery = vitest_1.vi
                .fn()
                .mockResolvedValue([existingUser]);
            const result = await userService
                .searchUserByFields(existingUser.last_name);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery)
                .toHaveBeenCalledWith(existingUser.last_name);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery).toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the correct result with first and last name", async () => {
            userRepository.searchUsersByQuery = vitest_1.vi
                .fn()
                .mockResolvedValue([existingUser]);
            const result = await userService.searchUserByFields(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery).toHaveBeenCalledWith(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery).toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return an empty array", async () => {
            userRepository.searchUsersByQuery = vitest_1.vi
                .fn()
                .mockResolvedValue([]);
            const result = await userService.searchUserByFields(notFoundUser.username);
            (0, vitest_1.expect)(result).toStrictEqual([]);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery)
                .toHaveBeenCalledWith(notFoundUser.username);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.searchUserByFields(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.searchUsersByQuery).not.toHaveBeenCalled();
        });
    });
});
