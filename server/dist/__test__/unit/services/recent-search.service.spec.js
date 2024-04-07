"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const generate_mock_data_1 = __importDefault(require("../util/generate-mock-data"));
const recent_search_service_impl_1 = __importDefault(require("@/services/recent-search/recent-search.service.impl"));
const recent_search_repository_impl_1 = __importDefault(require("@/repositories/recent-search/recent-search.repository.impl"));
const search_mock_1 = require("@/__mock__/data/search.mock");
const user_mock_1 = require("@/__mock__/data/user.mock");
const vitest_1 = require("vitest");
// Create a mock of the user service
let users = (0, user_mock_1.createUserList)(10);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0];
// Create a mock of the recent searches
let recentSearches = (0, generate_mock_data_1.default)(false, users, search_mock_1.createRecentSearch);
const newSearch = users[9];
const existingSearch = recentSearches[0];
const notFoundSearch = (0, search_mock_1.createRecentSearch)(notFoundUser.user_id, notFoundUser.user_id);
vitest_1.vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
            findUserById: vitest_1.vi
                .fn()
                .mockImplementation((id) => users.find((u) => u.user_id === id)),
        })),
    };
});
vitest_1.vi.mock("@/repositories/recent-search/recent-search.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
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
            findUsersSearchByUserId: vitest_1.vi
                .fn()
                .mockImplementation((user_id, search_user_id) => recentSearches.find((r) => r.user_id === user_id && r.search_user_id === search_user_id)),
            deleteRecentSearches: vitest_1.vi
                .fn()
                .mockImplementation((recent_id) => recentSearches.filter((r) => r.recent_id !== recent_id)),
        })),
    };
});
(0, vitest_1.describe)("RecentSearchService", () => {
    let recentSearchService;
    let noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    let userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
    let userSearchNotFoundError = error_exception_1.default.notFound("Search user not found");
    let recentSearchNotFoundError = error_exception_1.default.notFound("Recent search not found");
    (0, vitest_1.beforeEach)(() => {
        let userRepository = new user_repository_impl_1.default();
        let recentSearchRepository = new recent_search_repository_impl_1.default();
        recentSearchService = new recent_search_service_impl_1.default(userRepository, recentSearchRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getAllRecentSearches (Get all the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const expectedResult = recentSearches.filter((r) => r.user_id === existingUser.user_id);
            const result = await recentSearchService
                .getAllRecentSearches(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(expectedResult.length);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(recentSearchService.getAllRecentSearches(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(recentSearchService.getAllRecentSearches(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("saveRecentSearches (Save the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await recentSearchService
                .saveRecentSearches(existingUser.user_id, newSearch.user_id);
            (0, vitest_1.expect)(result).toBe("Search user saved successfully");
        });
        (0, vitest_1.test)("should return the correct result when search user is already saved", async () => {
            const result = await recentSearchService.saveRecentSearches(existingSearch?.user_id, existingSearch?.search_user_id);
            (0, vitest_1.expect)(result).toBe("Search user already saved");
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(recentSearchService.saveRecentSearches(undefined, existingUser.user_id)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(recentSearchService.saveRecentSearches(notFoundUser.user_id, existingUser.user_id)).rejects.toThrow(userNotFoundMsgError);
        });
        (0, vitest_1.test)("should throw an error when search user is not found", async () => {
            await (0, vitest_1.expect)(recentSearchService.saveRecentSearches(existingSearch?.user_id, notFoundSearch.search_user_id)).rejects.toThrow(userSearchNotFoundError);
        });
    });
    (0, vitest_1.describe)("removeRecentSearches (Remove the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await recentSearchService
                .removeRecentSearches(existingSearch.recent_id);
            (0, vitest_1.expect)(result).toBe("Search user deleted successfully");
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(recentSearchService.removeRecentSearches(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(recentSearchService.removeRecentSearches(notFoundSearch.user_id)).rejects.toThrow(recentSearchNotFoundError);
        });
    });
});
