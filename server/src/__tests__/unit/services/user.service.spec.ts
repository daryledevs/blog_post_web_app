import UserService                                           from "@/application/services/user/user.service.impl";
import IEUserService                                         from "@/application/services/user/user.service";
import UserRepository                                        from "@/infrastructure/repositories/user.repository.impl";
import { SelectUsers }                                       from "@/domain/types/table.types";
import IEUserRepository                                      from "@/infrastructure/repositories/user.repository.impl";
import GenerateMockData                                      from "@/__tests__/utils/generate-data.util";
import ApiErrorException                                     from "@/application/exceptions/api.exception";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/user/user.repository.impl");

describe("UserService", () => {
  let userService:    IEUserService;
  let userRepository: IEUserRepository;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
  };

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

      const result = await userService.getUserById(existingUser.uuid);

      expect(result).toBe(existingUser);
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();

      await expect(
        userService.getUserById(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined)

      await expect(
        userService.getUserById(notFoundUser.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.uuid);
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
      userRepository.findUserByUsername = vi.fn();

      await expect(
        userService.getUserByUsername(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserByUsername).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserByUsername = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        userService.getUserByUsername(notFoundUser.username)
      ).rejects.toThrow(error.userNotFoundMsg);

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
      userRepository.findUserByEmail = vi.fn();

      await expect(
        userService.getUserByEmail(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserByEmail = vi
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        userService.getUserByEmail(notFoundUser.email)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserByEmail)
        .toHaveBeenCalledWith(notFoundUser.email);
    });
  });

  describe("updateUser (Update user's data)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      userRepository.updateUserById = vi.fn().mockResolvedValue(existingUser);
      
      const result = await userService.updateUserById(
        existingUser.uuid,
        existingUser
      );

      expect(result).toStrictEqual(existingUser);
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      userRepository.updateUserById = vi.fn();

      await expect(
        userService.updateUserById(undefined as any, existingUser)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(userRepository.updateUserById).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);
      
      userRepository.updateUserById = vi.fn();

      await expect(
        userService.updateUserById(notFoundUser.uuid, notFoundUser)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.uuid);

      expect(userRepository.updateUserById).not.toHaveBeenCalled();
    });
  });

  describe("deleteUserById (Delete user's data)", () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      userRepository.deleteUserById = vi.fn();

      const result = await userService.deleteUserById(existingUser.uuid);

      expect(result).toBe("User deleted successfully");
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUser.uuid);

      expect(userRepository.deleteUserById)
        .toHaveBeenCalledWith(existingUser.uuid);
    });

    test("should throw an error when no args are provided", async () => {
      userRepository.findUserById = vi.fn();
      userRepository.deleteUserById = vi.fn();

      await expect(
        userService.deleteUserById(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(userRepository.deleteUserById).not.toHaveBeenCalled();
    });

    test("should throw an error when user is not found", async () => {
      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(undefined);

      userRepository.deleteUserById = vi.fn();

      await expect(
        userService.deleteUserById(notFoundUser.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(notFoundUser.uuid);

      expect(userRepository.deleteUserById).not.toHaveBeenCalled();
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
      userRepository.searchUsersByQuery = vi.fn();

      await expect(
        userService.searchUserByFields(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.searchUsersByQuery).not.toHaveBeenCalled();
    });
  });
});