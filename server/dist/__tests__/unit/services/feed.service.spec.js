"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_service_impl_1 = __importDefault(require("@/services/feed/feed.service.impl"));
const feed_repository_impl_1 = __importDefault(require("@/repositories/feed/feed.repository.impl"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const vitest_1 = require("vitest");
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
vitest_1.vi.mock("@/repositories/feed/feed.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
(0, vitest_1.describe)("FeedService", () => {
    let feedRepository;
    let userRepository;
    let feedService;
    const noArgsMsgError = api_exception_1.default.HTTP400Error("No arguments provided");
    const userNotFoundMsgError = api_exception_1.default.HTTP400Error("User not found");
    const users = generate_data_util_1.default.createUserList(10);
    const existingUser = users[0];
    const nonExistingUser = generate_data_util_1.default.createUser();
    (0, vitest_1.beforeEach)(() => {
        feedRepository = new feed_repository_impl_1.default();
        userRepository = new user_repository_impl_1.default();
        feedService = new feed_service_impl_1.default(feedRepository, userRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getUserFeed", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(existingUser);
            feedRepository.getUserFeed = vitest_1.vi.fn().mockResolvedValueOnce([]);
            const userFeed = await feedService.getUserFeed(existingUser.user_id, [0]);
            (0, vitest_1.expect)(userFeed).toBeInstanceOf(Array);
            (0, vitest_1.expect)(userFeed).toStrictEqual([]);
            (0, vitest_1.expect)(userFeed).toHaveLength(0);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(feedRepository.getUserFeed)
                .toHaveBeenCalledWith(existingUser.user_id, [0]);
        });
        (0, vitest_1.test)("should throw an error if no arguments are provided", async () => {
            await (0, vitest_1.expect)(feedService.getUserFeed(undefined, [])).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(feedRepository.getUserFeed).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(null);
            await (0, vitest_1.expect)(feedService.getUserFeed(nonExistingUser.user_id, [])).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(nonExistingUser.user_id);
            (0, vitest_1.expect)(feedRepository.getUserFeed).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getExploreFeed", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(existingUser);
            feedRepository.getExploreFeed = vitest_1.vi.fn().mockResolvedValueOnce([]);
            const exploreFeed = await feedService.getExploreFeed(existingUser.user_id);
            (0, vitest_1.expect)(exploreFeed).toBeInstanceOf(Array);
            (0, vitest_1.expect)(exploreFeed).toStrictEqual([]);
            (0, vitest_1.expect)(exploreFeed).toHaveLength(0);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(feedRepository.getExploreFeed)
                .toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error if no arguments are provided", async () => {
            await (0, vitest_1.expect)(feedService.getExploreFeed(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(feedRepository.getExploreFeed).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(null);
            await (0, vitest_1.expect)(feedService.getExploreFeed(nonExistingUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(nonExistingUser.user_id);
            (0, vitest_1.expect)(feedRepository.getExploreFeed).not.toHaveBeenCalled();
        });
    });
});
