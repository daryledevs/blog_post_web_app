import UserRepository                                        from "@/repositories/user/user.repository.impl";
import GenerateMockData                                      from "../../utils/generate-data.util";
import IEUserRepository                                      from "@/repositories/user/user.repository";
import ApiErrorException                                     from "@/exceptions/api.exception";
import SearchHistoryService                                  from "@/services/search-history/search-history.service.impl";
import IESearchHistoryService                                from "@/services/search-history/search-history.service";
import SearchHistoryRepository                               from "@/repositories/search-history/search-history.repository.impl";
import IESearchHistoryRepository                             from "@/repositories/search-history/search-history.repository";
import { SelectSearches, SelectUsers }                       from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";


vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/repositories/search-history/search-history.repository.impl");

describe("SearchHistoryService", () => {
  let userRepository:          IEUserRepository;
  let searchHistoryRepository: IESearchHistoryRepository;
  let searchHistoryService:    IESearchHistoryService;

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
  const otherExistingUser = users[1]!;

  // Create a mock of the recent searches
  let recentSearches: SelectSearches[] = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createRecentSearch
  );

  const newSearch = users[9]!;
  const existingSearch = recentSearches[0]!;

  const notFoundSearch = GenerateMockData.createRecentSearch(
    notFoundUser.id,
    notFoundUser.id
  );

  beforeEach(() => {
    userRepository = new UserRepository();
    searchHistoryRepository = new SearchHistoryRepository();

    searchHistoryService = new SearchHistoryService(
      userRepository,
      searchHistoryRepository
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getUsersSearchHistoryById (Get all the recent searches)", () => {
    test("should return the correct result", async () => {
      const expectedResult = recentSearches.filter(
        (r) => r.uuid === existingUser.uuid
      );

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      searchHistoryRepository.findSearchHistoryById = vi
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await searchHistoryService
        .getUsersSearchHistoryById(existingUser.uuid);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(expectedResult.length);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);

      expect(searchHistoryRepository.findSearchHistoryById)
        .toHaveBeenCalledWith(existingUser.id);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      searchHistoryRepository.findSearchHistoryById = vi.fn();

      await expect(
        searchHistoryService.getUsersSearchHistoryById(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById)
        .not.toHaveBeenCalled();

      expect(searchHistoryRepository.findSearchHistoryById)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      searchHistoryRepository.findSearchHistoryById = vi.fn();

      await expect(
        searchHistoryService.getUsersSearchHistoryById(notFoundUser.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.uuid);

      expect(searchHistoryRepository.findSearchHistoryById)
        .not.toHaveBeenCalled();
    });
  });

  describe("saveUsersSearch (Save the recent searches)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(newSearch);

      searchHistoryRepository.findUsersSearchByUsersId = vi
        .fn()
        .mockResolvedValue(null);

      searchHistoryRepository.saveUsersSearch = vi
        .fn()
        .mockResolvedValue("Search user saved successfully");

      const result = await searchHistoryService.saveUsersSearch(
        existingUser.uuid,
        newSearch.uuid
      );

      expect(result).toBe("Search user saved successfully");

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(newSearch.uuid);
    });
    
    test("should return the correct result when search user is already saved", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(otherExistingUser));

      searchHistoryRepository.findUsersSearchByUsersId = vi
        .fn()
        .mockResolvedValue(existingSearch);

      searchHistoryRepository.saveUsersSearch = vi.fn();

      const result = await searchHistoryService.saveUsersSearch(
        existingUser?.uuid,
        otherExistingUser?.uuid
      );

      expect(result).equal("Search user already saved");

      expect(userRepository.findUserById).toHaveBeenCalledTimes(2);

      expect(
        searchHistoryRepository.findUsersSearchByUsersId
      ).toHaveBeenCalledWith(
        existingSearch?.searcher_id,
        existingSearch?.searched_id
      );

      expect(searchHistoryRepository.saveUsersSearch)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      searchHistoryRepository.saveUsersSearch = vi.fn();

      await expect(
        searchHistoryService.saveUsersSearch(
          undefined as any,
          existingUser.uuid
        )
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(searchHistoryRepository.saveUsersSearch).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      searchHistoryRepository.saveUsersSearch = vi.fn();

      await expect(
        searchHistoryService.saveUsersSearch(
          notFoundUser.uuid,
          existingUser.uuid
        )
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.uuid);

      expect(searchHistoryRepository.saveUsersSearch)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when search user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(existingUser))
        .mockImplementationOnce(() => Promise.resolve(undefined));
        
      searchHistoryRepository.saveUsersSearch = vi.fn();

      await expect(
        searchHistoryService.saveUsersSearch(
          existingSearch?.uuid,
          notFoundSearch.uuid
        )
      ).rejects.toThrow(error.searchUserNotFound);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingSearch?.uuid);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        notFoundSearch.uuid
      );

      expect(searchHistoryRepository.saveUsersSearch).not.toHaveBeenCalled();
    });
  });

  describe("removeRecentSearchesById (Remove the recent searches)", () => {
    test("should return the correct result", async () => {
      searchHistoryRepository.findUsersSearchById = vi
        .fn()
        .mockResolvedValue(existingSearch);

      searchHistoryRepository.deleteUsersSearchById = vi.fn();

      const result = await searchHistoryService
        .removeRecentSearchesById(existingSearch.uuid);

      expect(result).toBe("Search user deleted successfully");

      expect(searchHistoryRepository.findUsersSearchById)
        .toHaveBeenCalledWith(existingSearch.uuid);

      expect(searchHistoryRepository.deleteUsersSearchById)
        .toHaveBeenCalledWith(existingSearch.id);
    });

    test("should throw an error when no args are provided", async () => {
      searchHistoryRepository.findUsersSearchById = vi.fn();
      searchHistoryRepository.deleteUsersSearchById = vi.fn();

      await expect(
        searchHistoryService.removeRecentSearchesById(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(searchHistoryRepository.findUsersSearchById)
        .not.toHaveBeenCalled();

      expect(searchHistoryRepository.deleteUsersSearchById)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      searchHistoryRepository.findUsersSearchById = vi
        .fn()
        .mockResolvedValue(undefined);
        
      searchHistoryRepository.deleteUsersSearchById = vi.fn();
      
      await expect(
        searchHistoryService.removeRecentSearchesById(notFoundSearch.uuid)
      ).rejects.toThrow(error.recentSearchNotFound);

      expect(searchHistoryRepository.findUsersSearchById)
        .toHaveBeenCalledWith(notFoundSearch.uuid);

      expect(searchHistoryRepository.deleteUsersSearchById)
        .not.toHaveBeenCalled();
    });
  });
});