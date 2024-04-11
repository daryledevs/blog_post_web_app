"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const recent_search_service_impl_1 = __importDefault(require("@/services/recent-search/recent-search.service.impl"));
const recent_search_repository_impl_1 = __importDefault(require("@/repositories/recent-search/recent-search.repository.impl"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/repositories/recent-search/recent-search.repository.impl");
(0, vitest_1.describe)("RecentSearchService", () => {
    let userRepository;
    let recentSearchRepository;
    let recentSearchService;
    const noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    const userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
    const searchUserNotFoundError = error_exception_1.default.notFound("Search user not found");
    const recentSearchNotFoundError = error_exception_1.default.notFound("Recent search not found");
    // Create a mock of the user service
    let users = generate_data_util_1.default.createUserList(10);
    const notFoundUser = generate_data_util_1.default.createUser();
    const existingUser = users[0];
    // Create a mock of the recent searches
    let recentSearches = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createRecentSearch);
    const newSearch = users[9];
    const existingSearch = recentSearches[0];
    const notFoundSearch = generate_data_util_1.default.createRecentSearch(notFoundUser.user_id, notFoundUser.user_id);
    (0, vitest_1.beforeEach)(() => {
        userRepository = new user_repository_impl_1.default();
        recentSearchRepository = new recent_search_repository_impl_1.default();
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
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            recentSearchRepository.getRecentSearches = vitest_1.vi
                .fn()
                .mockResolvedValue(expectedResult);
            const result = await recentSearchService
                .getAllRecentSearches(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(expectedResult.length);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(recentSearchRepository.getRecentSearches)
                .toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(recentSearchService.getAllRecentSearches(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .not.toHaveBeenCalled();
            (0, vitest_1.expect)(recentSearchRepository.getRecentSearches)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(recentSearchService.getAllRecentSearches(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(recentSearchRepository.getRecentSearches)
                .not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("saveRecentSearches (Save the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(newSearch);
            recentSearchRepository.findUsersSearchByUserId = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            recentSearchRepository.saveRecentSearches = vitest_1.vi
                .fn()
                .mockResolvedValue("Search user saved successfully");
            const result = await recentSearchService
                .saveRecentSearches(existingUser.user_id, newSearch.user_id);
            (0, vitest_1.expect)(result).toBe("Search user saved successfully");
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(newSearch.user_id);
        });
        (0, vitest_1.test)("should return the correct result when search user is already saved", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(existingUser));
            recentSearchRepository.findUsersSearchByUserId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingSearch);
            const result = await recentSearchService.saveRecentSearches(existingSearch?.user_id, existingSearch?.search_user_id);
            (0, vitest_1.expect)(result).toBe("Search user already saved");
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingSearch?.user_id);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingSearch?.search_user_id);
            (0, vitest_1.expect)(recentSearchRepository.findUsersSearchByUserId).toHaveBeenCalledWith(existingSearch?.user_id, existingSearch?.search_user_id);
            (0, vitest_1.expect)(recentSearchRepository.saveRecentSearches)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(recentSearchService.saveRecentSearches(undefined, existingUser.user_id)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(recentSearchRepository.saveRecentSearches).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(recentSearchService.saveRecentSearches(notFoundUser.user_id, existingUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(recentSearchRepository.saveRecentSearches)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when search user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(undefined));
            await (0, vitest_1.expect)(recentSearchService.saveRecentSearches(existingSearch?.user_id, notFoundSearch.search_user_id)).rejects.toThrow(searchUserNotFoundError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingSearch?.user_id);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundSearch.search_user_id);
            (0, vitest_1.expect)(recentSearchRepository.saveRecentSearches).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("removeRecentSearches (Remove the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            recentSearchRepository.findUsersSearchByRecentId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingSearch);
            recentSearchRepository.deleteRecentSearches = vitest_1.vi.fn();
            const result = await recentSearchService
                .removeRecentSearches(existingSearch.recent_id);
            (0, vitest_1.expect)(result).toBe("Search user deleted successfully");
            (0, vitest_1.expect)(recentSearchRepository.findUsersSearchByRecentId)
                .toHaveBeenCalledWith(existingSearch.recent_id);
            (0, vitest_1.expect)(recentSearchRepository.deleteRecentSearches)
                .toHaveBeenCalledWith(existingSearch.recent_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(recentSearchService.removeRecentSearches(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(recentSearchRepository.findUsersSearchByRecentId)
                .not.toHaveBeenCalled();
            (0, vitest_1.expect)(recentSearchRepository.deleteRecentSearches)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            recentSearchRepository.findUsersSearchByRecentId = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(recentSearchService.removeRecentSearches(notFoundSearch.user_id)).rejects.toThrow(recentSearchNotFoundError);
            (0, vitest_1.expect)(recentSearchRepository.findUsersSearchByRecentId)
                .toHaveBeenCalledWith(notFoundSearch.user_id);
            (0, vitest_1.expect)(recentSearchRepository.deleteRecentSearches)
                .not.toHaveBeenCalled();
        });
    });
});
