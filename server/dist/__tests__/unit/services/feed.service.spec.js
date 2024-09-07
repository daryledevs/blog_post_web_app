"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const feed_service_impl_1 = __importDefault(require("@/application/services/feed/feed.service.impl"));
const feed_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/feed.repository.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const generate_data_util_1 = __importDefault(require("@/__tests__/utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
vitest_1.vi.mock("@/repositories/feed/feed.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
(0, vitest_1.describe)("FeedService", () => {
    let feedRepository;
    let userRepository;
    let feedService;
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
    };
    const users = generate_data_util_1.default.createUserList(10);
    const existingUser = users[0];
    const existingUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, existingUser);
    const nonExistingUser = generate_data_util_1.default.createUser();
    const nonExistingUserDto = (0, class_transformer_1.plainToInstance)(user_dto_1.default, nonExistingUser);
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
            const post_uuids = [""];
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(existingUserDto);
            feedRepository.getUserFeed = vitest_1.vi.fn().mockResolvedValueOnce([]);
            const userFeed = await feedService.getUserFeed(existingUserDto.getUuid(), post_uuids);
            (0, vitest_1.expect)(userFeed).toBeInstanceOf(Array);
            (0, vitest_1.expect)(userFeed).toStrictEqual([]);
            (0, vitest_1.expect)(userFeed).toHaveLength(0);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUserDto.getUuid());
            (0, vitest_1.expect)(feedRepository.getUserFeed)
                .toHaveBeenCalledWith(existingUserDto.getId(), [0]);
        });
        (0, vitest_1.test)("should throw an error if no arguments are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            feedRepository.getUserFeed = vitest_1.vi.fn();
            await (0, vitest_1.expect)(feedService.getUserFeed(undefined, [])).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(feedRepository.getUserFeed).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(null);
            feedRepository.getUserFeed = vitest_1.vi.fn();
            await (0, vitest_1.expect)(feedService.getUserFeed(nonExistingUserDto.getUuid(), [])).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(nonExistingUserDto.getId());
            (0, vitest_1.expect)(feedRepository.getUserFeed).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getExploreFeed", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(existingUserDto);
            feedRepository.getExploreFeed = vitest_1.vi.fn().mockResolvedValueOnce([]);
            const exploreFeed = await feedService.getExploreFeed(existingUserDto.getUuid());
            (0, vitest_1.expect)(exploreFeed).toBeInstanceOf(Array);
            (0, vitest_1.expect)(exploreFeed).toStrictEqual([]);
            (0, vitest_1.expect)(exploreFeed).toHaveLength(0);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUserDto.getUuid());
            (0, vitest_1.expect)(feedRepository.getExploreFeed)
                .toHaveBeenCalledWith(existingUserDto.getId());
        });
        (0, vitest_1.test)("should throw an error if no arguments are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            feedRepository.getExploreFeed = vitest_1.vi.fn();
            await (0, vitest_1.expect)(feedService.getExploreFeed(undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(feedRepository.getExploreFeed).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if the user is not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValueOnce(null);
            feedRepository.getExploreFeed = vitest_1.vi.fn();
            await (0, vitest_1.expect)(feedService.getExploreFeed(nonExistingUserDto.getUuid())).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(nonExistingUserDto.getId());
            (0, vitest_1.expect)(feedRepository.getExploreFeed).not.toHaveBeenCalled();
        });
    });
});
