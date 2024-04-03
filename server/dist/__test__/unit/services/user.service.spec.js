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
let users = (0, user_mock_1.createUserList)(10);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0] || (0, user_mock_1.createUser)();
let recentSearches = users.flatMap((u, i) => {
    let nextUser = users[i + 1];
    let nextUserId = nextUser ? nextUser.user_id : u.user_id;
    return (0, search_mock_1.createSearchList)(5, u.user_id, nextUserId);
});
const notFoundSearch = (0, search_mock_1.createRecentSearch)(notFoundUser.user_id, notFoundUser.user_id);
const existingSearch = recentSearches[0];
const newSearch = users[9] || (0, user_mock_1.createUser)();
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
            getAllRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((user_id) => recentSearches.filter((r) => r.user_id === user_id)),
            searchUsersByQuery: vitest_1.vi
                .fn()
                .mockImplementation((search) => users.filter((u) => u.username.includes(search) ||
                u?.first_name?.includes(search) ||
                u?.last_name?.includes(search) ||
                `${u?.first_name} ${u?.last_name}`.includes(search))),
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
vitest_1.vi.mock("@/repositories/recent-search/recent-search.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
            findUsersSearchByUserId: vitest_1.vi
                .fn()
                .mockImplementation((user_id, search_user_id) => recentSearches.find((r) => r.user_id === user_id && r.search_user_id === search_user_id)),
            saveRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((user_id, search_user_id) => recentSearches.push({
                ...(0, search_mock_1.createRecentSearch)(user_id, search_user_id),
            })),
            removeRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((recent_id) => recentSearches.filter((item) => item.recent_id !== recent_id)),
            getRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((user_id) => recentSearches.filter((r) => r.user_id === user_id)),
        })),
    };
});
(0, vitest_1.describe)('UserService', () => {
    let userService;
    let userRepository;
    let followRepository;
    let recentSearchRepository;
    let noArgsMsg = error_exception_1.default.badRequest("No arguments provided");
    let notFoundMsg = error_exception_1.default.badRequest("User not found");
    let notFoundSearchMsg = error_exception_1.default.notFound("Search user not found");
    (0, vitest_1.beforeEach)(() => {
        userRepository = new user_repository_impl_1.default();
        followRepository = new follow_repository_impl_1.default();
        recentSearchRepository = new recent_search_repository_impl_1.default();
        userService = new user_service_impl_1.default(userRepository, followRepository, recentSearchRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("Get user's data by id", () => {
        (0, vitest_1.test)("getUserById should return the correct result", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserById");
            const result = await userService.getUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe(existingUser);
            methodMock.mockRejectedValue(existingUser);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getUserById should throw an error when no args are provided", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserById");
            await (0, vitest_1.expect)(userService.getUserById(undefined)).rejects.toThrow(noArgsMsg);
            methodMock.mockRejectedValue(noArgsMsg);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getUserById should throw an error when user is not found", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserById");
            await (0, vitest_1.expect)(userService.getUserById(notFoundUser.user_id)).rejects.toThrow(notFoundMsg);
            methodMock.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user's data by username", () => {
        (0, vitest_1.test)("getUserByUsername should return the correct result", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserByUsername");
            const result = await userService.getUserByUsername(existingUser.username);
            (0, vitest_1.expect)(result).toBe(existingUser);
            methodMock.mockRejectedValue(existingUser);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getUserByUsername should throw an error when no args are provided", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserByUsername");
            await (0, vitest_1.expect)(userService.getUserByUsername(undefined)).rejects.toThrow(noArgsMsg);
            methodMock.mockRejectedValue(noArgsMsg);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getUserByUsername should throw an error when user is not found", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserByUsername");
            await (0, vitest_1.expect)(userService.getUserByUsername(notFoundUser.username)).rejects.toThrow(notFoundMsg);
            methodMock.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledWith(notFoundUser.username);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user data by email", async () => {
        (0, vitest_1.test)("getUserByEmail should return the correct result", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserByEmail");
            const result = await userService.getUserByEmail(existingUser.email);
            (0, vitest_1.expect)(result).toBe(existingUser);
            methodMock.mockRejectedValue(existingUser);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledWith(existingUser.email);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getUserByEmail should throw an error when no args are provided", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserByEmail");
            await (0, vitest_1.expect)(userService.getUserByEmail(undefined)).rejects.toThrow(noArgsMsg);
            methodMock.mockRejectedValue(noArgsMsg);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getUserByEmail should throw an error when user is not found", async () => {
            const methodMock = vitest_1.vi.spyOn(userRepository, "findUserByEmail");
            await (0, vitest_1.expect)(userService.getUserByEmail(notFoundUser.email)).rejects.toThrow(notFoundMsg);
            methodMock.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledWith(notFoundUser.email);
            (0, vitest_1.expect)(methodMock).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Update user's data", async () => {
        (0, vitest_1.test)("updateUser should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const updateUser = vitest_1.vi.spyOn(userRepository, "updateUser");
            const result = await userService.updateUser(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(result).toStrictEqual(existingUser);
            findUserById.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            updateUser.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledWith(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("updateUser should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const updateUser = vitest_1.vi.spyOn(userRepository, "updateUser");
            await (0, vitest_1.expect)(userService.updateUser(undefined, existingUser)).rejects.toThrow(noArgsMsg);
            findUserById.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            updateUser.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("updateUser should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const updateUser = vitest_1.vi.spyOn(userRepository, "updateUser");
            await (0, vitest_1.expect)(userService.updateUser(notFoundUser.user_id, notFoundUser)).rejects.toThrow(notFoundMsg);
            findUserById.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            updateUser.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Delete user's data", async () => {
        (0, vitest_1.test)("deleteUserById should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const deleteUser = vitest_1.vi.spyOn(userRepository, "deleteUser");
            const result = await userService.deleteUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe("User deleted successfully");
            findUserById.mockResolvedValue(existingUser);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("deleteUserById should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const deleteUser = vitest_1.vi.spyOn(userRepository, "deleteUser");
            await (0, vitest_1.expect)(userService.deleteUserById(undefined)).rejects.toThrow(noArgsMsg);
            findUserById.mockRejectedValue(noArgsMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            deleteUser.mockRejectedValue(noArgsMsg);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("deleteUserById should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const deleteUser = vitest_1.vi.spyOn(userRepository, "deleteUser");
            await (0, vitest_1.expect)(userService.deleteUserById(notFoundUser.user_id)).rejects.toThrow(notFoundMsg);
            findUserById.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            deleteUser.mockRejectedValue(notFoundMsg);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Find users by search", async () => {
        (0, vitest_1.test)("searchUserByFields should return the correct result with username", async () => {
            const mockMethod = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            mockMethod.mockResolvedValue(users);
            const result = await userService.searchUserByFields(existingUser.username);
            (0, vitest_1.expect)(result).toStrictEqual(users);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should return the correct result with first name", async () => {
            const mockMethod = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            mockMethod.mockResolvedValue(users);
            const result = await userService.searchUserByFields(existingUser.first_name);
            (0, vitest_1.expect)(result).toStrictEqual(users);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(existingUser.first_name);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should return the correct result with last name", async () => {
            const mockMethod = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            mockMethod.mockResolvedValue(users);
            const result = await userService.searchUserByFields(existingUser.last_name);
            (0, vitest_1.expect)(result).toStrictEqual(users);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(existingUser.last_name);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should return the correct result with last name", async () => {
            const mockMethod = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            mockMethod.mockResolvedValue(users);
            const result = await userService.searchUserByFields(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(result).toStrictEqual(users);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledWith(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should throw an error when no args are provided", async () => {
            const mockMethod = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            mockMethod.mockRejectedValue(noArgsMsg);
            await (0, vitest_1.expect)(userService.searchUserByFields(undefined)).rejects.toThrow(noArgsMsg);
            (0, vitest_1.expect)(mockMethod).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Get all the recent searches", async () => {
        (0, vitest_1.test)("getAllRecentSearches should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "getRecentSearches");
            findUserById.mockResolvedValue(existingUser);
            getRecentSearches.mockResolvedValue(recentSearches);
            const result = await userService.getAllRecentSearches(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual(recentSearches);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getAllRecentSearches should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "getRecentSearches");
            await (0, vitest_1.expect)(userService.getAllRecentSearches(undefined)).rejects.toThrow(noArgsMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getAllRecentSearches should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "getRecentSearches");
            findUserById.mockRejectedValue(notFoundMsg);
            getRecentSearches.mockRejectedValue(notFoundMsg);
            await (0, vitest_1.expect)(userService.getAllRecentSearches(notFoundUser.user_id)).rejects.toThrow(notFoundMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("saveRecentSearches", () => {
        (0, vitest_1.test)("saveRecentSearches should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            const result = await userService
                .saveRecentSearches(existingUser.user_id, newSearch.user_id);
            (0, vitest_1.expect)(result).toBe("Search user saved successfully");
            findUserById.mockResolvedValue(existingUser);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(newSearch.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(saveRecentSearches)
                .toHaveBeenCalledWith(existingUser.user_id, newSearch.user_id);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("saveRecentSearches should return the correct result when search user is already saved", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            const result = await userService.saveRecentSearches(existingSearch?.user_id, existingSearch?.search_user_id);
            (0, vitest_1.expect)(result).toBe("Search user already saved");
            findUserById.mockResolvedValue(existingUser);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingSearch?.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingSearch?.search_user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("saveRecentSearches should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            await (0, vitest_1.expect)(userService.saveRecentSearches(undefined, newSearch.user_id)).rejects.toThrow(noArgsMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("saveRecentSearches should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            await (0, vitest_1.expect)(userService.saveRecentSearches(notFoundSearch.user_id, existingSearch?.search_user_id)).rejects.toThrow(notFoundMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("saveRecentSearches should throw an error when search user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            await (0, vitest_1.expect)(userService.saveRecentSearches(existingSearch?.user_id, notFoundSearch.search_user_id)).rejects.toThrow(notFoundSearchMsg);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
    });
    // describe("removeRecentSearches", () => {
    // });
});
