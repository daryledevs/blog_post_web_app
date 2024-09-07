"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const follow_service_impl_1 = __importDefault(require("@/application/services/follow/follow.service.impl"));
const follow_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/follow.repository.impl"));
const generate_data_util_1 = __importDefault(require("@/__tests__/utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/repositories/follow/follow.repository.impl");
(0, vitest_1.describe)('FollowService', () => {
    let userRepository;
    let followRepository;
    let followService;
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
        followFetch: api_exception_1.default.HTTP404Error("Invalid fetch parameter"),
    };
    // Create a mock of the user service
    let users = generate_data_util_1.default.createUserList(10);
    const notFoundUser = generate_data_util_1.default.createUser();
    const existingUser = users[0];
    const otherExistingUser = users[9];
    // Create a mock of the followers and following
    let followers = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createFollower);
    let following = generate_data_util_1.default.generateMockData(true, users, generate_data_util_1.default.createFollower);
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
            followRepository.findUserFollowStatsById = vitest_1.vi
                .fn()
                .mockResolvedValue({ followers: 1, following: 1 });
            const result = await followService.getFollowStats(existingUser.uuid);
            (0, vitest_1.expect)(result).toStrictEqual({ followers: 1, following: 1 });
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(followRepository.findUserFollowStatsById).toHaveBeenCalledWith(existingUser.id);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            followRepository.findUserFollowStatsById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.getFollowStats(undefined)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.findUserFollowStatsById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            followRepository.findUserFollowStatsById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.getFollowStats(notFoundUser.uuid)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(followRepository.findUserFollowStatsById).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getFollowerFollowingLists (Get the followers and following lists)", () => {
        (0, vitest_1.test)("should return the correct result with followers", async () => {
            const expectedResult = followers.filter((f) => f.follower_id === existingUser.uuid);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            followRepository.findAllFollowersById = vitest_1.vi
                .fn()
                .mockResolvedValue(expectedResult);
            followRepository.findAllFollowingById = vitest_1.vi
                .fn()
                .mockResolvedValue([]);
            const result = await followService.getFollowerFollowingLists(existingUser.uuid, "followers", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(followRepository.findAllFollowersById)
                .toHaveBeenCalledWith(existingUser.id, [0]);
            (0, vitest_1.expect)(followRepository.findAllFollowingById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the correct result with following", async () => {
            const expectedResult = following.filter((f) => f.followed_id === existingUser.uuid);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            followRepository.findAllFollowersById = vitest_1.vi.fn();
            followRepository.findAllFollowingById = vitest_1.vi
                .fn()
                .mockResolvedValue(expectedResult);
            const result = await followService
                .getFollowerFollowingLists(existingUser.uuid, "following", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(followRepository.findAllFollowersById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.findAllFollowingById)
                .toHaveBeenCalledWith(existingUser.id, [0]);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            followRepository.findAllFollowersById = vitest_1.vi.fn();
            followRepository.findAllFollowingById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(undefined, "followers", [0])).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.findAllFollowersById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.findAllFollowingById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            followRepository.findAllFollowersById = vitest_1.vi.fn();
            followRepository.findAllFollowingById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(notFoundUser.uuid, "following", [0])).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
            (0, vitest_1.expect)(followRepository.findAllFollowersById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.findAllFollowingById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when invalid fetch parameter", async () => {
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            followRepository.findAllFollowersById = vitest_1.vi.fn();
            followRepository.findAllFollowingById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(existingUser.uuid, "invalid", [0])).rejects.toThrow(error.followFetch);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
            (0, vitest_1.expect)(followRepository.findAllFollowersById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.findAllFollowingById).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("toggleFollow (User like and unlike the other user)", () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const publicIds = {
                follower_id: existingUser.uuid,
                followed_id: otherExistingUser.uuid,
            };
            const privateIds = {
                follower_id: existingUser.id,
                followed_id: otherExistingUser.id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            followRepository.isUserFollowing = vitest_1.vi
                .fn()
                .mockResolvedValue(false);
            followRepository.followUser = vitest_1.vi
                .fn()
                .mockResolvedValue("User followed successfully");
            followRepository.unfollowUser = vitest_1.vi.fn();
            const result = await followService.toggleFollow(publicIds.follower_id, publicIds.followed_id);
            (0, vitest_1.expect)(result).toBe("User followed successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(followRepository.isUserFollowing).toHaveBeenCalledWith(privateIds);
            (0, vitest_1.expect)(followRepository.followUser).toHaveBeenCalledWith(privateIds);
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the correct result", async () => {
            const publicIds = {
                follower_id: existingUser.uuid,
                followed_id: otherExistingUser.uuid,
            };
            const privateIds = {
                follower_id: existingUser.id,
                followed_id: otherExistingUser.id,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(otherExistingUser));
            followRepository.isUserFollowing = vitest_1.vi
                .fn()
                .mockResolvedValue(true);
            followRepository.followUser = vitest_1.vi.fn();
            followRepository.unfollowUser = vitest_1.vi
                .fn()
                .mockResolvedValue("User unfollowed successfully");
            const result = await followService.toggleFollow(publicIds.follower_id, publicIds.followed_id);
            (0, vitest_1.expect)(result).toBe("User unfollowed successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledTimes(2);
            (0, vitest_1.expect)(followRepository.isUserFollowing).toHaveBeenCalledWith(privateIds);
            (0, vitest_1.expect)(followRepository.followUser).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).toHaveBeenCalledWith(privateIds);
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            const noArgs = {
                follower_id: undefined,
                followed_id: otherExistingUser.uuid,
            };
            userRepository.findUserById = vitest_1.vi.fn();
            followRepository.isUserFollowing = vitest_1.vi.fn();
            followRepository.followUser = vitest_1.vi.fn();
            followRepository.unfollowUser = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.isUserFollowing).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.followUser).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            const notFoundUserArgs = {
                follower_id: notFoundUser.uuid,
                followed_id: otherExistingUser.uuid,
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            followRepository.isUserFollowing = vitest_1.vi.fn();
            followRepository.followUser = vitest_1.vi.fn();
            followRepository.unfollowUser = vitest_1.vi.fn();
            await (0, vitest_1.expect)(followService.toggleFollow(notFoundUserArgs.follower_id, notFoundUserArgs.followed_id)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundUserArgs.follower_id);
            (0, vitest_1.expect)(followRepository.isUserFollowing).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.followUser).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when the other is not found", async () => {
            const notFoundOtherUserArgs = {
                follower_id: existingUser.uuid,
                followed_id: notFoundUser.uuid,
            };
            followRepository.isUserFollowing = vitest_1.vi.fn();
            followRepository.followUser = vitest_1.vi.fn();
            followRepository.unfollowUser = vitest_1.vi.fn();
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockImplementationOnce(() => Promise.resolve(existingUser))
                .mockImplementationOnce(() => Promise.resolve(undefined));
            await (0, vitest_1.expect)(followService.toggleFollow(notFoundOtherUserArgs.follower_id, notFoundOtherUserArgs.followed_id)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundOtherUserArgs.follower_id);
            (0, vitest_1.expect)(userRepository.findUserById)
                .toHaveBeenCalledWith(notFoundOtherUserArgs.followed_id);
            (0, vitest_1.expect)(followRepository.isUserFollowing).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.followUser).not.toHaveBeenCalled();
            (0, vitest_1.expect)(followRepository.unfollowUser).not.toHaveBeenCalled();
        });
    });
});
