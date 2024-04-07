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
                .mockImplementation((user_id, listsId) => followers.filter((u) => u.follower_id === user_id && !listsId.includes(u.follower_id))),
            getFollowingLists: vitest_1.vi
                .fn()
                .mockImplementation((user_id, listsId) => following.filter((u) => u.followed_id === user_id && !listsId.includes(u.followed_id))),
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
                .mockImplementation((args) => followers.push({
                ...(0, follow_mock_1.createFollower)(args.follower_id, args.followed_id),
            })),
        })),
    };
});
(0, vitest_1.describe)('FollowService', () => {
    let userRepository;
    let followRepository;
    let followService;
    let noArgsMsgError = error_exception_1.default.badRequest("No arguments provided");
    let userNotFoundMsgError = error_exception_1.default.badRequest("User not found");
    let followFetchError = error_exception_1.default.notFound("Invalid fetch parameter");
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
            const result = await followService.getFollowStats(existingUser.user_id);
            (0, vitest_1.expect)(result).toStrictEqual({ followers: 1, following: 1 });
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(followService.getFollowStats(undefined)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(followService.getFollowStats(notFoundUser.user_id)).rejects.toThrow(userNotFoundMsgError);
        });
    });
    (0, vitest_1.describe)("getFollowerFollowingLists (Get the followers and following lists)", () => {
        (0, vitest_1.test)("should return the correct result with followers", async () => {
            const expectedResult = followers.filter((f) => f.follower_id === existingUser.user_id);
            const result = await followService
                .getFollowerFollowingLists(existingUser.user_id, "followers", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
        });
        (0, vitest_1.test)("should return the correct result with following", async () => {
            const expectedResult = following.filter((f) => f.followed_id === existingUser.user_id);
            const result = await followService
                .getFollowerFollowingLists(existingUser.user_id, "following", [0]);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(Array.isArray(result)).toBeTruthy();
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(undefined, "followers", [0])).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(notFoundUser.user_id, "following", [0])).rejects.toThrow(userNotFoundMsgError);
        });
        (0, vitest_1.test)("should throw an error when invalid fetch parameter", async () => {
            await (0, vitest_1.expect)(followService.getFollowerFollowingLists(existingUser.user_id, "invalid", [0])).rejects.toThrow(followFetchError);
        });
    });
    (0, vitest_1.describe)("toggleFollow (User like and unlike the other user)", () => {
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
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await followService
                .toggleFollow(args.follower_id, args.followed_id);
            (0, vitest_1.expect)(result).toBe("User followed successfully");
        });
        (0, vitest_1.test)("should return the correct result", async () => {
            const result = await followService
                .toggleFollow(args.follower_id, args.followed_id);
            (0, vitest_1.expect)(result).toBe("User unfollowed successfully");
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            await (0, vitest_1.expect)(followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)).rejects.toThrow(noArgsMsgError);
        });
        (0, vitest_1.test)("should throw an error when user is not found", async () => {
            await (0, vitest_1.expect)(followService.toggleFollow(notFoundUserArgs.follower_id, notFoundUserArgs.followed_id)).rejects.toThrow(userNotFoundMsgError);
        });
        (0, vitest_1.test)("should throw an error when the other is not found", async () => {
            await (0, vitest_1.expect)(followService.toggleFollow(notFoundOtherUserArgs.follower_id, notFoundOtherUserArgs.followed_id)).rejects.toThrow("The user to be followed doesn't exist");
        });
    });
});
