import UserRepository                                        from "@/repositories/user/user.repository.impl";
import FollowService                                         from "@/services/follow/follow.service.impl";
import FollowRepository                                      from "@/repositories/follow/follow.repository.impl";
import GenerateMockData                                      from "../../utils/generate-data.util";
import ApiErrorException                                     from "@/exceptions/api.exception";
import { SelectFollowers, SelectUsers }                      from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/follow/follow.repository.impl");

describe('FollowService', () => {
  let userRepository:   UserRepository;
  let followRepository: FollowRepository;
  let followService:    FollowService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
    followFetch: ApiErrorException.HTTP404Error("Invalid fetch parameter"),
  };

  // Create a mock of the user service
  let users: SelectUsers[] = GenerateMockData.createUserList(10);
  const notFoundUser = GenerateMockData.createUser();
  const existingUser = users[0]!;
  const otherExistingUser = users[9]!;

  // Create a mock of the followers and following
  let followers: SelectFollowers[] = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createFollower
  );

  let following: SelectFollowers[] = GenerateMockData.generateMockData(
    true, users, GenerateMockData.createFollower
  );

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
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(followRepository.getFollowStats).toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      followRepository.getFollowStats = vi.fn();

      await expect(
        followService.getFollowStats(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(followRepository.getFollowStats).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(null);

      followRepository.getFollowStats = vi.fn();

      await expect(
        followService.getFollowStats(notFoundUser.user_id)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(followRepository.getFollowStats).not.toHaveBeenCalled();
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
        .toHaveBeenCalledWith(existingUser.user_id);

      expect(followRepository.getFollowersLists)
        .toHaveBeenCalledWith(existingUser.user_id, [0]);

      expect(followRepository.getFollowingLists).not.toHaveBeenCalled();
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
        .toHaveBeenCalledWith(existingUser.user_id);
        
      expect(followRepository.getFollowersLists).not.toHaveBeenCalled();

      expect(followRepository.getFollowingLists)
        .toHaveBeenCalledWith(existingUser.user_id, [0]);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      followRepository.getFollowersLists = vi.fn();
      followRepository.getFollowingLists = vi.fn();
      
      await expect(
        followService.getFollowerFollowingLists(undefined as any, "followers", [0])
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(followRepository.getFollowersLists).not.toHaveBeenCalled();
      expect(followRepository.getFollowingLists).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(null);

      followRepository.getFollowersLists = vi.fn();
      followRepository.getFollowingLists = vi.fn();

      await expect(
        followService.getFollowerFollowingLists(notFoundUser.user_id, "following", [0])
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(followRepository.getFollowersLists).not.toHaveBeenCalled();
      expect(followRepository.getFollowingLists).not.toHaveBeenCalled();
    });

    test("should throw an error when invalid fetch parameter", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      followRepository.getFollowersLists = vi.fn();
      followRepository.getFollowingLists = vi.fn();
        
      await expect(
        followService.getFollowerFollowingLists(existingUser.user_id, "invalid", [0])
      ).rejects.toThrow(error.followFetch);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(followRepository.getFollowersLists).not.toHaveBeenCalled();
      expect(followRepository.getFollowingLists).not.toHaveBeenCalled();
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
      
      followRepository.unfollowUser = vi.fn();

      const result = await followService
        .toggleFollow(args.follower_id, args.followed_id);

      expect(result).toBe("User followed successfully");
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(followRepository.isFollowUser).toHaveBeenCalledWith(args);
      expect(followRepository.followUser).toHaveBeenCalledWith(args);
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
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

      followRepository.followUser = vi.fn();

      followRepository.unfollowUser = vi
        .fn()
        .mockResolvedValue("User unfollowed successfully");

      const result = await followService
        .toggleFollow(args.follower_id, args.followed_id);

      expect(result).toBe("User unfollowed successfully");
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(followRepository.isFollowUser).toHaveBeenCalledWith(args);
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).toHaveBeenCalledWith(args);
    });

    test("should throw an error when no args are provided", async () => {
      const noArgs = {
        follower_id: undefined as any,
        followed_id: otherExistingUser.user_id,
      };

      userRepository.findUserById = vi.fn();
      followRepository.isFollowUser = vi.fn();
      followRepository.followUser = vi.fn();
      followRepository.unfollowUser = vi.fn();
      
      await expect(
        followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(followRepository.isFollowUser).not.toHaveBeenCalled();
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      const notFoundUserArgs = {
        follower_id: notFoundUser.user_id,
        followed_id: otherExistingUser.user_id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      followRepository.isFollowUser = vi.fn();
      followRepository.followUser = vi.fn();
      followRepository.unfollowUser = vi.fn();

      await expect(
        followService.toggleFollow(
          notFoundUserArgs.follower_id,
          notFoundUserArgs.followed_id
        )
      ).rejects.toThrow(error.userNotFoundMsg)

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUserArgs.follower_id);

      expect(followRepository.isFollowUser).not.toHaveBeenCalled();
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });

    test("should throw an error when the other is not found", async () => {
      const notFoundOtherUserArgs = {
        follower_id: existingUser.user_id,
        followed_id: notFoundUser.user_id,
      };

      followRepository.isFollowUser = vi.fn();
      followRepository.followUser = vi.fn();
      followRepository.unfollowUser = vi.fn();

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
        .toHaveBeenCalledWith(notFoundOtherUserArgs.follower_id);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundOtherUserArgs.followed_id);

      expect(followRepository.isFollowUser).not.toHaveBeenCalled();
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });
  });
});