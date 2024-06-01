
import FeedService                                           from "@/services/feed/feed.service.impl";
import IEFeedService                                         from "@/services/feed/feed.service";
import FeedRepository                                        from "@/repositories/feed/feed.repository.impl";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import IEUserRepository                                      from "@/repositories/user/user.repository";
import IEFeedRepository                                      from "@/repositories/feed/feed.repository";
import GenerateMockData                                      from "../../utils/generate-data.util";
import ApiErrorException                                     from "@/exceptions/api.exception";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

describe("FeedService", () =>  {
  let feedRepository: IEFeedRepository;
  let userRepository: IEUserRepository;
  let feedService:    IEFeedService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
  };

  const users = GenerateMockData.createUserList(10);
  const existingUser = users[0]!;
  const nonExistingUser = GenerateMockData.createUser();

  beforeEach(() => {
    feedRepository = new FeedRepository();
    userRepository = new UserRepository();

    feedService = new FeedService(
      feedRepository,
      userRepository
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getUserFeed", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(existingUser);
      feedRepository.getUserFeed = vi.fn().mockResolvedValueOnce([]);

      const userFeed = await feedService.getUserFeed(existingUser.uuid, [0]);

      expect(userFeed).toBeInstanceOf(Array);
      expect(userFeed).toStrictEqual([]);
      expect(userFeed).toHaveLength(0);
        
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);

      expect(feedRepository.getUserFeed)
        .toHaveBeenCalledWith(existingUser.id, [0]);
    });

    test("should throw an error if no arguments are provided", async () => {
      userRepository.findUserById = vi.fn();
      feedRepository.getUserFeed = vi.fn();

      await expect(
        feedService.getUserFeed(undefined as any, [])
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(feedRepository.getUserFeed).not.toHaveBeenCalled();
    });

    test("should throw an error if the user is not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(null);
      feedRepository.getUserFeed = vi.fn();

      await expect(
        feedService.getUserFeed(nonExistingUser.uuid, [])
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(nonExistingUser.uuid);

      expect(feedRepository.getUserFeed).not.toHaveBeenCalled();
    });
  });

  describe("getExploreFeed", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(existingUser);
      feedRepository.getExploreFeed = vi.fn().mockResolvedValueOnce([]);

      const exploreFeed = await feedService.getExploreFeed(existingUser.uuid);

      expect(exploreFeed).toBeInstanceOf(Array);
      expect(exploreFeed).toStrictEqual([]);
      expect(exploreFeed).toHaveLength(0);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);

      expect(feedRepository.getExploreFeed)
        .toHaveBeenCalledWith(existingUser.id);
    });

    test("should throw an error if no arguments are provided", async () => {
      userRepository.findUserById = vi.fn();
      feedRepository.getExploreFeed = vi.fn();
      
      await expect(
        feedService.getExploreFeed(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(feedRepository.getExploreFeed).not.toHaveBeenCalled();
    });

    test("should throw an error if the user is not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(null);
      feedRepository.getExploreFeed = vi.fn();

      await expect(
        feedService.getExploreFeed(nonExistingUser.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(nonExistingUser.uuid);

      expect(feedRepository.getExploreFeed).not.toHaveBeenCalled();
    });
  });
});