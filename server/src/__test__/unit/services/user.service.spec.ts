import UserService                                           from "@/services/user/user.service.impl";
import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import { UpdateUsers }                                       from "@/types/table.types";
import FollowRepository                                      from "@/repositories/follow/follow.repository.impl";
import RecentSearchesRepository                              from "@/repositories/recent-search/recent-search.repository.impl";
import { createUserList, createUser }                        from "@/__mock__/user/user.mock";
import { createRecentSearch, createSearchList }              from "@/__mock__/recent-search/search.mock";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let users = createUserList(5);
const notFoundUser = createUser();
const existingUser = users[0] || createUser();

let recentSearches = createSearchList(5);
const notFoundSearch = createRecentSearch();
const existingSearch = recentSearches[0] || createRecentSearch();

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
        const index = users.findIndex((u) => u.user_id === id);
        if (index === -1) throw ErrorException.badRequest("User not found");
        users.splice(index, 1);
        return "User deleted successfully";
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

vi.mock("@/repositories/recent search/recent-search.repository.impl", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/repositories/recent-search/recent-search.repository.impl")>();
  return {
    ...original,
    default: vi.fn().mockImplementation(() => ({

    }))
  };
});

describe('UserService', () => {
  let userService: UserService;
  let noArgsMsg: any;
  let notFoundMsg: any;

  beforeEach(() => {
    userService = new UserService(
      new UserRepository(),
      new FollowRepository(),
      new RecentSearchesRepository()
    );
    
    noArgsMsg = ErrorException.badRequest("No arguments provided");
    notFoundMsg = ErrorException.badRequest("User not found");
  });
  

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Get user's data by id", () => {
    const cases = [
      { args: existingUser.user_id, expected: existingUser, },
      { args: undefined, expected: noArgsMsg, },
      { args: notFoundUser.user_id, expected: notFoundMsg, },
    ];

    test.each(cases)(
      "getUserById should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "getUserById");
        mockMethod.mockResolvedValue(expected);

        const result = await userService.getUserById(args as any);

        expect(result).toBe(expected);
        expect(mockMethod).toHaveBeenCalledWith(args);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("Get user's data by username", () => {
    const cases = [
      { args: existingUser.username, expected: existingUser },
      { args: undefined, expected: noArgsMsg },
      { args: notFoundUser.username, expected: notFoundMsg },
    ];

    test.each(cases)(
      "getUserByUsername should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "getUserByUsername");
        mockMethod.mockResolvedValue(expected);

        const result = await userService.getUserByUsername(args as any);

        expect(result).toBe(expected);
        expect(mockMethod).toHaveBeenCalledWith(args);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("Get user data by email", async () => {
    const cases = [
      { args: existingUser.email, expected: existingUser },
      { args: notFoundUser.email, expected: notFoundMsg },
      { args: undefined, expected: noArgsMsg },
    ];

    test.each(cases)(
      "getUserByEmail should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "getUserByEmail");
        mockMethod.mockResolvedValue(expected);

        const result = await userService.getUserByEmail(args as any);

        expect(result).toBe(expected);
        expect(mockMethod).toHaveBeenCalledWith(args);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("Update user's data", async () => {
    const cases = [
      {
        args: [
          existingUser.user_id, 
          existingUser
        ] as [number, UpdateUsers],
        expected: existingUser,
      },
      {
        args: [
          notFoundUser.user_id, 
          notFoundUser
        ] as [number, UpdateUsers],
        expected: notFoundMsg,
      },
      {
        args: [
          undefined, 
          existingUser
        ] as [any, UpdateUsers],
        expected: noArgsMsg,
      },
    ];

    test.each(cases)(
      "updateUser should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "updateUser");
        mockMethod.mockResolvedValue(expected);

        const result = await userService.updateUser(args[0], args[1]);

        expect(result).toBe(expected);
        expect(mockMethod).toHaveBeenCalledWith(args[0], args[1]);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("Delete user's data", async () => {
    const cases = [
      { args: existingUser.user_id, expected: "User deleted successfully" },
      { args: notFoundUser.user_id, expected: notFoundMsg },
      { args: undefined, expected: noArgsMsg },
    ];

    test.each(cases)(
      "deleteUserById should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "deleteUserById");
        mockMethod.mockResolvedValue(expected);

        const result = await userService.deleteUserById(args as any);

        expect(result).toBe(expected);
        expect(mockMethod).toHaveBeenCalledWith(args);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("Find users by search", async () => {
    const cases = [
      { args: existingUser.username, expected: existingUser },
      { args: notFoundUser.username, expected: notFoundMsg },
      { args: undefined, expected: noArgsMsg },
    ];

    test.each(cases)(
      "searchUserByFields should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "searchUserByFields");
        mockMethod.mockResolvedValue(expect.objectContaining(expected));

        const result = await userService.searchUserByFields(args as any);

        expect(result).toStrictEqual(expect.objectContaining(expected));
        expect(mockMethod).toHaveBeenCalledWith(args);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("Get all the recent searches", async () => {
    const cases = [
      { args: existingSearch.user_id, expected: recentSearches },
      { args: notFoundSearch.user_id, expected: notFoundMsg },
      { args: undefined, expected: noArgsMsg },
    ];

    test.each(cases)(
      "getAllRecentSearches should return the correct result and error message",
      async ({ args, expected }) => {
        const mockMethod = vi.spyOn(userService, "getAllRecentSearches");
        mockMethod.mockResolvedValue(expected);

        const result = await userService.getAllRecentSearches(args as any);

        expect(result).toBe(expected);
        expect(mockMethod).toHaveBeenCalledWith(args);
        expect(mockMethod).toHaveBeenCalledTimes(1);
      }
    );
  });
});