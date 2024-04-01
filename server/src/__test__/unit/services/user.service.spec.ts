import UserService                                           from "@/services/user/user.service.impl";
import ErrorException                                        from "@/exceptions/error.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import FollowRepository                                      from "@/repositories/follow/follow.repository.impl";
import RecentSearchesRepository                              from "@/repositories/recent-search/recent-search.repository.impl";
import { createUserList, createUser }                        from "@/__mock__/user/user.mock";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let users = createUserList(5);
const notFoundUser = createUser();
const existingUser = users[0] || createUser();

vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/repositories/user/user.repository.impl")>();
  return {
    ...original,
    default: vi.fn().mockImplementation(() => ({
      findUserById: vi.fn().mockImplementation((id:number) =>
        users.find((u) => u.user_id === id)
      ),
      findUserByUsername: vi.fn().mockImplementation((username: string) => 
        users.find((u) => u.username === username)
      ),
      findUserByEmail: vi.fn().mockImplementation((email: string) =>
        users.find((u) => u.email === email)
      ),
      updateUser: vi.fn().mockImplementation((id: number, user: any) => {
        const index = users.findIndex((u) => u.user_id === id);
        if (index === -1) throw ErrorException.badRequest("User not found");
        return users[index] = { ...users[index], ...user };
      }),
      deleteUser: vi.fn().mockImplementation((id: number) => {
        const index = users.findIndex((u) => u.user_id === id);
        if (index === -1) throw ErrorException.badRequest("User not found");
        users.splice(index, 1);
        return "User deleted successfully";
      }),
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
  
  beforeEach(() => {
    userService = new UserService(
      new UserRepository(),
      new FollowRepository(),
      new RecentSearchesRepository()
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Get user's data by id", () => {
    test("it should get the data", async () => {
      const mockGetUserById = vi.spyOn(userService, "getUserById");
      mockGetUserById.mockResolvedValue(existingUser);

      const result = await userService.getUserById(existingUser.user_id);

      expect(result).toBe(existingUser);
      expect(mockGetUserById).toHaveBeenCalledWith(existingUser.user_id);
      expect(mockGetUserById).toHaveBeenCalledTimes(1);
    });

    test("it should throw error 'no parameters provided'", async () => {
      const arg: any = undefined;
      const mockGetUserById = vi.spyOn(userService, "getUserById");

      await expect(userService.getUserById(arg)).rejects.toThrow(
        "No parameters provided"
      );

      expect(mockGetUserById).toHaveBeenCalledWith(arg);
      expect(mockGetUserById).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'user not found'", async () => {
      const mockGetUserById = vi.spyOn(userService, "getUserById");
      mockGetUserById.mockRejectedValue(
        ErrorException.badRequest("User not found")
      );

      await expect(
        userService.getUserById(notFoundUser.user_id)
      ).rejects.toThrow("User not found");

      expect(mockGetUserById).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(mockGetUserById).toHaveBeenCalledTimes(1);
    });
  });
  
  describe("Get user's data by username", () => {
    test("it should get user's data", async () => {
      const mockGetUserByUsername = vi.spyOn(userService, "getUserByUsername");
      mockGetUserByUsername.mockResolvedValue(existingUser);
      
      const result = await userService.getUserByUsername(existingUser.username);
      
      expect(result).toBe(existingUser);
      expect(mockGetUserByUsername).toHaveBeenCalledWith(existingUser.username);
      expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
    });

    test("it should throw error 'user not found'", async () => {
      const mockGetUserByUsername = vi.spyOn(userService, "getUserByUsername");
      mockGetUserByUsername.mockRejectedValue(
        ErrorException.badRequest("User not found")
      );

      await expect(
        userService.getUserByUsername(notFoundUser.username)
      ).rejects.toThrow("User not found");
        
      expect(mockGetUserByUsername).toHaveBeenCalledWith(notFoundUser.username);
      expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'no parameters provided'", async () => {
      const arg: any = undefined;
      const mockGetUserByUsername = vi.spyOn(userService, "getUserByUsername");
      mockGetUserByUsername.mockRejectedValue(
        ErrorException.badRequest("No parameters provided")
      );
      
      await expect(
        userService.getUserByUsername(arg)
      ).rejects.toThrow("No parameters provided");

      expect(mockGetUserByUsername).toHaveBeenCalledWith(arg);
      expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get user data by email", async () => {
    test("it should get user's data", async () => {
      const mockGetUserByEmail = vi.spyOn(userService, "getUserByEmail");
      mockGetUserByEmail.mockResolvedValue(existingUser);
      
      const result = await userService.getUserByEmail(existingUser.email);
      
      expect(result).toBe(existingUser);
      expect(mockGetUserByEmail).toHaveBeenCalledWith(existingUser.email);
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
    });

    test("it should throw error 'user not found'", async () => {
      const mockGetUserByEmail = vi.spyOn(userService, "getUserByEmail");
      mockGetUserByEmail.mockRejectedValue(
        ErrorException.badRequest("User not found")
      );

      await expect(
        userService.getUserByEmail(notFoundUser.email)
      ).rejects.toThrow("User not found");
        
      expect(mockGetUserByEmail).toHaveBeenCalledWith(notFoundUser.email);
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'no parameters provided'", async () => {
      const arg: any = undefined;
      const mockGetUserByEmail = vi.spyOn(userService, "getUserByEmail");
      mockGetUserByEmail.mockRejectedValue(
        ErrorException.badRequest("No parameters provided")
      );

      await expect(
        userService.getUserByEmail(arg)
      ).rejects.toThrow("No parameters provided");

      expect(mockGetUserByEmail).toHaveBeenCalledWith(arg);
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update user's data", async () => {
    test("it should update user's data", async () => {
      const mockUpdateUser = vi.spyOn(userService, "updateUser");
      mockUpdateUser.mockResolvedValue(existingUser);

      const result = await userService.updateUser(existingUser.user_id, existingUser);

      expect(result).toBe(existingUser);
      expect(mockUpdateUser).toHaveBeenCalledWith(existingUser.user_id, existingUser);
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'user not found'", async () => {
      const mockUpdateUser = vi.spyOn(userService, "updateUser");
      mockUpdateUser.mockRejectedValue(
        ErrorException.badRequest("User not found")
      );

      await expect(
        userService.updateUser(notFoundUser.user_id, notFoundUser)
      ).rejects.toThrow("User not found");

      expect(mockUpdateUser).toHaveBeenCalledWith(notFoundUser.user_id, notFoundUser);
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'no parameters provided'", async () => {
      const arg: any = undefined;
      const mockUpdateUser = vi.spyOn(userService, "updateUser");
      mockUpdateUser.mockRejectedValue(
        ErrorException.badRequest("No parameters provided")
      );

      await expect(
        userService.updateUser(arg, existingUser)
      ).rejects.toThrow("No parameters provided");

      expect(mockUpdateUser).toHaveBeenCalledWith(arg, existingUser);
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("Delete user's data", async () => {
    test("it should delete user", async () => {
      const mockDeleteUser = vi.spyOn(userService, "deleteUserById");
      mockDeleteUser.mockResolvedValue("User deleted successfully");

      const result = await userService.deleteUserById(existingUser.user_id);

      expect(result).toBe("User deleted successfully");
      expect(mockDeleteUser).toHaveBeenCalledWith(existingUser.user_id);
      expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'user not found'", async () => {
      const mockDeleteUser = vi.spyOn(userService, "deleteUserById");
      mockDeleteUser.mockRejectedValue(
        ErrorException.badRequest("User not found")
      );

      await expect(
        userService.deleteUserById(notFoundUser.user_id)
      ).rejects.toThrow("User not found");

      expect(mockDeleteUser).toHaveBeenCalledWith(notFoundUser.user_id);
      expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    });

    test("it should throw 'no parameters provided'", async () => {
      const arg: any = undefined;
      const mockDeleteUser = vi.spyOn(userService, "deleteUserById");
      mockDeleteUser.mockRejectedValue(
        ErrorException.badRequest("No parameters provided")
      );

      await expect(
        userService.deleteUserById(arg)
      ).rejects.toThrow("No parameters provided");

      expect(mockDeleteUser).toHaveBeenCalledWith(arg);
      expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    });
  });
});