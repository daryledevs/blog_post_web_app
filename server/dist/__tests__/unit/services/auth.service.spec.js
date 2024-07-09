"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcrypt_1 = __importDefault(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
const auth_service_impl_1 = __importDefault(require("@/application/services/auth/auth.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const auth_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/auth.repository.impl"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
vitest_1.vi.mock("@/repositories/auth/auth.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
(0, vitest_1.describe)("AuthService", () => {
    // Mocking the repositories
    let userRepository;
    let authRepository;
    let authService;
    // Mocking the data
    let users = generate_data_util_1.default.createUserList(5);
    const newUser = generate_data_util_1.default.createUser();
    const notFoundUser = generate_data_util_1.default.createUser();
    const existingUser = users[0];
    // Error messages
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
        invalidEmailMsg: api_exception_1.default.HTTP400Error("Email already exists"),
        invalidPasswordMsg: api_exception_1.default.HTTP400Error("Invalid password"),
        invalidUsernameMsg: api_exception_1.default.HTTP400Error("Username already exists"),
        invalidPasswordLengthMsg: api_exception_1.default.HTTP400Error("Password must be at least 6 characters"),
    };
    (0, vitest_1.beforeEach)(() => {
        userRepository = new user_repository_impl_1.default();
        authRepository = new auth_repository_impl_1.default();
        authService = new auth_service_impl_1.default(authRepository, userRepository);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("Register (Create a new user)", async () => {
        (0, vitest_1.test)("Register should be successful", async () => {
            const expectedResult = {
                message: "Registration is successful",
                user: newUser,
            };
            userRepository.findUserByEmail = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            userRepository.findUserByUsername = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            authRepository.createUser = vitest_1.vi
                .fn()
                .mockResolvedValue(newUser);
            const result = await authService.register(newUser);
            (0, vitest_1.expect)(result).toStrictEqual(expectedResult);
            (0, vitest_1.expect)(userRepository.findUserByEmail).toHaveBeenCalledWith(newUser.email);
            (0, vitest_1.expect)(userRepository.findUserByUsername).toHaveBeenCalledWith(newUser.username);
            (0, vitest_1.expect)(authRepository.createUser).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                ...newUser,
                password: vitest_1.expect.any(String),
            }));
        });
        (0, vitest_1.test)("should throw an error when no args are provided", async () => {
            const user = { ...newUser, username: "", email: "", password: "" };
            userRepository.findUserByEmail = vitest_1.vi.fn();
            userRepository.findUserByUsername = vitest_1.vi.fn();
            authRepository.createUser = vitest_1.vi.fn();
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserByEmail).not.toHaveBeenCalled();
            (0, vitest_1.expect)(userRepository.findUserByUsername).not.toHaveBeenCalled();
            (0, vitest_1.expect)(authRepository.createUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error when password less than 6 characters", async () => {
            const user = { ...newUser, password: "12345" };
            userRepository.findUserByEmail = vitest_1.vi.fn();
            userRepository.findUserByUsername = vitest_1.vi.fn();
            authRepository.createUser = vitest_1.vi.fn();
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow(error.invalidPasswordLengthMsg);
            (0, vitest_1.expect)(userRepository.findUserByEmail).not.toHaveBeenCalled();
            (0, vitest_1.expect)(userRepository.findUserByUsername).not.toHaveBeenCalled();
            (0, vitest_1.expect)(authRepository.createUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error using an existing username", async () => {
            const user = { ...existingUser, email: faker_1.faker.internet.email() };
            userRepository.findUserByEmail = vitest_1.vi.fn().mockResolvedValue(null);
            userRepository.findUserByUsername = vitest_1.vi.fn().mockResolvedValue(existingUser);
            authRepository.createUser = vitest_1.vi.fn();
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow(error.invalidUsernameMsg);
            (0, vitest_1.expect)(userRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
            (0, vitest_1.expect)(userRepository.findUserByUsername).toHaveBeenCalledWith(user.username);
            (0, vitest_1.expect)(authRepository.createUser).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("Register with existing email", async () => {
            userRepository.findUserByEmail = vitest_1.vi.fn().mockResolvedValue(existingUser);
            userRepository.findUserByUsername = vitest_1.vi.fn();
            authRepository.createUser = vitest_1.vi.fn();
            const user = { ...existingUser, username: faker_1.faker.internet.userName() };
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow(error.invalidEmailMsg);
            (0, vitest_1.expect)(userRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
            (0, vitest_1.expect)(userRepository.findUserByUsername).not.toHaveBeenCalled();
            (0, vitest_1.expect)(authRepository.createUser).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("Login", async () => {
        (0, vitest_1.test)("Login should be successful", async () => {
            const hashedPassword = bcrypt_1.default.hashSync(existingUser.password, bcrypt_1.default.genSaltSync(10));
            const user = { ...existingUser, password: hashedPassword };
            userRepository.findUserByCredentials = vitest_1.vi.fn().mockResolvedValue(user);
            const result = await authService.login(existingUser.username, existingUser.password);
            (0, vitest_1.expect)(result.message).toBe("Login successfully");
            (0, vitest_1.expect)(result.token).toBeDefined();
            (0, vitest_1.expect)(result.refreshToken).toBeDefined();
        });
        (0, vitest_1.test)("should throw an error when username is not existing", async () => {
            userRepository.findUserByCredentials = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            await (0, vitest_1.expect)(authService.login(notFoundUser.username, notFoundUser.password)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(notFoundUser.username);
        });
        (0, vitest_1.test)("should throw an error when email is not existing", async () => {
            userRepository.findUserByCredentials = vitest_1.vi
                .fn()
                .mockResolvedValue(null);
            await (0, vitest_1.expect)(authService.login(notFoundUser.email, notFoundUser.password)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(notFoundUser.email);
        });
        (0, vitest_1.test)("should throw an error when logging in with username and password is invalid", async () => {
            const user = { ...existingUser, password: faker_1.faker.internet.password() };
            userRepository.findUserByCredentials = vitest_1.vi
                .fn()
                .mockResolvedValue(user);
            await (0, vitest_1.expect)(authService.login(user.username, user.password)).rejects.toThrow(error.invalidPasswordMsg);
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(user.username);
        });
        (0, vitest_1.test)("should throw an error when logging in with email and password is invalid", async () => {
            const user = { ...existingUser, password: faker_1.faker.internet.password() };
            userRepository.findUserByCredentials = vitest_1.vi.fn().mockResolvedValue(user);
            await (0, vitest_1.expect)(authService.login(user.email, user.password)).rejects.toThrow(error.invalidPasswordMsg);
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(user.email);
        });
    });
});
