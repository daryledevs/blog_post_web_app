import UserService                                           from "@/services/user/user.service.impl";
import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import FollowRepository                                      from "@/repositories/follow/follow.repository.impl";
import { createFollower }                                    from "@/__mock__/data/follow.mock";
import { createRecentSearch }                                from "@/__mock__/data/search.mock";
import RecentSearchRepository                                from "@/repositories/recent-search/recent-search.repository.impl";
import { createUser, createUserList }                        from "@/__mock__/data/user.mock";
import { SelectFollowers, SelectSearches, SelectUsers }      from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

const processUsers = (changeArg: boolean, list: any[], callback: Function) => {
  return list.flatMap((u, i) => {
    let nextUser = list[i + 1];
    let nextUserId = nextUser ? nextUser.user_id : u.user_id;

    const args = changeArg ? 
      [nextUserId, u.user_id] : 
      [u.user_id, nextUserId];
      
    return callback(args[0], args[1]);
  });
};

// Create a mock of the user service
let users: SelectUsers[] = createUserList(10);
const notFoundUser = createUser();
const existingUser = users[0]!;

// Create a mock of the recent searches
let recentSearches: SelectSearches[] = processUsers(false, users, createRecentSearch);

const notFoundSearch = createRecentSearch(notFoundUser.user_id, notFoundUser.user_id);
const newSearch = users[9]!;
const existingSearch = recentSearches[0]!;

// Create a mock of the followers and following
let followers: SelectFollowers[] = processUsers(false, users, createFollower);
let following: SelectFollowers[] = processUsers(true, users, createFollower);

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
      getFollowStats: vi
        .fn()
        .mockImplementation((user_id: number) => ({
          followers: followers.filter((u) => u.follower_id === user_id).length,
          following: following.filter((u) => u.followed_id === user_id).length,
        })
        ),
      getFollowersLists: vi
        .fn()
        .mockImplementation((user_id: number, listsId: number[]) =>
          followers.filter(
            (u) => u.follower_id === user_id && !listsId.includes(u.followed_id)
          )
        ),
      getFollowingLists: vi
        .fn()
        .mockImplementation((user_id: number, listsId: number[]) =>
          following.filter(
            (u) => u.followed_id === user_id && !listsId.includes(u.follower_id)
          )
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
        findUsersSearchByRecentId: vi
          .fn()
          .mockImplementation((recent_id: number) =>
            recentSearches.find((r) => r.recent_id === recent_id)
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

describe('UserService', () => {
  let userService:            UserService;
  let userRepository:         UserRepository;
  let followRepository:       FollowRepository;
  let recentSearchRepository: RecentSearchRepository;

  let noArgsMsgError:            ErrorException = ErrorException.badRequest("No arguments provided");
  let userNotFoundMsgError:      ErrorException = ErrorException.badRequest("User not found");
  let userSearchNotFoundError:   ErrorException = ErrorException.notFound("Search user not found");
  let recentSearchNotFoundError: ErrorException = ErrorException.notFound("Recent search not found");

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
      const findUserById = vi.spyOn(userRepository, "findUserById");

      const result = await userService.getUserById(existingUser.user_id);
      expect(result).toBe(existingUser);

      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);
    });

    test("getUserById should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");

      await expect(
        userService.getUserById(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserById).toHaveBeenCalledTimes(0);
    });

    test("getUserById should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");

      await expect(
        userService.getUserById(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get user's data by username", () => {
    test("getUserByUsername should return the correct result", async () => {
      const findUserByUsername = vi.spyOn(userRepository, "findUserByUsername");
      const result = await userService.getUserByUsername(existingUser.username);
      
      expect(result).toBe(existingUser);
      expect(findUserByUsername).toHaveBeenCalledWith(existingUser.username);
      expect(findUserByUsername).toHaveBeenCalledTimes(1);
    });

    test("getUserByUsername should throw an error when no args are provided", async () => {
      const findUserByUsername = vi.spyOn(userRepository, "findUserByUsername");

      await expect(
        userService.getUserByUsername(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserByUsername).toHaveBeenCalledTimes(0);
    });

    test("getUserByUsername should throw an error when user is not found", async () => {
      const findUserByUsername = vi.spyOn(userRepository, "findUserByUsername");

      await expect(
        userService.getUserByUsername(notFoundUser.username)
      ).rejects.toThrow(userNotFoundMsgError);

      findUserByUsername.mockRejectedValue(userNotFoundMsgError);
      expect(findUserByUsername).toHaveBeenCalledWith(notFoundUser.username);
      expect(findUserByUsername).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get user data by email", async () => {
    test("getUserByEmail should return the correct result", async () => {
      const findUserByEmail = vi.spyOn(userRepository, "findUserByEmail");
      const result = await userService.getUserByEmail(existingUser.email);

      expect(result).toBe(existingUser);
      expect(findUserByEmail).toHaveBeenCalledWith(existingUser.email);
      expect(findUserByEmail).toHaveBeenCalledTimes(1);
    });

    test("getUserByEmail should throw an error when no args are provided", async () => {
      const findUserByEmail = vi.spyOn(userRepository, "findUserByEmail");

      await expect(
        userService.getUserByEmail(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserByEmail).toHaveBeenCalledTimes(0);
    });

    test("getUserByEmail should throw an error when user is not found", async () => {
      const findUserByEmail = vi.spyOn(userRepository, "findUserByEmail");

      await expect(
        userService.getUserByEmail(notFoundUser.email)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(findUserByEmail).toHaveBeenCalledWith(notFoundUser.email);
      expect(findUserByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update user's data", async () => {
    test("updateUser should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const updateUser = vi.spyOn(userRepository, "updateUser");

      const result = await userService
        .updateUser(existingUser.user_id, existingUser);

      expect(result).toStrictEqual(existingUser);

      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      expect(updateUser).toHaveBeenCalledWith(existingUser.user_id, existingUser);
      expect(updateUser).toHaveBeenCalledTimes(1);
    });

    test("updateUser should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const updateUser = vi.spyOn(userRepository, "updateUser");

      await expect(
        userService.updateUser(undefined as any, existingUser)
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserById).toHaveBeenCalledTimes(0);
      expect(updateUser).toHaveBeenCalledTimes(0);
    });

    test("updateUser should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const updateUser = vi.spyOn(userRepository, "updateUser");

      await expect(
        userService.updateUser(notFoundUser.user_id, notFoundUser)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);
      expect(updateUser).toHaveBeenCalledTimes(0);
    });
  });

  describe("Delete user's data", async () => {
    test("deleteUserById should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const deleteUser = vi.spyOn(userRepository, "deleteUser");

      const result = await userService.deleteUserById(existingUser.user_id);
      expect(result).toBe("User deleted successfully");

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
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserById).toHaveBeenCalledTimes(0);
      expect(deleteUser).toHaveBeenCalledTimes(0);
    });

    test("deleteUserById should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const deleteUser = vi.spyOn(userRepository, "deleteUser");

      await expect(
        userService.deleteUserById(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);

      expect(deleteUser).toHaveBeenCalledTimes(0);
    });
  });

  describe("Find users by search", async () => {
    test("searchUserByFields should return the correct result with username", async () => {
      const searchUsersByQuery = vi.spyOn(userRepository, "searchUsersByQuery");
      
      const result = await userService.searchUserByFields(existingUser.username);
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      
      expect(searchUsersByQuery).toHaveBeenCalledWith(existingUser.username);
      expect(searchUsersByQuery).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should return the correct result with first name", async () => {
      const searchUsersByQuery = vi.spyOn(userRepository, "searchUsersByQuery");

      const result = await userService.searchUserByFields(existingUser.first_name!);
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(searchUsersByQuery).toHaveBeenCalledWith(existingUser.first_name);
      expect(searchUsersByQuery).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should return the correct result with last name", async () => {
      const searchUsersByQuery = vi.spyOn(userRepository, "searchUsersByQuery");

      const result = await userService.searchUserByFields(existingUser.last_name!);
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(searchUsersByQuery).toHaveBeenCalledWith(existingUser.last_name);
      expect(searchUsersByQuery).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should return the correct result with first and last name", async () => {
      const searchUsersByQuery = vi.spyOn(userRepository, "searchUsersByQuery");
      const result = await userService
        .searchUserByFields(`${existingUser.first_name} ${existingUser.last_name}`);

      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(searchUsersByQuery)
        .toHaveBeenCalledWith(`${existingUser.first_name} ${existingUser.last_name}`);
      expect(searchUsersByQuery).toHaveBeenCalledTimes(1);
    });

    test("searchUserByFields should throw an error when no args are provided", async () => {
      const searchUsersByQuery = vi.spyOn(userRepository, "searchUsersByQuery");

      await expect(
        userService.searchUserByFields(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(searchUsersByQuery).toHaveBeenCalledTimes(0);
    });
  });

  describe("Get all the recent searches", async () => {
    test("getAllRecentSearches should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getRecentSearches = vi.spyOn(recentSearchRepository, "getRecentSearches");
      const expectedResult = recentSearches.filter(
        (r) => r.user_id === existingUser.user_id
      );

      const result = await userService.getAllRecentSearches(existingUser.user_id);
      expect(result).toStrictEqual(expectedResult);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(expectedResult.length);
      
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
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserById).toHaveBeenCalledTimes(0);
      expect(getRecentSearches).toHaveBeenCalledTimes(0);
    });

    test("getAllRecentSearches should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getRecentSearches = vi.spyOn(recentSearchRepository, "getRecentSearches");

      await expect(
        userService.getAllRecentSearches(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);
      expect(getRecentSearches).toHaveBeenCalledTimes(0);
    });
  });

  describe("Save the recent searches", () => {
    test("saveRecentSearches should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const saveRecentSearches = vi.spyOn(recentSearchRepository, "saveRecentSearches");
      
      const result = await userService
        .saveRecentSearches(existingUser.user_id, newSearch.user_id);
        
      expect(result).toBe("Search user saved successfully");
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

      const result = await userService
        .saveRecentSearches(existingSearch?.user_id, existingSearch?.search_user_id);
      
      expect(result).toBe("Search user already saved");
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
      ).rejects.toThrow(noArgsMsgError);

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
      ).rejects.toThrow(userNotFoundMsgError);

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
      ).rejects.toThrow(userSearchNotFoundError);

      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(2);

      expect(saveRecentSearches).toHaveBeenCalledTimes(0);
    });
  });

  describe("Remove the recent searches", () => {
    test("removeRecentSearches should return the correct result", async () => {
      const findUsersSearchByRecentId = vi.spyOn(recentSearchRepository, "findUsersSearchByRecentId");
      const deleteRecentSearches = vi.spyOn(recentSearchRepository, "deleteRecentSearches");

      const result = await userService.removeRecentSearches(existingSearch.recent_id);
      expect(result).toBe("Search user deleted successfully");

      expect(findUsersSearchByRecentId).toHaveBeenCalledWith(existingSearch.recent_id);
      expect(findUsersSearchByRecentId).toHaveBeenCalledTimes(1);

      expect(deleteRecentSearches).toHaveBeenCalledWith(existingSearch.recent_id);
      expect(deleteRecentSearches).toHaveBeenCalledTimes(1);
    });

    test("removeRecentSearches should throw an error when no args are provided", async () => {
      const findUsersSearchByRecentId = vi.spyOn(recentSearchRepository, "findUsersSearchByRecentId");
      const deleteRecentSearches = vi.spyOn(recentSearchRepository, "deleteRecentSearches");

      await expect(
        userService.removeRecentSearches(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(findUsersSearchByRecentId).toHaveBeenCalledTimes(0);
      expect(deleteRecentSearches).toHaveBeenCalledTimes(0);
    });

    test("removeRecentSearches should throw an error when search user is not found", async () => {
      const findUsersSearchByRecentId = vi.spyOn(recentSearchRepository, "findUsersSearchByRecentId");
      const deleteRecentSearches = vi.spyOn(recentSearchRepository, "deleteRecentSearches");

      await expect(
        userService.removeRecentSearches(notFoundSearch.recent_id)
      ).rejects.toThrow(recentSearchNotFoundError);

      expect(findUsersSearchByRecentId).toHaveBeenCalledWith(notFoundSearch.recent_id);
      expect(findUsersSearchByRecentId).toHaveBeenCalledTimes(1);
      expect(deleteRecentSearches).toHaveBeenCalledTimes(0);
    });
  });
  
  describe("Get the number of followers and following", () => {

    test("getFollowStats should return the correct result", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getFollowStats = vi.spyOn(followRepository, "getFollowStats");
      
      const result = await userService.getFollowStats(existingUser.user_id);
      expect(result).toStrictEqual({ followers: 1, following: 1 });
      
      expect(findUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);
      
      expect(getFollowStats).toHaveBeenCalledWith(existingUser.user_id);
      expect(getFollowStats).toHaveBeenCalledTimes(1);
    });

    test("getFollowStats should throw an error when no args are provided", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getFollowStats = vi.spyOn(followRepository, "getFollowStats");

      await expect(
        userService.getFollowStats(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(findUserById).toHaveBeenCalledTimes(0);
      expect(getFollowStats).toHaveBeenCalledTimes(0);
    });

    test("getFollowStats should throw an error when user is not found", async () => {
      const findUserById = vi.spyOn(userRepository, "findUserById");
      const getFollowStats = vi.spyOn(followRepository, "getFollowStats");

      await expect(
        userService.getFollowStats(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(findUserById).toHaveBeenCalledTimes(1);
      expect(getFollowStats).toHaveBeenCalledTimes(0);
    });
  });
});