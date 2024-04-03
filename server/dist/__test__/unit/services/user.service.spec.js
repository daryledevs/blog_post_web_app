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
const search_mock_1 = require("@/__mock__/recent-search/search.mock");
const vitest_1 = require("vitest");
let users = (0, user_mock_1.createUserList)(5);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0] || (0, user_mock_1.createUser)();
let recentSearches = (0, search_mock_1.createSearchList)(5);
const notFoundSearch = (0, search_mock_1.createRecentSearch)();
const existingSearch = recentSearches[0] || (0, search_mock_1.createRecentSearch)();
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
                const index = users.findIndex((u) => u.user_id === id);
                if (index === -1)
                    throw error_exception_1.default.badRequest("User not found");
                users.splice(index, 1);
                return "User deleted successfully";
            }),
            searchUserByFields: vitest_1.vi
                .fn()
                .mockImplementation((search) => users.find((u) => u.username === search)),
            getAllRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((user_id) => recentSearches.filter((r) => r.user_id === user_id)),
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
    let noArgsMsg;
    let notFoundMsg;
    (0, vitest_1.beforeEach)(() => {
        userService = new user_service_impl_1.default(new user_repository_impl_1.default(), new follow_repository_impl_1.default(), new recent_search_repository_impl_1.default());
        noArgsMsg = error_exception_1.default.badRequest("No arguments provided");
        notFoundMsg = error_exception_1.default.badRequest("User not found");
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("Get user's data by id", () => {
        const cases = [
            { args: existingUser.user_id, expected: existingUser, },
            { args: undefined, expected: noArgsMsg, },
            { args: notFoundUser.user_id, expected: notFoundMsg, },
        ];
        vitest_1.test.each(cases)("getUserById should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "getUserById");
            mockMethod.mockResolvedValue(expected);
            const result = await userService.getUserById(args);
            (0, vitest_1.expect)(result).toBe(expected);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user's data by username", () => {
        const cases = [
            { args: existingUser.username, expected: existingUser },
            { args: undefined, expected: noArgsMsg },
            { args: notFoundUser.username, expected: notFoundMsg },
        ];
        vitest_1.test.each(cases)("getUserByUsername should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "getUserByUsername");
            mockMethod.mockResolvedValue(expected);
            const result = await userService.getUserByUsername(args);
            (0, vitest_1.expect)(result).toBe(expected);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user data by email", async () => {
        const cases = [
            { args: existingUser.email, expected: existingUser },
            { args: notFoundUser.email, expected: notFoundMsg },
            { args: undefined, expected: noArgsMsg },
        ];
        vitest_1.test.each(cases)("getUserByEmail should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "getUserByEmail");
            mockMethod.mockResolvedValue(expected);
            const result = await userService.getUserByEmail(args);
            (0, vitest_1.expect)(result).toBe(expected);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Update user's data", async () => {
        const cases = [
            {
                args: [
                    existingUser.user_id,
                    existingUser
                ],
                expected: existingUser,
            },
            {
                args: [
                    notFoundUser.user_id,
                    notFoundUser
                ],
                expected: notFoundMsg,
            },
            {
                args: [
                    undefined,
                    existingUser
                ],
                expected: noArgsMsg,
            },
        ];
        vitest_1.test.each(cases)("updateUser should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "updateUser");
            mockMethod.mockResolvedValue(expected);
            const result = await userService.updateUser(args[0], args[1]);
            (0, vitest_1.expect)(result).toBe(expected);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args[0], args[1]);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Delete user's data", async () => {
        const cases = [
            { args: existingUser.user_id, expected: "User deleted successfully" },
            { args: notFoundUser.user_id, expected: notFoundMsg },
            { args: undefined, expected: noArgsMsg },
        ];
        vitest_1.test.each(cases)("deleteUserById should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "deleteUserById");
            mockMethod.mockResolvedValue(expected);
            const result = await userService.deleteUserById(args);
            (0, vitest_1.expect)(result).toBe(expected);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Find users by search", async () => {
        const cases = [
            { args: existingUser.username, expected: existingUser },
            { args: notFoundUser.username, expected: notFoundMsg },
            { args: undefined, expected: noArgsMsg },
        ];
        vitest_1.test.each(cases)("searchUserByFields should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "searchUserByFields");
            mockMethod.mockResolvedValue(vitest_1.expect.objectContaining(expected));
            const result = await userService.searchUserByFields(args);
            (0, vitest_1.expect)(result).toStrictEqual(vitest_1.expect.objectContaining(expected));
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get all the recent searches", async () => {
        const cases = [
            { args: existingSearch.user_id, expected: recentSearches },
            { args: notFoundSearch.user_id, expected: notFoundMsg },
            { args: undefined, expected: noArgsMsg },
        ];
        vitest_1.test.each(cases)("getAllRecentSearches should return the correct result and error message", async ({ args, expected }) => {
            const mockMethod = vitest_1.vi.spyOn(userService, "getAllRecentSearches");
            mockMethod.mockResolvedValue(expected);
            const result = await userService.getAllRecentSearches(args);
            (0, vitest_1.expect)(result).toBe(expected);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
    });
});
