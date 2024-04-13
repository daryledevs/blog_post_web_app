
import FeedService                                           from "@/services/feed/feed.service.impl";
import FeedRepository                                        from "@/repositories/feed/feed.repository.impl";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import ErrorException                                        from "@/exceptions/api.exception";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import GenerateMockData from "../../utils/generate-data.util";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

describe("FeedService", () =>  {
  let feedRepository: FeedRepository;
  let userRepository: UserRepository;
  let feedService: FeedService;

  const noArgsMsgError: ErrorException = 
    ErrorException.HTTP400Error("No arguments provided");

  const userNotFoundMsgError: ErrorException =
    ErrorException.HTTP400Error("User not found");

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

      const userFeed = await feedService.getUserFeed(existingUser.user_id, [0]);

      expect(userFeed).toBeInstanceOf(Array);
      expect(userFeed).toStrictEqual([]);
      expect(userFeed).toHaveLength(0);
        
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);

      expect(feedRepository.getUserFeed)
        .toHaveBeenCalledWith(existingUser.user_id, [0]);
    });

    test("should throw an error if no arguments are provided", async () => {
      await expect(
        feedService.getUserFeed(undefined as any, [])
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(feedRepository.getUserFeed).not.toHaveBeenCalled();
    });

    test("should throw an error if the user is not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(null);

      await expect(
        feedService.getUserFeed(nonExistingUser.user_id, [])
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(nonExistingUser.user_id);

      expect(feedRepository.getUserFeed).not.toHaveBeenCalled();
    });
  });

  describe("getExploreFeed", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(existingUser);
      feedRepository.getExploreFeed = vi.fn().mockResolvedValueOnce([]);

      const exploreFeed = await feedService.getExploreFeed(existingUser.user_id);

      expect(exploreFeed).toBeInstanceOf(Array);
      expect(exploreFeed).toStrictEqual([]);
      expect(exploreFeed).toHaveLength(0);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);

      expect(feedRepository.getExploreFeed)
        .toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error if no arguments are provided", async () => {
      await expect(
        feedService.getExploreFeed(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(feedRepository.getExploreFeed).not.toHaveBeenCalled();
    });

    test("should throw an error if the user is not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(null);

      await expect(
        feedService.getExploreFeed(nonExistingUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(nonExistingUser.user_id);

      expect(feedRepository.getExploreFeed).not.toHaveBeenCalled();
    });
  });
});