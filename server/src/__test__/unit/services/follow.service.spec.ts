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

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/follow/follow.repository.impl");

describe('FollowService', () => {
  let userRepository:   UserRepository;
  let followRepository: FollowRepository;
  let followService:    FollowService;

  const noArgsMsgError: ErrorException = 
    ErrorException.badRequest("No arguments provided");

  const userNotFoundMsgError: ErrorException = 
    ErrorException.badRequest("User not found");

  const followFetchError: ErrorException = 
    ErrorException.notFound("Invalid fetch parameter");

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
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      followRepository.getFollowStats = vi
        .fn()
        .mockResolvedValue({ followers: 1, following: 1 });

      const result = await followService.getFollowStats(existingUser.user_id);

      expect(result).toStrictEqual({ followers: 1, following: 1 });
      expect(userRepository.findUserById).toBeCalledWith(existingUser.user_id);
      expect(followRepository.getFollowStats).toBeCalledWith(existingUser.user_id);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        followService.getFollowStats(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toBeCalled();
      expect(followRepository.getFollowStats).not.toBeCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(null);

      await expect(
        followService.getFollowStats(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById).toBeCalledWith(notFoundUser.user_id);
      expect(followRepository.getFollowStats).not.toBeCalled();
    });
  });
  
  describe("getFollowerFollowingLists (Get the followers and following lists)", () => {
    test("should return the correct result with followers", async () => {
      const expectedResult = followers.filter(
        (f) => f.follower_id === existingUser.user_id
      );
      
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);
      
      followRepository.getFollowersLists = vi
        .fn()
        .mockResolvedValue(expectedResult);

      followRepository.getFollowingLists = vi
        .fn()
        .mockResolvedValue([]);

      const result = await followService.getFollowerFollowingLists(
        existingUser.user_id,
        "followers",
        [0]
      );

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBeTruthy();

      expect(userRepository.findUserById)
        .toBeCalledWith(existingUser.user_id);

      expect(followRepository.getFollowersLists)
        .toBeCalledWith(existingUser.user_id, [0]);

      expect(followRepository.getFollowingLists).not.toBeCalled();
    });

    test("should return the correct result with following", async () => {
      const expectedResult = following.filter(
        (f) => f.followed_id === existingUser.user_id
      );

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      followRepository.getFollowersLists = vi
        .fn()
        .mockResolvedValue([]);

      followRepository.getFollowingLists = vi
        .fn()
        .mockResolvedValue(expectedResult);
      
      const result = await followService
        .getFollowerFollowingLists(existingUser.user_id, "following", [0]);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBeTruthy();

      expect(userRepository.findUserById)
        .toBeCalledWith(existingUser.user_id);
        
      expect(followRepository.getFollowersLists).not.toBeCalled();

      expect(followRepository.getFollowingLists)
        .toBeCalledWith(existingUser.user_id, [0]);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        followService.getFollowerFollowingLists(undefined as any, "followers", [0])
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toBeCalled();
      expect(followRepository.getFollowersLists).not.toBeCalled();
      expect(followRepository.getFollowingLists).not.toBeCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(null);

      await expect(
        followService.getFollowerFollowingLists(notFoundUser.user_id, "following", [0])
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById).toBeCalledWith(notFoundUser.user_id);
      expect(followRepository.getFollowersLists).not.toBeCalled();
      expect(followRepository.getFollowingLists).not.toBeCalled();
    });

    test("should throw an error when invalid fetch parameter", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);
        
      await expect(
        followService.getFollowerFollowingLists(existingUser.user_id, "invalid", [0])
      ).rejects.toThrow(followFetchError);

      expect(userRepository.findUserById).toBeCalledWith(existingUser.user_id);
      expect(followRepository.getFollowersLists).not.toBeCalled();
      expect(followRepository.getFollowingLists).not.toBeCalled();
    });
  });

  describe("toggleFollow (User like and unlike the other user)", () => {
    test("should return the correct result", async () => {
      const args = {
        follower_id: existingUser.user_id,
        followed_id: otherExistingUser.user_id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      followRepository.isFollowUser = vi
        .fn()
        .mockResolvedValue(false);

      followRepository.followUser = vi
        .fn()
        .mockResolvedValue("User followed successfully");

      const result = await followService
        .toggleFollow(args.follower_id, args.followed_id);

      expect(result).toBe("User followed successfully");
      expect(userRepository.findUserById).toBeCalledTimes(2);
      expect(followRepository.isFollowUser).toBeCalledWith(args);
      expect(followRepository.followUser).toBeCalledWith(args);
      expect(followRepository.unfollowUser).not.toBeCalled();
    });

    test("should return the correct result", async () => {
      const args = {
        follower_id: existingUser.user_id,
        followed_id: otherExistingUser.user_id,
      };
      
      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      followRepository.isFollowUser = vi
        .fn()
        .mockResolvedValue(true);

      followRepository.unfollowUser = vi
        .fn()
        .mockResolvedValue("User unfollowed successfully");

      const result = await followService
        .toggleFollow(args.follower_id, args.followed_id);

      expect(result).toBe("User unfollowed successfully");
      expect(userRepository.findUserById).toBeCalledTimes(2);
      expect(followRepository.isFollowUser).toBeCalledWith(args);
      expect(followRepository.followUser).not.toBeCalled();
      expect(followRepository.unfollowUser).toBeCalledWith(args);
    });

    test("should throw an error when no args are provided", async () => {
      const noArgs = {
        follower_id: undefined as any,
        followed_id: otherExistingUser.user_id,
      };
      
      await expect(
        followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toBeCalled();
      expect(followRepository.isFollowUser).not.toBeCalled();
      expect(followRepository.followUser).not.toBeCalled();
      expect(followRepository.unfollowUser).not.toBeCalled();
    });

    test("should throw an error when user is not found", async () => {
      const notFoundUserArgs = {
        follower_id: notFoundUser.user_id,
        followed_id: otherExistingUser.user_id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        followService.toggleFollow(
          notFoundUserArgs.follower_id,
          notFoundUserArgs.followed_id
        )
      ).rejects.toThrow(userNotFoundMsgError)

      expect(userRepository.findUserById)
        .toBeCalledWith(notFoundUserArgs.follower_id);

      expect(followRepository.isFollowUser).not.toBeCalled();
      expect(followRepository.followUser).not.toBeCalled();
      expect(followRepository.unfollowUser).not.toBeCalled();
    });

    test("should throw an error when the other is not found", async () => {
      const notFoundOtherUserArgs = {
        follower_id: existingUser.user_id,
        followed_id: notFoundUser.user_id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(undefined));

      await expect(
        followService.toggleFollow(
          notFoundOtherUserArgs.follower_id,
          notFoundOtherUserArgs.followed_id
        )
      ).rejects.toThrow("The user to be followed doesn't exist");

      expect(userRepository.findUserById)
        .toBeCalledWith(notFoundOtherUserArgs.follower_id);

      expect(userRepository.findUserById)
        .toBeCalledWith(notFoundOtherUserArgs.followed_id);

      expect(followRepository.isFollowUser).not.toBeCalled();
      expect(followRepository.followUser).not.toBeCalled();
      expect(followRepository.unfollowUser).not.toBeCalled();
    });
  });
});