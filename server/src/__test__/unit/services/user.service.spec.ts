import UserService                                           from "@/services/user/user.service.impl";
import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import { SelectUsers }                                       from "@/types/table.types";
import { createUser, createUserList }                        from "@/__mock__/data/user.mock";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Create a mock of the user service
let users: SelectUsers[] = createUserList(10);
const notFoundUser = createUser();
const existingUser = users[0]!;

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

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;

  let noArgsMsgError:       ErrorException = ErrorException.badRequest("No arguments provided");
  let userNotFoundMsgError: ErrorException = ErrorException.badRequest("User not found");

  beforeEach(() => {
    userRepository = new UserRepository();
    userService = new UserService(userRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getUserById (Get user's data by id)", () => {
    test("should return the correct result", async () => {
      const result = await userService.getUserById(existingUser.user_id);
      expect(result).toBe(existingUser);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(userService.getUserById(undefined as any)).rejects.toThrow(
        noArgsMsgError
      );
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        userService.getUserById(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });

  describe("getUserByUsername (Get user's data by username)", () => {
    test("should return the correct result", async () => {
      const result = await userService.getUserByUsername(existingUser.username);
      expect(result).toBe(existingUser);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.getUserByUsername(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        userService.getUserByUsername(notFoundUser.username)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });

  describe("getUserByEmail (Get user data by email)", () => {
    test("should return the correct result", async () => {
      const result = await userService.getUserByEmail(existingUser.email);
      expect(result).toBe(existingUser);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.getUserByEmail(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        userService.getUserByEmail(notFoundUser.email)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });

  describe("updateUser (Update user's data)", () => {
    test("should return the correct result", async () => {
      const result = await userService.updateUser(
        existingUser.user_id,
        existingUser
      );
      expect(result).toStrictEqual(existingUser);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.updateUser(undefined as any, existingUser)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        userService.updateUser(notFoundUser.user_id, notFoundUser)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });

  describe("deleteUserById (Delete user's data)", () => {
    test("should return the correct result", async () => {
      const result = await userService.deleteUserById(existingUser.user_id);
      expect(result).toBe("User deleted successfully");
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.deleteUserById(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });

    test("should throw an error when user is not found", async () => {
      await expect(
        userService.deleteUserById(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);
    });
  });

  describe("searchUserByFields (Find users by search)", () => {
    test("should return the correct result with username", async () => {
      const result = await userService.searchUserByFields(
        existingUser.username
      );
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    test("should return the correct result with first name", async () => {
      const result = await userService.searchUserByFields(
        existingUser.first_name!
      );
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    test("should return the correct result with last name", async () => {
      const result = await userService.searchUserByFields(
        existingUser.last_name!
      );
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    test("should return the correct result with first and last name", async () => {
      const result = await userService.searchUserByFields(
        `${existingUser.first_name} ${existingUser.last_name}`
      );
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.searchUserByFields(undefined as any)
      ).rejects.toThrow(noArgsMsgError);
    });
  });
});