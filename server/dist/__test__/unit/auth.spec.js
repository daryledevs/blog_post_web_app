"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const auth_service_impl_1 = __importDefault(require("@/service/auth/auth.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repository/user/user.repository.impl"));
const auth_repository_impl_1 = __importDefault(require("@/repository/auth/auth.repository.impl"));
const vitest_1 = require("vitest");
const mockUser = () => ({
    user_id: faker_1.faker.number.int({ min: 1, max: 1000 }),
    username: faker_1.faker.internet.userName(),
    email: faker_1.faker.internet.email(),
    password: faker_1.faker.internet.password(),
    first_name: faker_1.faker.person.firstName(),
    last_name: faker_1.faker.person.lastName(),
    roles: faker_1.faker.string.fromCharacters(["admin", "user"]),
    age: faker_1.faker.number.int({ min: 18, max: 99 }),
    avatar_url: faker_1.faker.image.avatar(),
    birthday: faker_1.faker.date.past().toISOString(),
});
let users = Array.from({ length: 5 }, mockUser);
const newUser = mockUser();
const notFoundUser = mockUser();
const existingUser = users[0] || mockUser();
(0, vitest_1.beforeAll)(() => {
    vitest_1.vi.mock("@/repository/auth/auth.repository.impl", async (importOriginal) => {
        const original = await importOriginal();
        return {
            ...original,
            default: vitest_1.vi.fn().mockImplementation(() => ({
                createUser: vitest_1.vi.fn().mockImplementation((user) => users.push(user)),
            })),
        };
    });
    vitest_1.vi.mock("@/repository/user/user.repository.impl", async (importOriginal) => {
        const original = await importOriginal();
        return {
            ...original,
            default: vitest_1.vi.fn().mockImplementation(() => ({
                findUserById: vitest_1.vi.fn().mockImplementation((id) => {
                    return users.find((u) => u.user_id === id);
                }),
                findUserByUsername: vitest_1.vi
                    .fn()
                    .mockImplementation((username) => users.find((u) => u.username === username)),
                findUserByEmail: vitest_1.vi
                    .fn()
                    .mockImplementation((email) => users.find((u) => u.email === email)),
                searchUsersByQuery: vitest_1.vi
                    .fn()
                    .mockImplementation((query) => users.filter((u) => u.username.includes(query) ||
                    u.email.includes(query) ||
                    u.first_name.includes(query) ||
                    u.last_name.includes(query))),
                findUserByCredentials: vitest_1.vi
                    .fn()
                    .mockImplementation((userCredential) => users.find((u) => u.username === userCredential || u.email === userCredential)),
            })),
        };
    });
});
afterAll(() => {
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.describe)("AuthService", () => {
    const authRepository = new auth_repository_impl_1.default();
    const userRepository = new user_repository_impl_1.default();
    const authService = new auth_service_impl_1.default(authRepository, userRepository);
    (0, vitest_1.test)("Register should be successful", async () => {
        const result = await authService.register(newUser);
        (0, vitest_1.expect)(result).toBe("Registration is successful");
    });
    (0, vitest_1.describe)("Register should throw error", async () => {
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
    (0, vitest_1.test)("Login should be successful", async () => {
        const result = await authService.login(newUser.username, newUser.password);
        (0, vitest_1.expect)(result.message).toBe("Login successfully");
    });
    (0, vitest_1.describe)("Login should throw error", async () => {
        (0, vitest_1.test)("Login with either username and email from not existing user", async () => {
            await (0, vitest_1.expect)(authService.login(notFoundUser.username, notFoundUser.password)).rejects.toThrow("User not found");
            await (0, vitest_1.expect)(authService.login(notFoundUser.email, notFoundUser.password)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(notFoundUser.username);
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(notFoundUser.email);
        });
        (0, vitest_1.test)("Login with either username or email from existing user", async () => {
            await (0, vitest_1.expect)(authService.login(existingUser.username, faker_1.faker.internet.password())).rejects.toThrow("Invalid password");
            await (0, vitest_1.expect)(authService.login(existingUser.email, faker_1.faker.internet.password())).rejects.toThrow("Invalid password");
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(existingUser.username);
            (0, vitest_1.expect)(userRepository.findUserByCredentials).toHaveBeenCalledWith(existingUser.email);
        });
    });
});
