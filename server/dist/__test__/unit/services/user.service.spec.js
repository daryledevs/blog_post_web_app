"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_impl_1 = __importDefault(require("@/services/user/user.service.impl"));
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const follow_repository_impl_1 = __importDefault(require("@/repositories/follow/follow.repository.impl"));
const follow_mock_1 = require("@/__mock__/data/follow.mock");
const search_mock_1 = require("@/__mock__/data/search.mock");
const recent_search_repository_impl_1 = __importDefault(require("@/repositories/recent-search/recent-search.repository.impl"));
const user_mock_1 = require("@/__mock__/data/user.mock");
const vitest_1 = require("vitest");
const processUsers = (changeArg, list, callback) => {
    return list.flatMap((u, i) => {
        let nextUser = list[i + 1];
        let nextUserId = nextUser ? nextUser.user_id : u.user_id;
        const args = changeArg ?
            [nextUserId, u.user_id] :
            [u.user_id, nextUserId];
        return callback(args[0], args[1]);
    });
};
// Create a mock of the user service
let users = (0, user_mock_1.createUserList)(10);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0];
const otherExistingUser = users[9];
// Create a mock of the recent searches
let recentSearches = processUsers(false, users, search_mock_1.createRecentSearch);
const notFoundSearch = (0, search_mock_1.createRecentSearch)(notFoundUser.user_id, notFoundUser.user_id);
const newSearch = users[9];
const existingSearch = recentSearches[0];
// Create a mock of the followers and following
let followers = processUsers(false, users, follow_mock_1.createFollower);
let following = processUsers(true, users, follow_mock_1.createFollower);
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
        default: vitest_1.vi.fn().mockImplementation(() => ({
            getFollowStats: vitest_1.vi.fn().mockImplementation((user_id) => ({
                followers: followers.filter((u) => u.follower_id === user_id).length,
                following: following.filter((u) => u.followed_id === user_id).length,
            })),
            getFollowersLists: vitest_1.vi
                .fn()
                .mockImplementation((user_id, listsId) => followers.filter((u) => u.follower_id === user_id && !listsId.includes(u.followed_id))),
            getFollowingLists: vitest_1.vi
                .fn()
                .mockImplementation((user_id, listsId) => following.filter((u) => u.followed_id === user_id && !listsId.includes(u.follower_id))),
            isFollowUser: vitest_1.vi
                .fn()
                .mockImplementation((args) => followers.find((f) => f.follower_id === args.follower_id &&
                f.followed_id === args.followed_id)),
            unfollowUser: vitest_1.vi
                .fn()
                .mockImplementation((args) => followers.filter((f) => f.follower_id !== args.follower_id &&
                f.followed_id !== args.followed_id)),
            followUser: vitest_1.vi
                .fn()
                .mockImplementation((args) => followers.push({ ...(0, follow_mock_1.createFollower)(args.follower_id, args.followed_id) })),
        })),
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
            findUsersSearchByRecentId: vitest_1.vi
                .fn()
                .mockImplementation((recent_id) => recentSearches.find((r) => r.recent_id === recent_id)),
            deleteRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((recent_id) => recentSearches.filter((r) => r.recent_id !== recent_id)),
        })),
    };
});
(0, vitest_1.describe)('UserService', () => {
    let userService;
    let userRepository;
    let followRepository;
    let recentSearchRepository;
    let noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    let userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
    let userSearchNotFoundError = error_exception_1.default.notFound("Search user not found");
    let recentSearchNotFoundError = error_exception_1.default.notFound("Recent search not found");
    let followFetchError = error_exception_1.default.notFound("Invalid fetch parameter");
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
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const result = await userService.getUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getUserById should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            await (0, vitest_1.expect)(userService.getUserById(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getUserById should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            await (0, vitest_1.expect)(userService.getUserById(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user's data by username", () => {
        (0, vitest_1.test)("getUserByUsername should return the correct result", async () => {
            const findUserByUsername = vitest_1.vi.spyOn(userRepository, "findUserByUsername");
            const result = await userService.getUserByUsername(existingUser.username);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(findUserByUsername).toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(findUserByUsername).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getUserByUsername should throw an error when no args are provided", async () => {
            const findUserByUsername = vitest_1.vi.spyOn(userRepository, "findUserByUsername");
            await (0, vitest_1.expect)(userService.getUserByUsername(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserByUsername).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getUserByUsername should throw an error when user is not found", async () => {
            const findUserByUsername = vitest_1.vi.spyOn(userRepository, "findUserByUsername");
            await (0, vitest_1.expect)(userService.getUserByUsername(notFoundUser.username)).rejects.toThrow(userNotFoundMsgError);
            findUserByUsername.mockRejectedValue(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserByUsername).toHaveBeenCalledWith(notFoundUser.username);
            (0, vitest_1.expect)(findUserByUsername).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Get user data by email", async () => {
        (0, vitest_1.test)("getUserByEmail should return the correct result", async () => {
            const findUserByEmail = vitest_1.vi.spyOn(userRepository, "findUserByEmail");
            const result = await userService.getUserByEmail(existingUser.email);
            (0, vitest_1.expect)(result).toBe(existingUser);
            (0, vitest_1.expect)(findUserByEmail).toHaveBeenCalledWith(existingUser.email);
            (0, vitest_1.expect)(findUserByEmail).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getUserByEmail should throw an error when no args are provided", async () => {
            const findUserByEmail = vitest_1.vi.spyOn(userRepository, "findUserByEmail");
            await (0, vitest_1.expect)(userService.getUserByEmail(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserByEmail).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getUserByEmail should throw an error when user is not found", async () => {
            const findUserByEmail = vitest_1.vi.spyOn(userRepository, "findUserByEmail");
            await (0, vitest_1.expect)(userService.getUserByEmail(notFoundUser.email)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserByEmail).toHaveBeenCalledWith(notFoundUser.email);
            (0, vitest_1.expect)(findUserByEmail).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("Update user's data", async () => {
        (0, vitest_1.test)("updateUser should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const updateUser = vitest_1.vi.spyOn(userRepository, "updateUser");
            const result = await userService
                .updateUser(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(result).toStrictEqual(existingUser);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledWith(existingUser.user_id, existingUser);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("updateUser should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const updateUser = vitest_1.vi.spyOn(userRepository, "updateUser");
            await (0, vitest_1.expect)(userService.updateUser(undefined, existingUser)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("updateUser should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const updateUser = vitest_1.vi.spyOn(userRepository, "updateUser");
            await (0, vitest_1.expect)(userService.updateUser(notFoundUser.user_id, notFoundUser)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(updateUser).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Delete user's data", async () => {
        (0, vitest_1.test)("deleteUserById should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const deleteUser = vitest_1.vi.spyOn(userRepository, "deleteUser");
            const result = await userService.deleteUserById(existingUser.user_id);
            (0, vitest_1.expect)(result).toBe("User deleted successfully");
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("deleteUserById should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const deleteUser = vitest_1.vi.spyOn(userRepository, "deleteUser");
            await (0, vitest_1.expect)(userService.deleteUserById(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("deleteUserById should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const deleteUser = vitest_1.vi.spyOn(userRepository, "deleteUser");
            await (0, vitest_1.expect)(userService.deleteUserById(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(deleteUser).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Find users by search", async () => {
        (0, vitest_1.test)("searchUserByFields should return the correct result with username", async () => {
            const searchUsersByQuery = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            const result = await userService.searchUserByFields(existingUser.username);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should return the correct result with first name", async () => {
            const searchUsersByQuery = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            const result = await userService.searchUserByFields(existingUser.first_name);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledWith(existingUser.first_name);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should return the correct result with last name", async () => {
            const searchUsersByQuery = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            const result = await userService.searchUserByFields(existingUser.last_name);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledWith(existingUser.last_name);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should return the correct result with first and last name", async () => {
            const searchUsersByQuery = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            const result = await userService
                .searchUserByFields(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(result).toStrictEqual([existingUser]);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(searchUsersByQuery)
                .toHaveBeenCalledWith(`${existingUser.first_name} ${existingUser.last_name}`);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("searchUserByFields should throw an error when no args are provided", async () => {
            const searchUsersByQuery = vitest_1.vi.spyOn(userRepository, "searchUsersByQuery");
            await (0, vitest_1.expect)(userService.searchUserByFields(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(searchUsersByQuery).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Get all the recent searches", async () => {
        (0, vitest_1.test)("getAllRecentSearches should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "getRecentSearches");
            const expectedResult = recentSearches.filter((r) => r.user_id === existingUser.user_id);
            const result = await userService.getAllRecentSearches(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(expectedResult.length);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getAllRecentSearches should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "getRecentSearches");
            await (0, vitest_1.expect)(userService.getAllRecentSearches(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getAllRecentSearches should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "getRecentSearches");
            await (0, vitest_1.expect)(userService.getAllRecentSearches(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getRecentSearches).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Save the recent searches", () => {
        (0, vitest_1.test)("saveRecentSearches should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            const result = await userService
                .saveRecentSearches(existingUser.user_id, newSearch.user_id);
            (0, vitest_1.expect)(result).toBe("Search user saved successfully");
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
            const result = await userService
                .saveRecentSearches(existingSearch?.user_id, existingSearch?.search_user_id);
            (0, vitest_1.expect)(result).toBe("Search user already saved");
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingSearch?.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingSearch?.search_user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("saveRecentSearches should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            await (0, vitest_1.expect)(userService.saveRecentSearches(undefined, newSearch.user_id)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("saveRecentSearches should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            await (0, vitest_1.expect)(userService.saveRecentSearches(notFoundSearch.user_id, existingSearch?.search_user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("saveRecentSearches should throw an error when search user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const saveRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "saveRecentSearches");
            await (0, vitest_1.expect)(userService.saveRecentSearches(existingSearch?.user_id, notFoundSearch.search_user_id)).rejects.toThrow(userSearchNotFoundError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(saveRecentSearches).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Remove the recent searches", () => {
        (0, vitest_1.test)("removeRecentSearches should return the correct result", async () => {
            const findUsersSearchByRecentId = vitest_1.vi.spyOn(recentSearchRepository, "findUsersSearchByRecentId");
            const deleteRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "deleteRecentSearches");
            const result = await userService.removeRecentSearches(existingSearch.recent_id);
            (0, vitest_1.expect)(result).toBe("Search user deleted successfully");
            (0, vitest_1.expect)(findUsersSearchByRecentId).toHaveBeenCalledWith(existingSearch.recent_id);
            (0, vitest_1.expect)(findUsersSearchByRecentId).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(deleteRecentSearches).toHaveBeenCalledWith(existingSearch.recent_id);
            (0, vitest_1.expect)(deleteRecentSearches).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("removeRecentSearches should throw an error when no args are provided", async () => {
            const findUsersSearchByRecentId = vitest_1.vi.spyOn(recentSearchRepository, "findUsersSearchByRecentId");
            const deleteRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "deleteRecentSearches");
            await (0, vitest_1.expect)(userService.removeRecentSearches(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUsersSearchByRecentId).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(deleteRecentSearches).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("removeRecentSearches should throw an error when search user is not found", async () => {
            const findUsersSearchByRecentId = vitest_1.vi.spyOn(recentSearchRepository, "findUsersSearchByRecentId");
            const deleteRecentSearches = vitest_1.vi.spyOn(recentSearchRepository, "deleteRecentSearches");
            await (0, vitest_1.expect)(userService.removeRecentSearches(notFoundSearch.recent_id)).rejects.toThrow(recentSearchNotFoundError);
            (0, vitest_1.expect)(findUsersSearchByRecentId).toHaveBeenCalledWith(notFoundSearch.recent_id);
            (0, vitest_1.expect)(findUsersSearchByRecentId).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(deleteRecentSearches).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Get the number of followers and following", () => {
        (0, vitest_1.test)("getFollowStats should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowStats = vitest_1.vi.spyOn(followRepository, "getFollowStats");
            const result = await userService.getFollowStats(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual({ followers: 1, following: 1 });
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowStats).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(getFollowStats).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("getFollowStats should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowStats = vitest_1.vi.spyOn(followRepository, "getFollowStats");
            await (0, vitest_1.expect)(userService.getFollowStats(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getFollowStats).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getFollowStats should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowStats = vitest_1.vi.spyOn(followRepository, "getFollowStats");
            await (0, vitest_1.expect)(userService.getFollowStats(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowStats).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("Get the followers and following lists", () => {
        (0, vitest_1.test)("getFollowerFollowingLists should return the correct result with followers", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowersLists = vitest_1.vi.spyOn(followRepository, "getFollowersLists");
            const getFollowingLists = vitest_1.vi.spyOn(followRepository, "getFollowingLists");
            const expectedResult = followers.filter((f) => f.follower_id === existingUser.user_id);
            const result = await userService.getFollowerFollowingLists(existingUser.user_id, "followers", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowersLists).toHaveBeenCalledWith(existingUser.user_id, [0]);
            (0, vitest_1.expect)(getFollowersLists).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowingLists).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getFollowerFollowingLists should return the correct result with following", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowersLists = vitest_1.vi.spyOn(followRepository, "getFollowersLists");
            const getFollowingLists = vitest_1.vi.spyOn(followRepository, "getFollowingLists");
            const expectedResult = following.filter((f) => f.followed_id === existingUser.user_id);
            const result = await userService.getFollowerFollowingLists(existingUser.user_id, "following", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowingLists).toHaveBeenCalledWith(existingUser.user_id, [0]);
            (0, vitest_1.expect)(getFollowingLists).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowersLists).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getFollowStats should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowersLists = vitest_1.vi.spyOn(followRepository, "getFollowersLists");
            const getFollowingLists = vitest_1.vi.spyOn(followRepository, "getFollowingLists");
            await (0, vitest_1.expect)(userService.getFollowerFollowingLists(undefined, "followers", [0])).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getFollowingLists).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getFollowersLists).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getFollowStats should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowersLists = vitest_1.vi.spyOn(followRepository, "getFollowersLists");
            const getFollowingLists = vitest_1.vi.spyOn(followRepository, "getFollowingLists");
            await (0, vitest_1.expect)(userService.getFollowerFollowingLists(notFoundUser.user_id, "following", [0])).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowingLists).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getFollowersLists).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("getFollowStats should throw an error when invalid fetch parameter", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const getFollowersLists = vitest_1.vi.spyOn(followRepository, "getFollowersLists");
            const getFollowingLists = vitest_1.vi.spyOn(followRepository, "getFollowingLists");
            await (0, vitest_1.expect)(userService.getFollowerFollowingLists(existingUser.user_id, "invalid", [0])).rejects.toThrow(followFetchError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(getFollowingLists).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(getFollowersLists).toHaveBeenCalledTimes(0);
        });
    });
    (0, vitest_1.describe)("User like and unlike the other user", () => {
        const args = {
            follower_id: existingUser.user_id,
            followed_id: otherExistingUser.user_id,
        };
        const noArgs = {
            follower_id: undefined,
            followed_id: otherExistingUser.user_id
        };
        const notFoundUserArgs = {
            follower_id: notFoundUser.user_id,
            followed_id: otherExistingUser.user_id,
        };
        const notFoundOtherUserArgs = {
            follower_id: existingUser.user_id,
            followed_id: notFoundUser.user_id,
        };
        (0, vitest_1.test)("toggleFollow should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const isFollowUser = vitest_1.vi.spyOn(followRepository, "isFollowUser");
            const followUser = vitest_1.vi.spyOn(followRepository, "followUser");
            const unfollowUser = vitest_1.vi.spyOn(followRepository, "unfollowUser");
            const result = await userService
                .toggleFollow(args.follower_id, args.followed_id);
            (0, vitest_1.expect)(result).toBe("User followed successfully");
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(args.follower_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(args.followed_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(followUser).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(followUser).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(unfollowUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("toggleFollow should return the correct result", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const isFollowUser = vitest_1.vi.spyOn(followRepository, "isFollowUser");
            const followUser = vitest_1.vi.spyOn(followRepository, "followUser");
            const unfollowUser = vitest_1.vi.spyOn(followRepository, "unfollowUser");
            const result = await userService
                .toggleFollow(args.follower_id, args.followed_id);
            (0, vitest_1.expect)(result).toBe("User unfollowed successfully");
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(args.follower_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(args.followed_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(unfollowUser).toHaveBeenCalledWith(args);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(followUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(unfollowUser).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.test)("toggleFollow should throw an error when no args are provided", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const isFollowUser = vitest_1.vi.spyOn(followRepository, "isFollowUser");
            const followUser = vitest_1.vi.spyOn(followRepository, "followUser");
            const unfollowUser = vitest_1.vi.spyOn(followRepository, "unfollowUser");
            await (0, vitest_1.expect)(userService.toggleFollow(noArgs.follower_id, noArgs.followed_id)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(followUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(unfollowUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("toggleFollow should throw an error when user is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const isFollowUser = vitest_1.vi.spyOn(followRepository, "isFollowUser");
            const followUser = vitest_1.vi.spyOn(followRepository, "followUser");
            const unfollowUser = vitest_1.vi.spyOn(followRepository, "unfollowUser");
            await (0, vitest_1.expect)(userService.toggleFollow(notFoundUserArgs.follower_id, notFoundUserArgs.followed_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundUserArgs.follower_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(followUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(unfollowUser).toHaveBeenCalledTimes(0);
        });
        (0, vitest_1.test)("toggleFollow should throw an error when the other is not found", async () => {
            const findUserById = vitest_1.vi.spyOn(userRepository, "findUserById");
            const isFollowUser = vitest_1.vi.spyOn(followRepository, "isFollowUser");
            const followUser = vitest_1.vi.spyOn(followRepository, "followUser");
            const unfollowUser = vitest_1.vi.spyOn(followRepository, "unfollowUser");
            await (0, vitest_1.expect)(userService.toggleFollow(notFoundOtherUserArgs.follower_id, notFoundOtherUserArgs.followed_id)).rejects.toThrow("The user to be followed doesn't exist");
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundOtherUserArgs.follower_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledWith(notFoundOtherUserArgs.followed_id);
            (0, vitest_1.expect)(findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(isFollowUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(followUser).toHaveBeenCalledTimes(0);
            (0, vitest_1.expect)(unfollowUser).toHaveBeenCalledTimes(0);
        });
    });
});
