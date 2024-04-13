import UserService                                           from "@/services/user/user.service.impl";
import ErrorException                                        from "@/exceptions/api.exception";
import UserRepository                                        from "@/repositories/user/user.repository.impl";
import { SelectUsers }                                       from "@/types/table.types";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import GenerateMockData from "../../utils/generate-data.util";

vi.mock("@/repositories/user/user.repository.impl");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const noArgsMsgError: ErrorException = 
    ErrorException.HTTP400Error("No arguments provided");

  const userNotFoundMsgError: ErrorException =
    ErrorException.HTTP400Error("User not found");

  // Create a mock of the user service
  let users: SelectUsers[] = GenerateMockData.createUserList(10);
  const notFoundUser = GenerateMockData.createUser();
  const existingUser = users[0]!;

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
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      const result = await userService.getUserById(existingUser.user_id);

      expect(result).toBe(existingUser);
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.getUserById(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById)
        .not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined)

      await expect(
        userService.getUserById(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.user_id);
    });
  });

  describe("getUserByUsername (Get user's data by username)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserByUsername = vi
        .fn()
        .mockResolvedValue(existingUser);
        
      const result = await userService.getUserByUsername(existingUser.username);

      expect(result).toBe(existingUser);
      expect(userRepository.findUserByUsername)
        .toHaveBeenCalledWith(existingUser.username);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.getUserByUsername(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserByUsername).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserByUsername = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        userService.getUserByUsername(notFoundUser.username)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserByUsername)
        .toHaveBeenCalledWith(notFoundUser.username);
    });
  });

  describe("getUserByEmail (Get user data by email)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserByEmail = vi.fn().mockResolvedValue(existingUser);

      const result = await userService.getUserByEmail(existingUser.email);
      
      expect(result).toBe(existingUser);
      expect(userRepository.findUserByEmail)
        .toHaveBeenCalledWith(existingUser.email);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.getUserByEmail(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserByEmail = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        userService.getUserByEmail(notFoundUser.email)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserByEmail)
        .toHaveBeenCalledWith(notFoundUser.email);
    });
  });

  describe("updateUser (Update user's data)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      userRepository.updateUser = vi.fn().mockResolvedValue(existingUser);
      
      const result = await userService.updateUser(
        existingUser.user_id,
        existingUser
      );

      expect(result).toStrictEqual(existingUser);
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.updateUser(undefined as any, existingUser)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(userRepository.updateUser).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        userService.updateUser(notFoundUser.user_id, notFoundUser)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.user_id);

      expect(userRepository.updateUser).not.toHaveBeenCalled();
    });
  });

  describe("deleteUserById (Delete user's data)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      userRepository.deleteUser = vi.fn();

      const result = await userService.deleteUserById(existingUser.user_id);

      expect(result).toBe("User deleted successfully");
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.user_id);

      expect(userRepository.deleteUser)
        .toHaveBeenCalledWith(existingUser.user_id);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.deleteUserById(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(userRepository.deleteUser).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        userService.deleteUserById(notFoundUser.user_id)
      ).rejects.toThrow(userNotFoundMsgError);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.user_id);

      expect(userRepository.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe("searchUserByFields (Find users by search)", () => {
    test("should return the correct result with username", async () => {
      userRepository.searchUsersByQuery = vi
        .fn()
        .mockResolvedValue([existingUser]);

      const result = await userService
        .searchUserByFields(existingUser.username);

      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(userRepository.searchUsersByQuery)
        .toHaveBeenCalledWith(existingUser.username);

      expect(userRepository.searchUsersByQuery).toHaveBeenCalled();
    });

    test("should return the correct result with first name", async () => {
      userRepository.searchUsersByQuery = vi
        .fn()
        .mockResolvedValue([existingUser]);

      const result = await userService
        .searchUserByFields(existingUser.first_name!);

      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(userRepository.searchUsersByQuery)
        .toHaveBeenCalledWith(existingUser.first_name);
      
      expect(userRepository.searchUsersByQuery).toHaveBeenCalled();
    });

    test("should return the correct result with last name", async () => {
      userRepository.searchUsersByQuery = vi
        .fn()
        .mockResolvedValue([existingUser]);

      const result = await userService
        .searchUserByFields(existingUser.last_name!);

      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(userRepository.searchUsersByQuery)
        .toHaveBeenCalledWith(existingUser.last_name);
      
      expect(userRepository.searchUsersByQuery).toHaveBeenCalled();
    });

    test("should return the correct result with first and last name", async () => {
      userRepository.searchUsersByQuery = vi
        .fn()
        .mockResolvedValue([existingUser]);

      const result = await userService.searchUserByFields(
        `${existingUser.first_name} ${existingUser.last_name}`
      );
      
      expect(result).toStrictEqual([existingUser]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);

      expect(userRepository.searchUsersByQuery).toHaveBeenCalledWith(
        `${existingUser.first_name} ${existingUser.last_name}`
      );

      expect(userRepository.searchUsersByQuery).toHaveBeenCalled();
    });

    test("should return an empty array", async () => {
      userRepository.searchUsersByQuery = vi
        .fn()
        .mockResolvedValue([]);

      const result = await userService.searchUserByFields(notFoundUser.username);

      expect(result).toStrictEqual([]);
      expect(userRepository.searchUsersByQuery)
        .toHaveBeenCalledWith(notFoundUser.username);
    });

    test("should throw an error when no args are provided", async () => {
      await expect(
        userService.searchUserByFields(undefined as any)
      ).rejects.toThrow(noArgsMsgError);

      expect(userRepository.searchUsersByQuery).not.toHaveBeenCalled();
    });
  });
});