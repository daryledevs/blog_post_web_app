import UserRepository                                        from "@/infrastructure/repositories/user.repository.impl";
import FollowService                                         from "@/application/services/follow/follow.service.impl";
import IEFollowService                                       from "@/application/services/follow/follow.service";
import FollowRepository                                      from "@/infrastructure/repositories/follow.repository.impl";
import GenerateMockData                                      from "@/__tests__/utils/generate-data.util";
import IEUserRepository                                      from "@/domain/repositories/user.repository";
import ApiErrorException                                     from "@/application/exceptions/api.exception";
import IEFollowRepository                                    from "@/domain/repositories/follow.repository";
import { SelectFollowers, SelectUsers }                      from "@/domain/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/follow/follow.repository.impl");

describe('FollowService', () => {
  let userRepository:   IEUserRepository;
  let followRepository: IEFollowRepository;
  let followService:    IEFollowService;

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

      followRepository.findUserFollowStatsById = vi
        .fn()
        .mockResolvedValue({ followers: 1, following: 1 });

      const result = await followService.getFollowStats(existingUser.uuid);

      expect(result).toStrictEqual({ followers: 1, following: 1 });
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
      expect(followRepository.findUserFollowStatsById).toHaveBeenCalledWith(existingUser.id);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      followRepository.findUserFollowStatsById = vi.fn();

      await expect(
        followService.getFollowStats(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(followRepository.findUserFollowStatsById).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(null);

      followRepository.findUserFollowStatsById = vi.fn();

      await expect(
        followService.getFollowStats(notFoundUser.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
      expect(followRepository.findUserFollowStatsById).not.toHaveBeenCalled();
    });
  });
  
  describe("getFollowerFollowingLists (Get the followers and following lists)", () => {
    test("should return the correct result with followers", async () => {
      const expectedResult = followers.filter(
        (f) => f.follower_id === existingUser.uuid
      );
      
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);
      
      followRepository.findAllFollowersById = vi
        .fn()
        .mockResolvedValue(expectedResult);

      followRepository.findAllFollowingById = vi
        .fn()
        .mockResolvedValue([]);

      const result = await followService.getFollowerFollowingLists(
        existingUser.uuid,
        "followers",
        [0]
      );

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBeTruthy();

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);

      expect(followRepository.findAllFollowersById)
        .toHaveBeenCalledWith(existingUser.id, [0]);

      expect(followRepository.findAllFollowingById).not.toHaveBeenCalled();
    });

    test("should return the correct result with following", async () => {
      const expectedResult = following.filter(
        (f) => f.followed_id === existingUser.uuid
      );

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      followRepository.findAllFollowersById = vi.fn()

      followRepository.findAllFollowingById = vi
        .fn()
        .mockResolvedValue(expectedResult);
      
      const result = await followService
        .getFollowerFollowingLists(existingUser.uuid, "following", [0]);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBeTruthy();

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);
        
      expect(followRepository.findAllFollowersById).not.toHaveBeenCalled();

      expect(followRepository.findAllFollowingById)
        .toHaveBeenCalledWith(existingUser.id, [0]);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      followRepository.findAllFollowersById = vi.fn();
      followRepository.findAllFollowingById = vi.fn();
      
      await expect(
        followService.getFollowerFollowingLists(undefined as any, "followers", [0])
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(followRepository.findAllFollowersById).not.toHaveBeenCalled();
      expect(followRepository.findAllFollowingById).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(null);

      followRepository.findAllFollowersById = vi.fn();
      followRepository.findAllFollowingById = vi.fn();

      await expect(
        followService.getFollowerFollowingLists(notFoundUser.uuid, "following", [0])
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
      expect(followRepository.findAllFollowersById).not.toHaveBeenCalled();
      expect(followRepository.findAllFollowingById).not.toHaveBeenCalled();
    });

    test("should throw an error when invalid fetch parameter", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      followRepository.findAllFollowersById = vi.fn();
      followRepository.findAllFollowingById = vi.fn();
        
      await expect(
        followService.getFollowerFollowingLists(existingUser.uuid, "invalid", [0])
      ).rejects.toThrow(error.followFetch);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
      expect(followRepository.findAllFollowersById).not.toHaveBeenCalled();
      expect(followRepository.findAllFollowingById).not.toHaveBeenCalled();
    });
  });

  describe("toggleFollow (User like and unlike the other user)", () => {
    test("should return the correct result", async () => {
      const publicIds = {
        follower_id: existingUser.uuid,
        followed_id: otherExistingUser.uuid,
      };

      const privateIds = {
        follower_id: existingUser.id,
        followed_id: otherExistingUser.id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      followRepository.isUserFollowing = vi
        .fn()
        .mockResolvedValue(false);

      followRepository.followUser = vi
        .fn()
        .mockResolvedValue("User followed successfully");
      
      followRepository.unfollowUser = vi.fn();

      const result = await followService.toggleFollow(
        publicIds.follower_id,
        publicIds.followed_id
      );

      expect(result).toBe("User followed successfully");
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(followRepository.isUserFollowing).toHaveBeenCalledWith(privateIds);
      expect(followRepository.followUser).toHaveBeenCalledWith(privateIds);
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });

    test("should return the correct result", async () => {
      const publicIds = {
        follower_id: existingUser.uuid,
        followed_id: otherExistingUser.uuid,
      };

      const privateIds = {
        follower_id: existingUser.id,
        followed_id: otherExistingUser.id,
      };
      
      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      followRepository.isUserFollowing = vi
        .fn()
        .mockResolvedValue(true);

      followRepository.followUser = vi.fn();

      followRepository.unfollowUser = vi
        .fn()
        .mockResolvedValue("User unfollowed successfully");

      const result = await followService.toggleFollow(
        publicIds.follower_id,
        publicIds.followed_id
      );

      expect(result).toBe("User unfollowed successfully");
      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);
      expect(followRepository.isUserFollowing).toHaveBeenCalledWith(privateIds);
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).toHaveBeenCalledWith(privateIds);
    });

    test("should throw an error when no args are provided", async () => {
      const noArgs = {
        follower_id: undefined as any,
        followed_id: otherExistingUser.uuid,
      };

      userRepository.findUserById = vi.fn();
      followRepository.isUserFollowing = vi.fn();
      followRepository.followUser = vi.fn();
      followRepository.unfollowUser = vi.fn();
      
      await expect(
        followService.toggleFollow(noArgs.follower_id, noArgs.followed_id)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(followRepository.isUserFollowing).not.toHaveBeenCalled();
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      const notFoundUserArgs = {
        follower_id: notFoundUser.uuid,
        followed_id: otherExistingUser.uuid,
      };

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      followRepository.isUserFollowing = vi.fn();
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

      expect(followRepository.isUserFollowing).not.toHaveBeenCalled();
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });

    test("should throw an error when the other is not found", async () => {
      const notFoundOtherUserArgs = {
        follower_id: existingUser.uuid,
        followed_id: notFoundUser.uuid,
      };

      followRepository.isUserFollowing = vi.fn();
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
      ).rejects.toThrow("User not found");

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundOtherUserArgs.follower_id);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundOtherUserArgs.followed_id);

      expect(followRepository.isUserFollowing).not.toHaveBeenCalled();
      expect(followRepository.followUser).not.toHaveBeenCalled();
      expect(followRepository.unfollowUser).not.toHaveBeenCalled();
    });
  });
});