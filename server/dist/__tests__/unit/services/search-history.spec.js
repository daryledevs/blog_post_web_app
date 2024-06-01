"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const search_history_service_impl_1 = __importDefault(require("@/services/search-history/search-history.service.impl"));
const search_history_repository_impl_1 = __importDefault(require("@/repositories/search-history/search-history.repository.impl"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/repositories/search-history/search-history.repository.impl");
(0, vitest_1.describe)("SearchHistoryService", () => {
    let userRepository;
    let searchHistoryRepository;
    let searchHistoryService;
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
        searchUserNotFound: api_exception_1.default.HTTP404Error("Search user not found"),
        recentSearchNotFound: api_exception_1.default.HTTP404Error("Recent search not found"),
    };
    // Create a mock of the user service
    let users = generate_data_util_1.default.createUserList(10);
    const notFoundUser = generate_data_util_1.default.createUser();
    const existingUser = users[0];
    const otherExistingUser = users[1];
    // Create a mock of the recent searches
    let recentSearches = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createRecentSearch);
    const newSearch = users[9];
    const existingSearch = recentSearches[0];
    const notFoundSearch = generate_data_util_1.default.createRecentSearch(notFoundUser.id, notFoundUser.id);
    (0, vitest_1.beforeEach)(() => {
        userRepository = new user_repository_impl_1.default();
        searchHistoryRepository = new search_history_repository_impl_1.default();
        searchHistoryService = new search_history_service_impl_1.default(userRepository, searchHistoryRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getUsersSearchHistoryById (Get all the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const expectedResult = recentSearches.filter((r) => r.uuid === existingUser.uuid);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            searchHistoryRepository.findSearchHistoryById = vitest_1.vi
                .fn()
                .mockResolvedValue(expectedResult);
            const result = await searchHistoryService
                .getUsersSearchHistoryById(existingUser.uuid);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result).toHaveLength(expectedResult.length);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(searchHistoryRepository.findSearchHistoryById)
                .toHaveBeenCalledWith(existingUser.id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            searchHistoryRepository.findSearchHistoryById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.getUsersSearchHistoryById(undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById)
                .not.toHaveBeenCalled();
            (0, vitest_1.expect)(searchHistoryRepository.findSearchHistoryById)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            searchHistoryRepository.findSearchHistoryById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.getUsersSearchHistoryById(notFoundUser.uuid)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(searchHistoryRepository.findSearchHistoryById)
                .not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("saveUsersSearch (Save the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(newSearch);
            searchHistoryRepository.findUsersSearchByUsersId = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            searchHistoryRepository.saveUsersSearch = vitest_1.vi
                .fn()
                .mockResolvedValue("Search user saved successfully");
            const result = await searchHistoryService.saveUsersSearch(existingUser.uuid, newSearch.uuid);
            (0, vitest_1.expect)(result).toBe("Search user saved successfully");
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(newSearch.uuid);
        });
        (0, vitest_1.test)("should return the correct result when search user is already saved", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            searchHistoryRepository.findUsersSearchByUsersId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingSearch);
            searchHistoryRepository.saveUsersSearch = vitest_1.vi.fn();
            const result = await searchHistoryService.saveUsersSearch(existingUser?.uuid, otherExistingUser?.uuid);
            (0, vitest_1.expect)(result).equal("Search user already saved");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(searchHistoryRepository.findUsersSearchByUsersId).toHaveBeenCalledWith(existingSearch?.searcher_id, existingSearch?.searched_id);
            (0, vitest_1.expect)(searchHistoryRepository.saveUsersSearch)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            searchHistoryRepository.saveUsersSearch = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.saveUsersSearch(undefined, existingUser.uuid)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(searchHistoryRepository.saveUsersSearch).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            searchHistoryRepository.saveUsersSearch = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.saveUsersSearch(notFoundUser.uuid, existingUser.uuid)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(searchHistoryRepository.saveUsersSearch)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when search user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(undefined));
            searchHistoryRepository.saveUsersSearch = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.saveUsersSearch(existingSearch?.uuid, notFoundSearch.uuid)).rejects.toThrow(error.searchUserNotFound);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingSearch?.uuid);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundSearch.uuid);
            (0, vitest_1.expect)(searchHistoryRepository.saveUsersSearch).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("removeRecentSearchesById (Remove the recent searches)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            searchHistoryRepository.findUsersSearchById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingSearch);
            searchHistoryRepository.deleteUsersSearchById = vitest_1.vi.fn();
            const result = await searchHistoryService
                .removeRecentSearchesById(existingSearch.uuid);
            (0, vitest_1.expect)(result).toBe("Search user deleted successfully");
            (0, vitest_1.expect)(searchHistoryRepository.findUsersSearchById)
                .toHaveBeenCalledWith(existingSearch.uuid);
            (0, vitest_1.expect)(searchHistoryRepository.deleteUsersSearchById)
                .toHaveBeenCalledWith(existingSearch.id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            searchHistoryRepository.findUsersSearchById = vitest_1.vi.fn();
            searchHistoryRepository.deleteUsersSearchById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.removeRecentSearchesById(undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(searchHistoryRepository.findUsersSearchById)
                .not.toHaveBeenCalled();
            (0, vitest_1.expect)(searchHistoryRepository.deleteUsersSearchById)
                .not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            searchHistoryRepository.findUsersSearchById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            searchHistoryRepository.deleteUsersSearchById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(searchHistoryService.removeRecentSearchesById(notFoundSearch.uuid)).rejects.toThrow(error.recentSearchNotFound);
            (0, vitest_1.expect)(searchHistoryRepository.findUsersSearchById)
                .toHaveBeenCalledWith(notFoundSearch.uuid);
            (0, vitest_1.expect)(searchHistoryRepository.deleteUsersSearchById)
                .not.toHaveBeenCalled();
        });
    });
});
