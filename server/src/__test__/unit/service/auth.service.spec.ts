import { faker }                                       from "@faker-js/faker";
import AuthService                                     from "@/services/auth/auth.service.impl";
import UserRepository                                  from "@/repositories/user/user.repository.impl";
import AuthRepository                                  from "@/repositories/auth/auth.repository.impl";
import { describe, test, expect, vi, Mock, beforeAll } from "vitest";
import { createUserList, createUser } from "@/__mock__/user/user.mock";

let users = createUserList(5);
const newUser = createUser();
const notFoundUser = createUser();
const existingUser = users[0] || createUser();

beforeAll(() => {
  vi.mock("@/repositories/auth/auth.repository.impl", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/repositories/auth/auth.repository.impl")>();
    return {
      ...original,
      default: vi.fn().mockImplementation(() => ({
        createUser: vi.fn().mockImplementation((user) => users.push(user)),
      })),
    };
  });

  vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/repositories/user/user.repository.impl")>();
    return {
      ...original,
      default: vi.fn().mockImplementation(() => ({
        findUserById: vi.fn().mockImplementation((id: number) => {
          return users.find((u) => u.user_id === id);
        }),
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
        searchUsersByQuery: vi
          .fn()
          .mockImplementation((query: string) =>
            users.filter(
              (u) =>
                u.username.includes(query) ||
                u.email.includes(query) ||
                (u?.first_name && u.first_name.includes(query)) ||
                (u?.last_name && u.last_name.includes(query))
            )
          ),
        findUserByCredentials: vi
          .fn()
          .mockImplementation((userCredential: string) =>
            users.find(
              (u) => u.username === userCredential || u.email === userCredential
            )
          ),
      })),
    };
  });
});

afterAll(() => {
  vi.clearAllMocks();
});

describe("AuthService", () => {
  const authRepository = new AuthRepository();
  const userRepository = new UserRepository();
  const authService = new AuthService(authRepository, userRepository);
  
  test("Register should be successful", async () => {
    const result = await authService.register(newUser);
    expect(result).toBe("Registration is successful");

  });

  describe("Register should throw error", async () => {
    test("Register with empty fields", async () => {
      const user = { ...newUser, username: "", email: "", password: "" };
      await expect(authService.register(user)).rejects.toThrow("All fields are required");
    });

    test("Register with password less than 6 characters", async () => {
      const user = { ...newUser, password: "12345" };
      await expect(authService.register(user)).rejects.toThrow("Password must be at least 6 characters");
    });

    test("Register with existing username", async () => {
      const user = { ...existingUser, email: faker.internet.email() };
      await expect(authService.register(user)).rejects.toThrow("Username already exists");
    });

    test("Register with existing email", async () => {
      const user = { ...existingUser, username: faker.internet.userName() };
      await expect(authService.register(user)).rejects.toThrow("Email already exists");
    });
  });

  
  test("Login should be successful", async () => {
    const result = await authService.login(newUser.username, newUser.password);
    expect(result.message).toBe("Login successfully");
  });

  describe("Login should throw error", async () => {
    test("Login with either username and email from not existing user", async () => {
      await expect(
        authService.login(notFoundUser.username, notFoundUser.password)
      ).rejects.toThrow("User not found");

      await expect(
        authService.login(notFoundUser.email, notFoundUser.password)
      ).rejects.toThrow("User not found");

      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(notFoundUser.username);
      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(notFoundUser.email);
    });

    test("Login with either username or email from existing user", async () => {
      await expect(
        authService.login(existingUser.username, faker.internet.password())
      ).rejects.toThrow("Invalid password");

      await expect(
        authService.login(existingUser.email, faker.internet.password())
      ).rejects.toThrow("Invalid password");

      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(existingUser.username);
      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(existingUser.email);
    });
  });
});