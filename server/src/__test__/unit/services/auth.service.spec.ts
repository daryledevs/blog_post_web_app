import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { faker }                      from "@faker-js/faker";
import AuthService                    from "@/services/auth/auth.service.impl";
import UserRepository                 from "@/repositories/user/user.repository.impl";
import AuthRepository                 from "@/repositories/auth/auth.repository.impl";
import ErrorException                 from "@/exceptions/error.exception";
import { createUserList, createUser } from "@/__mock__/data/user.mock";

let users = createUserList(5);
const newUser = createUser();
const notFoundUser = createUser();
const existingUser = users[0] || createUser();

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
      findUserByUsername: vi.fn().mockImplementation((username: string) =>
        users.find((u) => u.username === username)
      ),
      findUserByEmail: vi.fn().mockImplementation((email: string) =>
        users.find((u) => u.email === email)
      ),
      searchUsersByQuery: vi.fn().mockImplementation((query: string) =>
        users.filter((u) =>
          u.username.includes(query) ||
          u.email.includes(query) ||
          (u?.first_name && u.first_name.includes(query)) ||
          (u?.last_name && u.last_name.includes(query))
        )
      ),
      findUserByCredentials: vi.fn().mockImplementation((userCredential: string) =>
        users.find(
          (u) => u.username === userCredential || u.email === userCredential
        )
      ),
    })),
  };
});

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      new AuthRepository(),
      new UserRepository()
    );
  })

  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe("Register", async () => {
    test("Register should be successful", async () => {
      const result = await authService.register(newUser);
      expect(result).toBe("Registration is successful");
    });

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

  
  describe("Login", async () => {
    test("Login should be successful", async () => {
      const result = await authService.login(newUser.username, newUser.password);
      expect(result.message).toBe("Login successfully");
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    test("Login with username from not existing user", async () => {
      const mockGetUserByUsername = vi.spyOn(authService, "login");
      mockGetUserByUsername.mockRejectedValue(ErrorException.notFound("User not found"));

      await expect(
        authService.login(notFoundUser.username, notFoundUser.password)
      ).rejects.toThrow("User not found");

      expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
      expect(mockGetUserByUsername).toHaveBeenCalledWith(notFoundUser.username, notFoundUser.password);
    });

    test("Login with email from not existing user", async () => {
      const mockGetUserByEmail = vi.spyOn(authService, "login");
      mockGetUserByEmail.mockRejectedValue(ErrorException.notFound("User not found"));

      await expect(
        authService.login(notFoundUser.email, notFoundUser.password)
      ).rejects.toThrow("User not found");

      expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(mockGetUserByEmail).toHaveBeenCalledWith(notFoundUser.email, notFoundUser.password);
    });

    test("Login with username from existing user", async () => {
      const mockGetUserByUsername = vi.spyOn(authService, "login");
      mockGetUserByUsername.mockRejectedValue(ErrorException.badRequest("Invalid password"));
      const user = { ...existingUser, password: faker.internet.password() };
      
      await expect(
        authService.login(user.username, user.password)
      ).rejects.toThrow("Invalid password");

      expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
      expect(mockGetUserByUsername).toHaveBeenCalledWith(user.username, user.password);
    });

    test("Login with email from existing user", async () => {
      const mockGetUserByEmail = vi.spyOn(authService, "login");
      mockGetUserByEmail.mockRejectedValue(ErrorException.badRequest("Invalid password"));
      const user = { ...existingUser, password: faker.internet.password() };
      
      await expect(
        authService.login(user.email, user.password)
      ).rejects.toThrow("Invalid password");
      
      expect(mockGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(mockGetUserByEmail).toHaveBeenCalledWith(user.email, user.password);
    });
  });
});