import UserRepository                                        from "@/repositories/user/user.repository.impl";
import GenerateMockData                                      from "../../utils/generate-data.util";
import ApiErrorException                                     from "@/exceptions/api.exception";
import RecentSearchService                                   from "@/services/recent-search/recent-search.service.impl";
import RecentSearchRepository                                from "@/repositories/recent-search/recent-search.repository.impl";
import { SelectSearches, SelectUsers }                       from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/recent-search/recent-search.repository.impl");

describe("RecentSearchService", () => {
  let userRepository: UserRepository;
  let recentSearchRepository: RecentSearchRepository;
  let recentSearchService: RecentSearchService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
    searchUserNotFound: ApiErrorException.HTTP404Error("Search user not found"),
    recentSearchNotFound: ApiErrorException.HTTP404Error(
      "Recent search not found"
    ),
  };

  // Create a mock of the user service
  let users: SelectUsers[] = GenerateMockData.createUserList(10);
  const notFoundUser = GenerateMockData.createUser();
  const existingUser = users[0]!;

  // Create a mock of the recent searches
  let recentSearches: SelectSearches[] = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createRecentSearch
  );

  const newSearch = users[9]!;
  const existingSearch = recentSearches[0]!;

  const notFoundSearch = GenerateMockData.createRecentSearch(
    notFoundUser.user_id,
    notFoundUser.user_id
  );

  beforeEach(() => {
    userRepository = new UserRepository();
    recentSearchRepository = new RecentSearchRepository();

    recentSearchService = new RecentSearchService(
      userRepository,
      recentSearchRepository
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getAllRecentSearches (Get all the recent searches)", () => {
    test("should return the correct result", async () => {
      const expectedResult = recentSearches.filter(
        (r) => r.user_id === existingUser.user_id
      );

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      recentSearchRepository.getRecentSearches = vi
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await recentSearchService
        .getAllRecentSearches(existingUser.user_id);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(expectedResult.length);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);

      expect(recentSearchRepository.getRecentSearches)
        .toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      recentSearchRepository.getRecentSearches = vi.fn();

      await expect(
        recentSearchService.getAllRecentSearches(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById)
        .not.toHaveBeenCalled();

      expect(recentSearchRepository.getRecentSearches)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      recentSearchRepository.getRecentSearches = vi.fn();

      await expect(
        recentSearchService.getAllRecentSearches(notFoundUser.user_id)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.user_id);

      expect(recentSearchRepository.getRecentSearches)
        .not.toHaveBeenCalled();
    });
  });

  describe("saveRecentSearches (Save the recent searches)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(newSearch);

      recentSearchRepository.findUsersSearchByUserId = vi
        .fn()
        .mockResolvedValue(null);

      recentSearchRepository.saveRecentSearches = vi
        .fn()
        .mockResolvedValue("Search user saved successfully");

      const result = await recentSearchService
        .saveRecentSearches(existingUser.user_id, newSearch.user_id);

      expect(result).toBe("Search user saved successfully");

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(newSearch.user_id);
    });
    
    test("should return the correct result when search user is already saved", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(existingUser));

      recentSearchRepository.findUsersSearchByUserId = vi
        .fn()
        .mockResolvedValue(existingSearch);

      recentSearchRepository.saveRecentSearches = vi.fn();

      const result = await recentSearchService.saveRecentSearches(
        existingSearch?.user_id,
        existingSearch?.search_user_id
      );

      expect(result).equal("Search user already saved");

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingSearch?.user_id);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingSearch?.search_user_id);

      expect(
        recentSearchRepository.findUsersSearchByUserId
      ).toHaveBeenCalledWith(
        existingSearch?.user_id,
        existingSearch?.search_user_id
      );

      expect(recentSearchRepository.saveRecentSearches)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      recentSearchRepository.saveRecentSearches = vi.fn();

      await expect(
        recentSearchService.saveRecentSearches(
          undefined as any,
          existingUser.user_id
        )
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(recentSearchRepository.saveRecentSearches).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      recentSearchRepository.saveRecentSearches = vi.fn();

      await expect(
        recentSearchService.saveRecentSearches(
          notFoundUser.user_id,
          existingUser.user_id
        )
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.user_id);

      expect(recentSearchRepository.saveRecentSearches)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when search user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(undefined));
        
      recentSearchRepository.saveRecentSearches = vi.fn();

      await expect(
        recentSearchService.saveRecentSearches(
          existingSearch?.user_id,
          notFoundSearch.search_user_id
        )
      ).rejects.toThrow(error.searchUserNotFound);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingSearch?.user_id);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundSearch.search_user_id);

      expect(recentSearchRepository.saveRecentSearches).not.toHaveBeenCalled();
    });
  });

  describe("removeRecentSearches (Remove the recent searches)", () => {
    test("should return the correct result", async () => {
      recentSearchRepository.findUsersSearchByRecentId = vi
        .fn()
        .mockResolvedValue(existingSearch);

      recentSearchRepository.deleteRecentSearches = vi.fn();

      const result = await recentSearchService
        .removeRecentSearches(existingSearch.recent_id);

      expect(result).toBe("Search user deleted successfully");

      expect(recentSearchRepository.findUsersSearchByRecentId)
        .toHaveBeenCalledWith(existingSearch.recent_id);

      expect(recentSearchRepository.deleteRecentSearches)
        .toHaveBeenCalledWith(existingSearch.recent_id);
    });

    test("should throw an error when no args are provided", async () => {
      recentSearchRepository.findUsersSearchByRecentId = vi.fn();
      recentSearchRepository.deleteRecentSearches = vi.fn();

      await expect(
        recentSearchService.removeRecentSearches(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(recentSearchRepository.findUsersSearchByRecentId)
        .not.toHaveBeenCalled();

      expect(recentSearchRepository.deleteRecentSearches)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      recentSearchRepository.findUsersSearchByRecentId = vi
        .fn()
        .mockResolvedValue(undefined);
        
      recentSearchRepository.deleteRecentSearches = vi.fn();
      
      await expect(
        recentSearchService.removeRecentSearches(notFoundSearch.user_id)
      ).rejects.toThrow(error.recentSearchNotFound);

      expect(recentSearchRepository.findUsersSearchByRecentId)
        .toHaveBeenCalledWith(notFoundSearch.user_id);

      expect(recentSearchRepository.deleteRecentSearches)
        .not.toHaveBeenCalled();
    });
  });
});