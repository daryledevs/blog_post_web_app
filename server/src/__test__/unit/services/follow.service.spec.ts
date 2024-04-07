import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import FollowService                                         from "@/services/follow/follow.service.impl";
import FollowRepository                                      from "@/repositories/follow/follow.repository.impl";
import generateMockData                                      from "../util/generate-mock-data";
import { createFollower }                                    from "@/__mock__/data/follow.mock";
import { createUser, createUserList }                        from "@/__mock__/data/user.mock";
import { SelectFollowers, SelectUsers }                      from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Create a mock of the user service
let users: SelectUsers[] = createUserList(10);
const notFoundUser = createUser();
const existingUser = users[0]!;
const otherExistingUser = users[9]!;

// Create a mock of the followers and following
let followers: SelectFollowers[] = generateMockData(false, users, createFollower);
let following: SelectFollowers[] = generateMockData(true, users, createFollower);

vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
  const original = await importOriginal<
    typeof import("@/repositories/user/user.repository.impl")
  >();

  return {
    ...original,
    default: vi.fn().mockImplementation(() => ({
      findUserById: vi
        .fn()
        .mockImplementation((id: number) =>
          users.find((u) => u.user_id === id)
        ),
    })),
  };
});

vi.mock(
  "@/repositories/follow/follow.repository.impl",
  async (importOriginal) => {
    const original = await importOriginal<
      typeof import("@/repositories/follow/follow.repository.impl")
    >();
    return {
      ...original,
      default: vi.fn().mockImplementation(() => ({
        getFollowStats: vi.fn().mockImplementation((user_id: number) => ({
          followers: followers.filter((u) => u.follower_id === user_id).length,
          following: following.filter((u) => u.followed_id === user_id).length,
        })),
        getFollowersLists: vi
          .fn()
          .mockImplementation((user_id: number, listsId: number[]) =>
            followers.filter(
              (u) =>
                u.follower_id === user_id && !listsId.includes(u.follower_id)
            )
          ),
        getFollowingLists: vi
          .fn()
          .mockImplementation((user_id: number, listsId: number[]) =>
            following.filter(
              (u) =>
                u.followed_id === user_id && !listsId.includes(u.followed_id)
            )
          ),
        isFollowUser: vi
          .fn()
          .mockImplementation((args: any) =>
            followers.find(
              (f) =>
                f.follower_id === args.follower_id &&
                f.followed_id === args.followed_id
            )
          ),
        unfollowUser: vi
          .fn()
          .mockImplementation((args: any) =>
            followers.filter(
              (f) =>
                f.follower_id !== args.follower_id &&
                f.followed_id !== args.followed_id
            )
          ),
        followUser: vi
          .fn()
          .mockImplementation((args: any) =>
            followers.push({
              ...createFollower(args.follower_id, args.followed_id),
            })
          ),
      })),
    };
  }
);

describe('FollowService', () => {
  let userRepository:   UserRepository;
  let followRepository: FollowRepository;
  let followService:    FollowService;

  let noArgsMsgError:       ErrorException = ErrorException.badRequest("No arguments provided");
  let userNotFoundMsgError: ErrorException = ErrorException.badRequest("User not found");
  let followFetchError:     ErrorException = ErrorException.notFound("Invalid fetch parameter");

  beforeEach(() => {
    userRepository   = new UserRepository();
    followRepository = new FollowRepository();
    followService    = new FollowService(userRepository, followRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getFollowStats (Get the number of followers and following)", () => {
    test("should return the correct result", async () => {
      const result = await followService.getFollowStats(existingUser.user_id);
      expect(result).toStrictEqual({ followers: 1, following: 1 });
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        followService.getFollowStats(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        followService.getFollowStats(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });
  
  describe("getFollowerFollowingLists (Get the followers and following lists)", () => {
    test("should return the correct result with followers", async () => {
      const expectedResult = followers.filter(
        (f) => f.follower_id === existingUser.user_id
      );
      
      const result = await followService
        .getFollowerFollowingLists(existingUser.user_id, "followers", [0]);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBeTruthy();
    });

    test("should return the correct result with following", async () => {
      const expectedResult = following.filter(
        (f) => f.followed_id === existingUser.user_id
      );
      
      const result = await followService
        .getFollowerFollowingLists(existingUser.user_id, "following", [0]);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBeTruthy();
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        followService.getFollowerFollowingLists(undefined as any, "followers", [0])
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        followService.getFollowerFollowingLists(notFoundUser.user_id, "following", [0])
      ).rejects.toThrow(userNotFoundMsgError);
    });

    test("should throw an error when invalid fetch parameter", async () => {
      await expect(
        followService.getFollowerFollowingLists(existingUser.user_id, "invalid", [0])
      ).rejects.toThrow(followFetchError);
    });
  });

  describe("toggleFollow (User like and unlike the other user)", () => {
    const args = {
      follower_id: existingUser.user_id,
      followed_id: otherExistingUser.user_id,
    };

    const noArgs = {
      follower_id: undefined as any,
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

    test("should return the correct result", async () => {
      const result = await followService
        .toggleFollow(args.follower_id, args.followed_id);
      expect(result).toBe("User followed successfully");
    });

    test("should return the correct result", async () => {
      const result = await followService
        .toggleFollow(args.follower_id, args.followed_id);
      expect(result).toBe("User unfollowed successfully");
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        followService.toggleFollow(
          notFoundUserArgs.follower_id,
          notFoundUserArgs.followed_id
        )
      ).rejects.toThrow(userNotFoundMsgError)
    });

    test("should throw an error when the other is not found", async () => {
      await expect(
        followService.toggleFollow(
          notFoundOtherUserArgs.follower_id,
          notFoundOtherUserArgs.followed_id
        )
      ).rejects.toThrow("The user to be followed doesn't exist");
    });
  });
});