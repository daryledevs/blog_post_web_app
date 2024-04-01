"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_impl_1 = __importDefault(require("@/services/user/user.service.impl"));
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const follow_repository_impl_1 = __importDefault(require("@/repositories/follow/follow.repository.impl"));
const recent_search_repository_impl_1 = __importDefault(require("@/repositories/recent-search/recent-search.repository.impl"));
const user_mock_1 = require("@/__mock__/user/user.mock");
const vitest_1 = require("vitest");
let users = (0, user_mock_1.createUserList)(5);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0] || (0, user_mock_1.createUser)();
vitest_1.vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
            findUserById: vitest_1.vi.fn().mockImplementation((id) => users.find((u) => u.user_id === id)),
            findUserByUsername: vitest_1.vi.fn().mockImplementation((username) => users.find((u) => u.username === username)),
            findUserByEmail: vitest_1.vi.fn().mockImplementation((email) => users.find((u) => u.email === email)),
            updateUser: vitest_1.vi.fn().mockImplementation((id, user) => {
                const index = users.findIndex((u) => u.user_id === id);
                if (index === -1)
                    throw error_exception_1.default.badRequest("User not found");
                return users[index] = { ...users[index], ...user };
            }),
            deleteUser: vitest_1.vi.fn().mockImplementation((id) => {
                const index = users.findIndex((u) => u.user_id === id);
                if (index === -1)
                    throw error_exception_1.default.badRequest("User not found");
                users.splice(index, 1);
                return "User deleted successfully";
            }),
        })),
    };
});
vitest_1.vi.mock("@/repositories/follow/follow.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({})),
    };
});
vitest_1.vi.mock("@/repositories/recent search/recent-search.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({}))
    };
});
(0, vitest_1.describe)('UserService', () => {
    let userService;
    (0, vitest_1.beforeEach)(() => {
        userService = new user_service_impl_1.default(new user_repository_impl_1.default(), new follow_repository_impl_1.default(), new recent_search_repository_impl_1.default());
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("Get user's data by id", () => {
        (0, vitest_1.test)("it should get the data", async () => {
            const mockGetUserById = vitest_1.vi.spyOn(userService, "getUserById");
            mockGetUserById.mockResolvedValue(existingUser);
            const result = await userService.getUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(mockGetUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(mockGetUserById).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw error 'no parameters provided'", async () => {
            const arg = undefined;
            const mockGetUserById = vitest_1.vi.spyOn(userService, "getUserById");
            await (0, vitest_1.expect)(userService.getUserById(arg)).rejects.toThrow("No parameters provided");
            (0, vitest_1.expect)(mockGetUserById).toHaveBeenCalledWith(arg);
            (0, vitest_1.expect)(mockGetUserById).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'user not found'", async () => {
            const mockGetUserById = vitest_1.vi.spyOn(userService, "getUserById");
            mockGetUserById.mockRejectedValue(error_exception_1.default.badRequest("User not found"));
            await (0, vitest_1.expect)(userService.getUserById(notFoundUser.user_id)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockGetUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(mockGetUserById).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user's data by username", () => {
        (0, vitest_1.test)("it should get user's data", async () => {
            const mockGetUserByUsername = vitest_1.vi.spyOn(userService, "getUserByUsername");
            mockGetUserByUsername.mockResolvedValue(existingUser);
            const result = await userService.getUserByUsername(existingUser.username);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw error 'user not found'", async () => {
            const mockGetUserByUsername = vitest_1.vi.spyOn(userService, "getUserByUsername");
            mockGetUserByUsername.mockRejectedValue(error_exception_1.default.badRequest("User not found"));
            await (0, vitest_1.expect)(userService.getUserByUsername(notFoundUser.username)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledWith(notFoundUser.username);
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'no parameters provided'", async () => {
            const arg = undefined;
            const mockGetUserByUsername = vitest_1.vi.spyOn(userService, "getUserByUsername");
            mockGetUserByUsername.mockRejectedValue(error_exception_1.default.badRequest("No parameters provided"));
            await (0, vitest_1.expect)(userService.getUserByUsername(arg)).rejects.toThrow("No parameters provided");
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledWith(arg);
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user data by email", async () => {
        (0, vitest_1.test)("it should get user's data", async () => {
            const mockGetUserByEmail = vitest_1.vi.spyOn(userService, "getUserByEmail");
            mockGetUserByEmail.mockResolvedValue(existingUser);
            const result = await userService.getUserByEmail(existingUser.email);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledWith(existingUser.email);
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw error 'user not found'", async () => {
            const mockGetUserByEmail = vitest_1.vi.spyOn(userService, "getUserByEmail");
            mockGetUserByEmail.mockRejectedValue(error_exception_1.default.badRequest("User not found"));
            await (0, vitest_1.expect)(userService.getUserByEmail(notFoundUser.email)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledWith(notFoundUser.email);
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'no parameters provided'", async () => {
            const arg = undefined;
            const mockGetUserByEmail = vitest_1.vi.spyOn(userService, "getUserByEmail");
            mockGetUserByEmail.mockRejectedValue(error_exception_1.default.badRequest("No parameters provided"));
            await (0, vitest_1.expect)(userService.getUserByEmail(arg)).rejects.toThrow("No parameters provided");
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledWith(arg);
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Update user's data", async () => {
        (0, vitest_1.test)("it should update user's data", async () => {
            const mockUpdateUser = vitest_1.vi.spyOn(userService, "updateUser");
            mockUpdateUser.mockResolvedValue(existingUser);
            const result = await userService.updateUser(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(mockUpdateUser).toHaveBeenCalledWith(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(mockUpdateUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'user not found'", async () => {
            const mockUpdateUser = vitest_1.vi.spyOn(userService, "updateUser");
            mockUpdateUser.mockRejectedValue(error_exception_1.default.badRequest("User not found"));
            await (0, vitest_1.expect)(userService.updateUser(notFoundUser.user_id, notFoundUser)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockUpdateUser).toHaveBeenCalledWith(notFoundUser.user_id, notFoundUser);
            (0, vitest_1.expect)(mockUpdateUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'no parameters provided'", async () => {
            const arg = undefined;
            const mockUpdateUser = vitest_1.vi.spyOn(userService, "updateUser");
            mockUpdateUser.mockRejectedValue(error_exception_1.default.badRequest("No parameters provided"));
            await (0, vitest_1.expect)(userService.updateUser(arg, existingUser)).rejects.toThrow("No parameters provided");
            (0, vitest_1.expect)(mockUpdateUser).toHaveBeenCalledWith(arg, existingUser);
            (0, vitest_1.expect)(mockUpdateUser).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Delete user's data", async () => {
        (0, vitest_1.test)("it should delete user", async () => {
            const mockDeleteUser = vitest_1.vi.spyOn(userService, "deleteUserById");
            mockDeleteUser.mockResolvedValue("User deleted successfully");
            const result = await userService.deleteUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe("User deleted successfully");
            (0, vitest_1.expect)(mockDeleteUser).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(mockDeleteUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'user not found'", async () => {
            const mockDeleteUser = vitest_1.vi.spyOn(userService, "deleteUserById");
            mockDeleteUser.mockRejectedValue(error_exception_1.default.badRequest("User not found"));
            await (0, vitest_1.expect)(userService.deleteUserById(notFoundUser.user_id)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockDeleteUser).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(mockDeleteUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("it should throw 'no parameters provided'", async () => {
            const arg = undefined;
            const mockDeleteUser = vitest_1.vi.spyOn(userService, "deleteUserById");
            mockDeleteUser.mockRejectedValue(error_exception_1.default.badRequest("No parameters provided"));
            await (0, vitest_1.expect)(userService.deleteUserById(arg)).rejects.toThrow("No parameters provided");
            (0, vitest_1.expect)(mockDeleteUser).toHaveBeenCalledWith(arg);
            (0, vitest_1.expect)(mockDeleteUser).toHaveBeenCalledTimes(1);
        });
    });
});
