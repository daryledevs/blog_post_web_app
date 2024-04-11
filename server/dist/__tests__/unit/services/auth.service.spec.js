"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const faker_1 = require("@faker-js/faker");
const auth_service_impl_1 = __importDefault(require("@/services/auth/auth.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const auth_repository_impl_1 = __importDefault(require("@/repositories/auth/auth.repository.impl"));
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
let users = generate_data_util_1.default.createUserList(5);
const newUser = generate_data_util_1.default.createUser();
const notFoundUser = generate_data_util_1.default.createUser();
const existingUser = users[0];
vitest_1.vi.mock("@/repositories/auth/auth.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
            createUser: vitest_1.vi.fn().mockImplementation((user) => users.push(user)),
        })),
    };
});
vitest_1.vi.mock("@/repositories/user/user.repository.impl", async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vitest_1.vi.fn().mockImplementation(() => ({
            findUserById: vitest_1.vi.fn().mockImplementation((id) => {
                return users.find((u) => u.user_id === id);
            }),
            findUserByUsername: vitest_1.vi.fn().mockImplementation((username) => users.find((u) => u.username === username)),
            findUserByEmail: vitest_1.vi.fn().mockImplementation((email) => users.find((u) => u.email === email)),
            searchUsersByQuery: vitest_1.vi.fn().mockImplementation((query) => users.filter((u) => u.username.includes(query) ||
                u.email.includes(query) ||
                (u?.first_name && u.first_name.includes(query)) ||
                (u?.last_name && u.last_name.includes(query)))),
            findUserByCredentials: vitest_1.vi.fn().mockImplementation((userCredential) => users.find((u) => u.username === userCredential || u.email === userCredential)),
        })),
    };
});
(0, vitest_1.describe)("AuthService", () => {
    let authService;
    (0, vitest_1.beforeEach)(() => {
        authService = new auth_service_impl_1.default(new auth_repository_impl_1.default(), new user_repository_impl_1.default());
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("Register", async () => {
        (0, vitest_1.test)("Register should be successful", async () => {
            const result = await authService.register(newUser);
            (0, vitest_1.expect)(result).toBe("Registration is successful");
        });
        (0, vitest_1.test)("Register with empty fields", async () => {
            const user = { ...newUser, username: "", email: "", password: "" };
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow("All fields are required");
        });
        (0, vitest_1.test)("Register with password less than 6 characters", async () => {
            const user = { ...newUser, password: "12345" };
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow("Password must be at least 6 characters");
        });
        (0, vitest_1.test)("Register with existing username", async () => {
            const user = { ...existingUser, email: faker_1.faker.internet.email() };
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow("Username already exists");
        });
        (0, vitest_1.test)("Register with existing email", async () => {
            const user = { ...existingUser, username: faker_1.faker.internet.userName() };
            await (0, vitest_1.expect)(authService.register(user)).rejects.toThrow("Email already exists");
        });
    });
    (0, vitest_1.describe)("Login", async () => {
        (0, vitest_1.test)("Login should be successful", async () => {
            const result = await authService.login(newUser.username, newUser.password);
            (0, vitest_1.expect)(result.message).toBe("Login successfully");
            (0, vitest_1.expect)(result.token).toBeDefined();
            (0, vitest_1.expect)(result.refreshToken).toBeDefined();
        });
        (0, vitest_1.test)("Login with username from not existing user", async () => {
            const mockGetUserByUsername = vitest_1.vi.spyOn(authService, "login");
            mockGetUserByUsername.mockRejectedValue(error_exception_1.default.notFound("User not found"));
            await (0, vitest_1.expect)(authService.login(notFoundUser.username, notFoundUser.password)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledWith(notFoundUser.username, notFoundUser.password);
        });
        (0, vitest_1.test)("Login with email from not existing user", async () => {
            const mockGetUserByEmail = vitest_1.vi.spyOn(authService, "login");
            mockGetUserByEmail.mockRejectedValue(error_exception_1.default.notFound("User not found"));
            await (0, vitest_1.expect)(authService.login(notFoundUser.email, notFoundUser.password)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledWith(notFoundUser.email, notFoundUser.password);
        });
        (0, vitest_1.test)("Login with username from existing user", async () => {
            const mockGetUserByUsername = vitest_1.vi.spyOn(authService, "login");
            mockGetUserByUsername.mockRejectedValue(error_exception_1.default.badRequest("Invalid password"));
            const user = { ...existingUser, password: faker_1.faker.internet.password() };
            await (0, vitest_1.expect)(authService.login(user.username, user.password)).rejects.toThrow("Invalid password");
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(mockGetUserByUsername).toHaveBeenCalledWith(user.username, user.password);
        });
        (0, vitest_1.test)("Login with email from existing user", async () => {
            const mockGetUserByEmail = vitest_1.vi.spyOn(authService, "login");
            mockGetUserByEmail.mockRejectedValue(error_exception_1.default.badRequest("Invalid password"));
            const user = { ...existingUser, password: faker_1.faker.internet.password() };
            await (0, vitest_1.expect)(authService.login(user.email, user.password)).rejects.toThrow("Invalid password");
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(mockGetUserByEmail).toHaveBeenCalledWith(user.email, user.password);
        });
    });
});
