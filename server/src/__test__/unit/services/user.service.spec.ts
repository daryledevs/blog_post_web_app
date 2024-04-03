import UserService                                           from "@/services/user/user.service.impl";
import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import FollowRepository                                      from "@/repositories/follow/follow.repository.impl";
import RecentSearchRepository                                from "@/repositories/recent-search/recent-search.repository.impl";
import { createUserList, createUser }                        from "@/__mock__/user/user.mock";
import { createRecentSearch, createSearchList }              from "@/__mock__/recent-search/search.mock";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { SelectSearches, SelectUsers } from "@/types/table.types";

let users: SelectUsers[] = createUserList(10);
const notFoundUser = createUser();
const existingUser = users[0] || createUser();

let recentSearches: SelectSearches[] = users.flatMap((u, i) => {
  let nextUser = users[i + 1];
  let nextUserId = nextUser ? nextUser.user_id : u.user_id;
  return createSearchList(5, u.user_id, nextUserId);
});

const notFoundSearch = createRecentSearch(notFoundUser.user_id, notFoundUser.user_id);
const existingSearch = recentSearches[0];
const newSearch = users[9] || createUser();

vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/repositories/user/user.repository.impl")>();
  
  return {
    ...original,
    default: vi.fn().mockImplementation(() => ({
      findUserById: vi
        .fn()
        .mockImplementation((id: number) =>
          users.find((u) => u.user_id === id)
        ),
      findUserByUsername: vi
        .fn()
        .mockImplementation((username: string) =>
          users.find((u) => u.username === username)
        ),
      findUserByEmail: vi
        .fn()
        .mockImplementation((email: string) =>
          users.find((u) => u.email === email)
        ),
      updateUser: vi.fn().mockImplementation((id: number, user: any) => {
        const index = users.findIndex((u) => u.user_id === id);
        if (index === -1) throw ErrorException.badRequest("User not found");
        return (users[index] = { ...users[index], ...user });
      }),
      deleteUser: vi.fn().mockImplementation((id: number) => {
        const user = users.find((u) => u.user_id === id);
        if (!user) throw ErrorException.badRequest("User not found");
        return users.filter((u) => u.user_id !== id);
      }),
      searchUserByFields: vi
        .fn()
        .mockImplementation((search: string) =>
          users.find((u) => u.username === search)
        ),
      getAllRecentSearches: vi
        .fn()
        .mockImplementation((user_id: number) =>
          recentSearches.filter((r) => r.user_id === user_id)
        ),
      searchUsersByQuery: vi
        .fn()
        .mockImplementation((search: string) =>
          users.filter(
            (u) =>
              u.username.includes(search) ||
              u?.first_name?.includes(search) ||
              u?.last_name?.includes(search) ||
              `${u?.first_name} ${u?.last_name}`.includes(search)
          )
        ),
    })),
  };
});

vi.mock("@/repositories/follow/follow.repository.impl", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/repositories/follow/follow.repository.impl")>();
  return {
    ...original,
    default: vi.fn().mockImplementation(() => ({

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
        findUsersSearchByUserId: vi
          .fn()
          .mockImplementation((user_id: number, search_user_id: number) =>
            recentSearches.find(
              (r) =>
                r.user_id === user_id && r.search_user_id === search_user_id
            )
          ),
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
      })),
    };
  }
);

describe('UserService', () => {
  let userService:            UserService;
  let userRepository:         UserRepository;
  let followRepository:       FollowRepository;
  let recentSearchRepository: RecentSearchRepository;

  let noArgsMsg:         ErrorException = ErrorException.badRequest("No arguments provided");
  let notFoundMsg:       ErrorException = ErrorException.badRequest("User not found");
  let notFoundSearchMsg: ErrorException = ErrorException.notFound("Search user not found");

  beforeEach(() => {
    userRepository         = new UserRepository();
    followRepository       = new FollowRepository();
    recentSearchRepository = new RecentSearchRepository();
    
    userService = new UserService(
      userRepository,
      followRepository,
      recentSearchRepository
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Get user's data by id", () => {
    test("getUserById should return the correct result", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserById");
      const result = await userService.getUserById(existingUser.user_id);
      expect(result).toBe(existingUser);

      methodMock.mockRejectedValue(existingUser);
      expect(methodMock).toHaveBeenCalledWith(existingUser.user_id);
      expect(methodMock).toHaveBeenCalledTimes(1);
    });

    test("getUserById should throw an error when no args are provided", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserById");

      await expect(
        userService.getUserById(undefined as any)
      ).rejects.toThrow(noArgsMsg);

      methodMock.mockRejectedValue(noArgsMsg);
      expect(methodMock).toHaveBeenCalledTimes(0);
    });

    test("getUserById should throw an error when user is not found", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserById");

      await expect(
        userService.getUserById(notFoundUser.user_id)
      ).rejects.toThrow(notFoundMsg);

      methodMock.mockRejectedValue(notFoundMsg);
      expect(methodMock).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(methodMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get user's data by username", () => {
    test("getUserByUsername should return the correct result", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserByUsername");
      const result = await userService.getUserByUsername(existingUser.username);
      expect(result).toBe(existingUser);

      methodMock.mockRejectedValue(existingUser);
      expect(methodMock).toHaveBeenCalledWith(existingUser.username);
      expect(methodMock).toHaveBeenCalledTimes(1);
    });

    test("getUserByUsername should throw an error when no args are provided", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserByUsername");

      await expect(
        userService.getUserByUsername(undefined as any)
      ).rejects.toThrow(noArgsMsg);

      methodMock.mockRejectedValue(noArgsMsg);
      expect(methodMock).toHaveBeenCalledTimes(0);
    });

    test("getUserByUsername should throw an error when user is not found", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserByUsername");

      await expect(
        userService.getUserByUsername(notFoundUser.username)
      ).rejects.toThrow(notFoundMsg);

      methodMock.mockRejectedValue(notFoundMsg);
      expect(methodMock).toHaveBeenCalledWith(notFoundUser.username);
      expect(methodMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get user data by email", async () => {
    test("getUserByEmail should return the correct result", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserByEmail");
      const result = await userService.getUserByEmail(existingUser.email);
      expect(result).toBe(existingUser);

      methodMock.mockRejectedValue(existingUser);
      expect(methodMock).toHaveBeenCalledWith(existingUser.email);
      expect(methodMock).toHaveBeenCalledTimes(1);
    });

    test("getUserByEmail should throw an error when no args are provided", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserByEmail");

      await expect(
        userService.getUserByEmail(undefined as any)
      ).rejects.toThrow(noArgsMsg);

      methodMock.mockRejectedValue(noArgsMsg);
      expect(methodMock).toHaveBeenCalledTimes(0);
    });

    test("getUserByEmail should throw an error when user is not found", async () => {
      const methodMock = vi.spyOn(userRepository, "findUserByEmail");

      await expect(
        userService.getUserByEmail(notFoundUser.email)
      ).rejects.toThrow(notFoundMsg);

      methodMock.mockRejectedValue(notFoundMsg);
      expect(methodMock).toHaveBeenCalledWith(notFoundUser.email);
      expect(methodMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update user's data", async () => {
    test("updateUser should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const updateUser = vi.spyOn(userRepository, "updateUser");
      
      const result = await userService.updateUser(existingUser.user_id, existingUser);
      expect(result).toStrictEqual(existingUser);

      findUserById.mockRejectedValue(notFoundMsg);
      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      updateUser.mockRejectedValue(notFoundMsg);
      expect(updateUser).toHaveBeenCalledWith(existingUser.user_id, existingUser);
      expect(updateUser).toHaveBeenCalledTimes(1);
    });

    test("updateUser should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const updateUser = vi.spyOn(userRepository, "updateUser");

      await expect(
        userService.updateUser(undefined as any, existingUser)
      ).rejects.toThrow(noArgsMsg);

      findUserById.mockRejectedValue(notFoundMsg);
      expect(findUserById).toHaveBeenCalledTimes(0);

      updateUser.mockRejectedValue(notFoundMsg);
      expect(updateUser).toHaveBeenCalledTimes(0);
    });

    test("updateUser should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const updateUser = vi.spyOn(userRepository, "updateUser");

      await expect(
        userService.updateUser(notFoundUser.user_id, notFoundUser)
      ).rejects.toThrow(notFoundMsg);

      findUserById.mockRejectedValue(notFoundMsg);
      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      updateUser.mockRejectedValue(notFoundMsg);
      expect(updateUser).toHaveBeenCalledTimes(0);
    });
  });

  describe("Delete user's data", async () => {
    test("deleteUserById should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const deleteUser = vi.spyOn(userRepository, "deleteUser");

      const result = await userService.deleteUserById(existingUser.user_id);
      expect(result).toBe("User deleted successfully");

      findUserById.mockResolvedValue(existingUser);
      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      expect(deleteUser).toHaveBeenCalledWith(existingUser.user_id);
      expect(deleteUser).toHaveBeenCalledTimes(1);
    });

    test("deleteUserById should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const deleteUser = vi.spyOn(userRepository, "deleteUser");

      await expect(
        userService.deleteUserById(undefined as any)
      ).rejects.toThrow(noArgsMsg);

      findUserById.mockRejectedValue(noArgsMsg);
      expect(findUserById).toHaveBeenCalledTimes(0);

      deleteUser.mockRejectedValue(noArgsMsg);
      expect(deleteUser).toHaveBeenCalledTimes(0);
    });

    test("deleteUserById should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const deleteUser = vi.spyOn(userRepository, "deleteUser");

      await expect(
        userService.deleteUserById(notFoundUser.user_id)
      ).rejects.toThrow(notFoundMsg);

      findUserById.mockRejectedValue(notFoundMsg);
      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      deleteUser.mockRejectedValue(notFoundMsg);
      expect(deleteUser).toHaveBeenCalledTimes(0);
    });
  });

  describe("Find users by search", async () => {
    test("searchUserByFields should return the correct result with username", async () => {
      const mockMethod = vi.spyOn(userRepository, "searchUsersByQuery");
      mockMethod.mockResolvedValue(users);

      const result = await userService.searchUserByFields(existingUser.username);
      expect(result).toStrictEqual(users);

      expect(mockMethod).toHaveBeenCalledWith(existingUser.username);
      expect(mockMethod).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should return the correct result with first name", async () => {
      const mockMethod = vi.spyOn(userRepository, "searchUsersByQuery");
      mockMethod.mockResolvedValue(users);

      const result = await userService.searchUserByFields(existingUser.first_name as any);
      expect(result).toStrictEqual(users);

      expect(mockMethod).toHaveBeenCalledWith(existingUser.first_name);
      expect(mockMethod).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should return the correct result with last name", async () => {
      const mockMethod = vi.spyOn(userRepository, "searchUsersByQuery");
      mockMethod.mockResolvedValue(users);

      const result = await userService.searchUserByFields(existingUser.last_name as any);
      expect(result).toStrictEqual(users);

      expect(mockMethod).toHaveBeenCalledWith(existingUser.last_name);
      expect(mockMethod).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should return the correct result with last name", async () => {
      const mockMethod = vi.spyOn(userRepository, "searchUsersByQuery");
      mockMethod.mockResolvedValue(users);

      const result = await userService.searchUserByFields(`${existingUser.first_name} ${existingUser.last_name}`);
      expect(result).toStrictEqual(users);

      expect(mockMethod).toHaveBeenCalledWith(`${existingUser.first_name} ${existingUser.last_name}`);
      expect(mockMethod).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should throw an error when no args are provided", async () => {
      const mockMethod = vi.spyOn(userRepository, "searchUsersByQuery");
      mockMethod.mockRejectedValue(noArgsMsg);

      await expect(
        userService.searchUserByFields(undefined as any)
      ).rejects.toThrow(noArgsMsg);

      expect(mockMethod).toHaveBeenCalledTimes(0);
    });
  });

  describe("Get all the recent searches", async () => {
    test("getAllRecentSearches should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getRecentSearches = vi.spyOn(recentSearchRepository, "getRecentSearches");

      findUserById.mockResolvedValue(existingUser);
      getRecentSearches.mockResolvedValue(recentSearches);

      const result = await userService.getAllRecentSearches(existingUser.user_id);
      expect(result).toStrictEqual(recentSearches);

      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      expect(getRecentSearches).toHaveBeenCalledWith(existingUser.user_id);
      expect(getRecentSearches).toHaveBeenCalledTimes(1);
    });

    test("getAllRecentSearches should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getRecentSearches = vi.spyOn(recentSearchRepository, "getRecentSearches");

      await expect(
        userService.getAllRecentSearches(undefined as any)
      ).rejects.toThrow(noArgsMsg);

      expect(findUserById).toHaveBeenCalledTimes(0);
      expect(getRecentSearches).toHaveBeenCalledTimes(0);
    });

    test("getAllRecentSearches should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getRecentSearches = vi.spyOn(recentSearchRepository, "getRecentSearches");

      findUserById.mockRejectedValue(notFoundMsg);
      getRecentSearches.mockRejectedValue(notFoundMsg);

      await expect(
        userService.getAllRecentSearches(notFoundUser.user_id)
      ).rejects.toThrow(notFoundMsg);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      expect(getRecentSearches).toHaveBeenCalledTimes(0);
    });
  });

  describe("saveRecentSearches", () => {
    test("saveRecentSearches should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const saveRecentSearches = vi.spyOn(recentSearchRepository, "saveRecentSearches");
      
      const result = await userService
        .saveRecentSearches(existingUser.user_id, newSearch.user_id);
      expect(result).toBe("Search user saved successfully");
      
      findUserById.mockResolvedValue(existingUser);
      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledWith(newSearch.user_id);
      expect(findUserById).toHaveBeenCalledTimes(2);

      expect(saveRecentSearches)
        .toHaveBeenCalledWith(existingUser.user_id, newSearch.user_id);
      expect(saveRecentSearches).toHaveBeenCalledTimes(1);
    });

    test("saveRecentSearches should return the correct result when search user is already saved", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const saveRecentSearches = vi.spyOn(recentSearchRepository, "saveRecentSearches");

      const result = await userService.saveRecentSearches(
        existingSearch?.user_id,
        existingSearch?.search_user_id
      );
      
      expect(result).toBe("Search user already saved");

      findUserById.mockResolvedValue(existingUser);
      expect(findUserById).toHaveBeenCalledWith(existingSearch?.user_id);
      expect(findUserById).toHaveBeenCalledWith(existingSearch?.search_user_id);
      expect(findUserById).toHaveBeenCalledTimes(2);

      expect(saveRecentSearches).toHaveBeenCalledTimes(0);
    });

    test("saveRecentSearches should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const saveRecentSearches = vi.spyOn(recentSearchRepository, "saveRecentSearches");

      await expect(
        userService.saveRecentSearches(undefined as any, newSearch.user_id)
      ).rejects.toThrow(noArgsMsg);

      expect(findUserById).toHaveBeenCalledTimes(0);
      expect(saveRecentSearches).toHaveBeenCalledTimes(0);
    });

    test("saveRecentSearches should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const saveRecentSearches = vi.spyOn(recentSearchRepository, "saveRecentSearches");

      await expect(
        userService.saveRecentSearches(
          notFoundSearch.user_id,
          existingSearch?.search_user_id
        )
      ).rejects.toThrow(notFoundMsg);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      expect(saveRecentSearches).toHaveBeenCalledTimes(0);
    });

    test("saveRecentSearches should throw an error when search user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const saveRecentSearches = vi.spyOn(recentSearchRepository, "saveRecentSearches");

      await expect(
        userService.saveRecentSearches(
          existingSearch?.user_id,
          notFoundSearch.search_user_id
        )
      ).rejects.toThrow(notFoundSearchMsg);

      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(2);

      expect(saveRecentSearches).toHaveBeenCalledTimes(0);
    });
  });

  // describe("removeRecentSearches", () => {
    
  // });
});