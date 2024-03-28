"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database/database"));
const kysely_1 = require("kysely");
const faker_1 = require("@faker-js/faker");
const auth_service_impl_1 = __importDefault(require("@/service/auth/auth.service.impl"));
const auth_repository_impl_1 = __importDefault(require("@/repository/auth/auth.repository.impl"));
const user_repository_impl_1 = __importDefault(require("@/repository/user/user.repository.impl"));
const vitest_1 = require("vitest");
let user = {
    username: faker_1.faker.internet.userName(),
    email: faker_1.faker.internet.email(),
    password: faker_1.faker.internet.password(),
    first_name: faker_1.faker.person.firstName(),
    last_name: faker_1.faker.person.lastName(),
    roles: faker_1.faker.string.fromCharacters(["admin", "user"]),
    age: faker_1.faker.number.int({ min: 18, max: 99 }),
    avatar_url: faker_1.faker.image.avatar(),
    birthday: faker_1.faker.date.past().toISOString(),
};
(0, vitest_1.describe)("AuthRepository", () => {
    const auth = new auth_service_impl_1.default(new auth_repository_impl_1.default(), new user_repository_impl_1.default());
    (0, vitest_1.afterEach)(async () => {
        await (0, kysely_1.sql) `SET FOREIGN_KEY_CHECKS = 0`.execute(database_1.default);
        await (0, kysely_1.sql) `TRUNCATE USERS`.execute(database_1.default);
        await (0, kysely_1.sql) `SET FOREIGN_KEY_CHECKS = 1`.execute(database_1.default);
    });
    (0, vitest_1.it)("should create a user and return the user data", async () => {
        const result = await auth.register(user);
        (0, vitest_1.expect)(result).toEqual(vitest_1.expect.objectContaining(user));
    });
});
