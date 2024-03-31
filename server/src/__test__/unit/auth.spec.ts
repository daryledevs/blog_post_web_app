import { faker }                                       from "@faker-js/faker";
import AuthService                                     from "@/service/auth/auth.service.impl";
import UserRepository                                  from "@/repository/user/user.repository.impl";
import AuthRepository                                  from "@/repository/auth/auth.repository.impl";
import { describe, test, expect, vi, Mock, beforeAll } from "vitest";

const mockUser = () => ({
  user_id: faker.number.int({ min: 1, max: 1000 }),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  roles: faker.string.fromCharacters(["admin", "user"]),
  age: faker.number.int({ min: 18, max: 99 }),
  avatar_url: faker.image.avatar(),
  birthday: faker.date.past().toISOString(),
});

let users = Array.from({ length: 5 }, mockUser);
const newUser = mockUser();
const notFoundUser = mockUser();
const existingUser = users[0] || mockUser();

beforeAll(() => {
  vi.mock("@/repository/auth/auth.repository.impl", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/repository/auth/auth.repository.impl")>();
    return {
      ...original,
      default: vi.fn().mockImplementation(() => ({
        createUser: vi.fn().mockImplementation((user) => users.push(user)),
      })),
    };
  });

  vi.mock("@/repository/user/user.repository.impl", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/repository/user/user.repository.impl")>();
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
                u.first_name.includes(query) ||
                u.last_name.includes(query)
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