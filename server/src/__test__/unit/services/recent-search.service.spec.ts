import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import generateMockData                                      from "../util/generate-mock-data";
import RecentSearchService                                   from "@/services/recent-search/recent-search.service.impl";
import RecentSearchRepository                                from "@/repositories/recent-search/recent-search.repository.impl";
import { createRecentSearch }                                from "@/__mock__/data/search.mock";
import { createUser, createUserList }                        from "@/__mock__/data/user.mock";
import { SelectSearches, SelectUsers }                       from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Create a mock of the user service
let users: SelectUsers[] = createUserList(10);
const notFoundUser = createUser();
const existingUser = users[0]!;

// Create a mock of the recent searches
let recentSearches: SelectSearches[] = generateMockData(
  false,
  users,
  createRecentSearch
);

const newSearch = users[9]!;
const existingSearch = recentSearches[0]!;
const notFoundSearch = createRecentSearch(
  notFoundUser.user_id,
  notFoundUser.user_id
);

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
  "@/repositories/recent-search/recent-search.repository.impl",
  async (importOriginal) => {
    const original = await importOriginal<
      typeof import("@/repositories/recent-search/recent-search.repository.impl")
    >();
    return {
      ...original,
      default: vi.fn().mockImplementation(() => ({
        saveRecentSearches: vi
          .fn()
          .mockImplementation((user_id: number, search_user_id: number) =>
            recentSearches.push({
              ...createRecentSearch(user_id, search_user_id),
            })
          ),
        removeRecentSearches: vi
          .fn()
          .mockImplementation((recent_id: number) =>
            recentSearches.filter((item) => item.recent_id !== recent_id)
          ),
        getRecentSearches: vi
          .fn()
          .mockImplementation((user_id: number) =>
            recentSearches.filter((r) => r.user_id === user_id)
          ),
        findUsersSearchByRecentId: vi
          .fn()
          .mockImplementation((recent_id: number) =>
            recentSearches.find((r) => r.recent_id === recent_id)
          ),
        findUsersSearchByUserId: vi
          .fn()
          .mockImplementation((user_id: number, search_user_id: number) =>
            recentSearches.find(
              (r) => r.user_id === user_id && r.search_user_id === search_user_id
            )
          ),
        deleteRecentSearches: vi
          .fn()
          .mockImplementation((recent_id: number) =>
            recentSearches.filter((r) => r.recent_id !== recent_id)
          ),
      })),
    };
  }
);

describe("RecentSearchService", () => {
  let recentSearchService: RecentSearchService;

  let noArgsMsgError:            ErrorException = ErrorException.badRequest("No arguments provided");
  let userNotFoundMsgError:      ErrorException = ErrorException.badRequest("User not found");
  let userSearchNotFoundError:   ErrorException = ErrorException.notFound("Search user not found");
  let recentSearchNotFoundError: ErrorException = ErrorException.notFound("Recent search not found");

  beforeEach(() => {
    let userRepository = new UserRepository();
    let recentSearchRepository = new RecentSearchRepository();
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

      const result = await recentSearchService
        .getAllRecentSearches(existingUser.user_id);

      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(expectedResult.length);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        recentSearchService.getAllRecentSearches(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        recentSearchService.getAllRecentSearches(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });

  describe("saveRecentSearches (Save the recent searches)", () => {
    test("should return the correct result", async () => {
      const result = await recentSearchService
        .saveRecentSearches(existingUser.user_id, newSearch.user_id);

      expect(result).toBe("Search user saved successfully");
    });
    
    test("should return the correct result when search user is already saved", async () => {
      const result = await recentSearchService.saveRecentSearches(
        existingSearch?.user_id,
        existingSearch?.search_user_id
      );

      expect(result).toBe("Search user already saved");
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        recentSearchService.saveRecentSearches(
          undefined as any,
          existingUser.user_id
        )
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        recentSearchService.saveRecentSearches(
          notFoundUser.user_id,
          existingUser.user_id
        )
      ).rejects.toThrow(userNotFoundMsgError);
    });

    test("should throw an error when search user is not found", async () => {
      await expect(
        recentSearchService.saveRecentSearches(
          existingSearch?.user_id,
          notFoundSearch.search_user_id
        )
      ).rejects.toThrow(userSearchNotFoundError);
    });
  });

  describe("removeRecentSearches (Remove the recent searches)", () => {
    test("should return the correct result", async () => {
      const result = await recentSearchService
        .removeRecentSearches(existingSearch.recent_id);
      expect(result).toBe("Search user deleted successfully");
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        recentSearchService.removeRecentSearches(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        recentSearchService.removeRecentSearches(notFoundSearch.user_id)
      ).rejects.toThrow(recentSearchNotFoundError);
    });
  });
});