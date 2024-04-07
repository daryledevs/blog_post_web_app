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
// Create a mock of the user service
let users = (0, user_mock_1.createUserList)(10);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0];
vitest_1.vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
            findUserById: vitest_1.vi
                .fn()
                .mockImplementation((id) => users.find((u) => u.user_id === id)),
            findUserByUsername: vitest_1.vi
                .fn()
                .mockImplementation((username) => users.find((u) => u.username === username)),
            findUserByEmail: vitest_1.vi
                .fn()
                .mockImplementation((email) => users.find((u) => u.email === email)),
            updateUser: vitest_1.vi.fn().mockImplementation((id, user) => {
                const index = users.findIndex((u) => u.user_id === id);
                if (index === -1)
                    throw error_exception_1.default.badRequest("User not found");
                return (users[index] = { ...users[index], ...user });
            }),
            deleteUser: vitest_1.vi.fn().mockImplementation((id) => {
                const user = users.find((u) => u.user_id === id);
                if (!user)
                    throw error_exception_1.default.badRequest("User not found");
                return users.filter((u) => u.user_id !== id);
            }),
            searchUserByFields: vitest_1.vi
                .fn()
                .mockImplementation((search) => users.find((u) => u.username === search)),
            searchUsersByQuery: vitest_1.vi
                .fn()
                .mockImplementation((search) => users.filter((u) => u.username.includes(search) ||
                u?.first_name?.includes(search) ||
                u?.last_name?.includes(search) ||
                `${u?.first_name} ${u?.last_name}`.includes(search))),
        })),
    };
});
(0, vitest_1.describe)("UserService", () => {
    let userService;
    let userRepository;
    let noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    let userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
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
            const result = await userService.getUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe(existingUser);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.getUserById(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(userService.getUserById(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("getUserByUsername (Get user's data by username)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await userService.getUserByUsername(existingUser.username);
            (0, vitest_1.expect)(result).toBe(existingUser);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.getUserByUsername(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(userService.getUserByUsername(notFoundUser.username)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("getUserByEmail (Get user data by email)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await userService.getUserByEmail(existingUser.email);
            (0, vitest_1.expect)(result).toBe(existingUser);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.getUserByEmail(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(userService.getUserByEmail(notFoundUser.email)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("updateUser (Update user's data)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await userService.updateUser(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(result).toStrictEqual(existingUser);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.updateUser(undefined, existingUser)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(userService.updateUser(notFoundUser.user_id, notFoundUser)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("deleteUserById (Delete user's data)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await userService.deleteUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe("User deleted successfully");
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.deleteUserById(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(userService.deleteUserById(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("searchUserByFields (Find users by search)", () => {
        (0, vitest_1.test)("should return the correct result with username", async () => {
            const result = await userService.searchUserByFields(existingUser.username);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
        });
        (0, vitest_1.test)("should return the correct result with first name", async () => {
            const result = await userService.searchUserByFields(existingUser.first_name);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
        });
        (0, vitest_1.test)("should return the correct result with last name", async () => {
            const result = await userService.searchUserByFields(existingUser.last_name);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
        });
        (0, vitest_1.test)("should return the correct result with first and last name", async () => {
            const result = await userService.searchUserByFields(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(userService.searchUserByFields(undefined)).rejects.toThrow(noArgsMsgError);
        });
    });
});
