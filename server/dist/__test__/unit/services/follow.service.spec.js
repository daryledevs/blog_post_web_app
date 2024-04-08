"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const follow_service_impl_1 = __importDefault(require("@/services/follow/follow.service.impl"));
const follow_repository_impl_1 = __importDefault(require("@/repositories/follow/follow.repository.impl"));
const generate_mock_data_1 = __importDefault(require("../util/generate-mock-data"));
const follow_mock_1 = require("@/__mock__/data/follow.mock");
const user_mock_1 = require("@/__mock__/data/user.mock");
const vitest_1 = require("vitest");
// Create a mock of the user service
let users = (0, user_mock_1.createUserList)(10);
const notFoundUser = (0, user_mock_1.createUser)();
const existingUser = users[0];
const otherExistingUser = users[9];
// Create a mock of the followers and following
let followers = (0, generate_mock_data_1.default)(false, users, follow_mock_1.createFollower);
let following = (0, generate_mock_data_1.default)(true, users, follow_mock_1.createFollower);
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/repositories/follow/follow.repository.impl");
(0, vitest_1.describe)('FollowService', () => {
    let userRepository;
    let followRepository;
    let followService;
    const noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    const userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
    const followFetchError = error_exception_1.default.notFound("Invalid fetch parameter");
    (0, vitest_1.beforeEach)(() => {
        userRepository = new user_repository_impl_1.default();
        followRepository = new follow_repository_impl_1.default();
        followService = new follow_service_impl_1.default(userRepository, followRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("getFollowStats (Get the number of followers and following)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            followRepository.getFollowStats = vitest_1.vi
                .fn()
                .mockResolvedValue({ followers: 1, following: 1 });
            const result = await followService.getFollowStats(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual({ followers: 1, following: 1 });
            (0, vitest_1.expect)(userRepository.findUserById).toBeCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(followRepository.getFollowStats).toBeCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(followService.getFollowStats(undefined)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.getFollowStats).not.toBeCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            await (0, vitest_1.expect)(followService.getFollowStats(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).toBeCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(followRepository.getFollowStats).not.toBeCalled();
        });
    });
    (0, vitest_1.describe)("getFollowerFollowingLists (Get the followers and following lists)", () => {
        (0, vitest_1.test)("should return the correct result with followers", async () => {
            const expectedResult = followers.filter((f) => f.follower_id === existingUser.user_id);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            followRepository.getFollowersLists = vitest_1.vi
                .fn()
                .mockResolvedValue(expectedResult);
            followRepository.getFollowingLists = vitest_1.vi
                .fn()
                .mockResolvedValue([]);
            const result = await followService.getFollowerFollowingLists(existingUser.user_id, "followers", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
            (0, vitest_1.expect)(userRepository.findUserById)
                .toBeCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(followRepository.getFollowersLists)
                .toBeCalledWith(existingUser.user_id, [0]);
            (0, vitest_1.expect)(followRepository.getFollowingLists).not.toBeCalled();
        });
        (0, vitest_1.test)("should return the correct result with following", async () => {
            const expectedResult = following.filter((f) => f.followed_id === existingUser.user_id);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            followRepository.getFollowersLists = vitest_1.vi
                .fn()
                .mockResolvedValue([]);
            followRepository.getFollowingLists = vitest_1.vi
                .fn()
                .mockResolvedValue(expectedResult);
            const result = await followService
                .getFollowerFollowingLists(existingUser.user_id, "following", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
            (0, vitest_1.expect)(userRepository.findUserById)
                .toBeCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(followRepository.getFollowersLists).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.getFollowingLists)
                .toBeCalledWith(existingUser.user_id, [0]);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(undefined, "followers", [0])).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.getFollowersLists).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.getFollowingLists).not.toBeCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(notFoundUser.user_id, "following", [0])).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).toBeCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(followRepository.getFollowersLists).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.getFollowingLists).not.toBeCalled();
        });
        (0, vitest_1.test)("should throw an error when invalid fetch parameter", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(existingUser.user_id, "invalid", [0])).rejects.toThrow(followFetchError);
            (0, vitest_1.expect)(userRepository.findUserById).toBeCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(followRepository.getFollowersLists).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.getFollowingLists).not.toBeCalled();
        });
    });
    (0, vitest_1.describe)("toggleFollow (User like and unlike the other user)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const args = {
                follower_id: existingUser.user_id,
                followed_id: otherExistingUser.user_id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            followRepository.isFollowUser = vitest_1.vi
                .fn()
                .mockResolvedValue(false);
            followRepository.followUser = vitest_1.vi
                .fn()
                .mockResolvedValue("User followed successfully");
            const result = await followService
                .toggleFollow(args.follower_id, args.followed_id);
            (0, vitest_1.expect)(result).toBe("User followed successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toBeCalledTimes(2);
            (0, vitest_1.expect)(followRepository.isFollowUser).toBeCalledWith(args);
            (0, vitest_1.expect)(followRepository.followUser).toBeCalledWith(args);
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toBeCalled();
        });
        (0, vitest_1.test)("should return the correct result", async () => {
            const args = {
                follower_id: existingUser.user_id,
                followed_id: otherExistingUser.user_id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            followRepository.isFollowUser = vitest_1.vi
                .fn()
                .mockResolvedValue(true);
            followRepository.unfollowUser = vitest_1.vi
                .fn()
                .mockResolvedValue("User unfollowed successfully");
            const result = await followService
                .toggleFollow(args.follower_id, args.followed_id);
            (0, vitest_1.expect)(result).toBe("User unfollowed successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toBeCalledTimes(2);
            (0, vitest_1.expect)(followRepository.isFollowUser).toBeCalledWith(args);
            (0, vitest_1.expect)(followRepository.followUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).toBeCalledWith(args);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            const noArgs = {
                follower_id: undefined,
                followed_id: otherExistingUser.user_id,
            };
            await (0, vitest_1.expect)(followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)).rejects.toThrow(noArgsMsgError);
            (0, vitest_1.expect)(userRepository.findUserById).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.isFollowUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.followUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toBeCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            const notFoundUserArgs = {
                follower_id: notFoundUser.user_id,
                followed_id: otherExistingUser.user_id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            await (0, vitest_1.expect)(followService.toggleFollow(notFoundUserArgs.follower_id, notFoundUserArgs.followed_id)).rejects.toThrow(userNotFoundMsgError);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toBeCalledWith(notFoundUserArgs.follower_id);
            (0, vitest_1.expect)(followRepository.isFollowUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.followUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toBeCalled();
        });
        (0, vitest_1.test)("should throw an error when the other is not found", async () => {
            const notFoundOtherUserArgs = {
                follower_id: existingUser.user_id,
                followed_id: notFoundUser.user_id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(undefined));
            await (0, vitest_1.expect)(followService.toggleFollow(notFoundOtherUserArgs.follower_id, notFoundOtherUserArgs.followed_id)).rejects.toThrow("The user to be followed doesn't exist");
            (0, vitest_1.expect)(userRepository.findUserById)
                .toBeCalledWith(notFoundOtherUserArgs.follower_id);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toBeCalledWith(notFoundOtherUserArgs.followed_id);
            (0, vitest_1.expect)(followRepository.isFollowUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.followUser).not.toBeCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toBeCalled();
        });
    });
});
