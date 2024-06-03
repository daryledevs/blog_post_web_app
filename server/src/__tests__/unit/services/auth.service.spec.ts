import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import bcrypt            from "bcrypt";
import { faker }         from "@faker-js/faker";
import AuthService       from "@/services/auth/auth.service.impl";
import UserRepository    from "@/repositories/user/user.repository.impl";
import AuthRepository    from "@/repositories/auth/auth.repository.impl";
import GenerateMockData  from "../../utils/generate-data.util";
import ApiErrorException from "@/exceptions/api.exception";

vi.mock("@/repositories/auth/auth.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

describe("AuthService", () => {
  // Mocking the repositories
  let userRepository: UserRepository;
  let authRepository: AuthRepository;
  let authService: AuthService;

  // Mocking the data
  let users = GenerateMockData.createUserList(5);
  const newUser = GenerateMockData.createUser();
  const notFoundUser = GenerateMockData.createUser();
  const existingUser = users[0]!;

  // Error messages
  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
    invalidEmailMsg: ApiErrorException.HTTP400Error("Email already exists"),
    invalidPasswordMsg: ApiErrorException.HTTP400Error("Invalid password"),
    invalidUsernameMsg: ApiErrorException.HTTP400Error(
      "Username already exists"
    ),
    invalidPasswordLengthMsg: ApiErrorException.HTTP400Error(
      "Password must be at least 6 characters"
    ),
  };

  beforeEach(() => {
    userRepository = new UserRepository();
    authRepository = new AuthRepository();

    authService = new AuthService(
      authRepository,
      userRepository
    );
  })

  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe("Register (Create a new user)", async () => {
    test("Register should be successful", async () => {
      const expectedResult = {
        message: "Registration is successful",
        user: newUser,
      };

      userRepository.findUserByEmail = vi
        .fn()
        .mockResolvedValue(null);

      userRepository.findUserByUsername = vi
        .fn()
        .mockResolvedValue(null);

      authRepository.createUser = vi
        .fn()
        .mockResolvedValue(newUser);
        
      const result = await authService.register(newUser);
      expect(result).toStrictEqual(expectedResult);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        newUser.email
      );

      expect(userRepository.findUserByUsername).toHaveBeenCalledWith(
        newUser.username
      );

      expect(authRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newUser,
          password: expect.any(String),
        })
      );
    });

    test("should throw an error when no args are provided", async () => {
      const user = { ...newUser, username: "", email: "", password: "" };

      userRepository.findUserByEmail = vi.fn();
      userRepository.findUserByUsername = vi.fn();
      authRepository.createUser = vi.fn();

      await expect(
        authService.register(user)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
      expect(userRepository.findUserByUsername).not.toHaveBeenCalled();
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    test("should throw an error when password less than 6 characters", async () => {
      const user = { ...newUser, password: "12345" };

      userRepository.findUserByEmail = vi.fn();
      userRepository.findUserByUsername = vi.fn();
      authRepository.createUser = vi.fn();

      await expect(
        authService.register(user)
      ).rejects.toThrow(error.invalidPasswordLengthMsg);

      expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
      expect(userRepository.findUserByUsername).not.toHaveBeenCalled();
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    test("should throw an error using an existing username", async () => {
      const user = { ...existingUser, email: faker.internet.email() };

      userRepository.findUserByEmail = vi.fn().mockResolvedValue(null);
      userRepository.findUserByUsername = vi.fn().mockResolvedValue(existingUser);
      authRepository.createUser = vi.fn();

      await expect(
        authService.register(user)
      ).rejects.toThrow(error.invalidUsernameMsg);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
      expect(userRepository.findUserByUsername).toHaveBeenCalledWith(user.username);
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    test("Register with existing email", async () => {
      userRepository.findUserByEmail = vi.fn().mockResolvedValue(existingUser);
      userRepository.findUserByUsername = vi.fn();
      authRepository.createUser = vi.fn();

      const user = { ...existingUser, username: faker.internet.userName() };
      await expect(
        authService.register(user)
      ).rejects.toThrow(error.invalidEmailMsg);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
      expect(userRepository.findUserByUsername).not.toHaveBeenCalled();
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });
  });

  
  describe("Login", async () => {
    test("Login should be successful", async () => {
      const hashedPassword = bcrypt.hashSync(existingUser.password, bcrypt.genSaltSync(10))
      const user = { ...existingUser, password: hashedPassword };

      userRepository.findUserByCredentials = vi.fn().mockResolvedValue(user);

      const result = await authService.login(
        existingUser.username,
        existingUser.password
      );
      
      expect(result.message).toBe("Login successfully");
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    test("should throw an error when username is not existing", async () => {
      userRepository.findUserByCredentials = vi
        .fn()
        .mockResolvedValue(null);

      await expect(
        authService.login(notFoundUser.username, notFoundUser.password)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(
        notFoundUser.username
      );
    });

    test("should throw an error when email is not existing", async () => {
      userRepository.findUserByCredentials = vi
        .fn()
        .mockResolvedValue(null);

      await expect(
        authService.login(notFoundUser.email, notFoundUser.password)
      ).rejects.toThrow("User not found");

      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(
        notFoundUser.email
      );
    });

    test("should throw an error when logging in with username and password is invalid", async () => {
      const user = { ...existingUser, password: faker.internet.password() };

      userRepository.findUserByCredentials = vi
        .fn()
        .mockResolvedValue(user); 
      
      await expect(
        authService.login(user.username, user.password)
      ).rejects.toThrow(error.invalidPasswordMsg);

      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(
        user.username
      );
    });

    test("should throw an error when logging in with email and password is invalid", async () => {
      const user = { ...existingUser, password: faker.internet.password() };

      userRepository.findUserByCredentials = vi.fn().mockResolvedValue(user); 

      await expect(
        authService.login(user.email, user.password)
      ).rejects.toThrow(error.invalidPasswordMsg);

      expect(userRepository.findUserByCredentials).toHaveBeenCalledWith(
        user.email
      );
    });
  });
});