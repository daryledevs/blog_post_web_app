"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const user_service_impl_js_1 = __importDefault(require("@/service/user/user.service.impl.js"));
const user_repository_impl_js_1 = __importDefault(require("@/repository/user/user.repository.impl.js"));
const follow_repository_impl_js_1 = __importDefault(require("@/repository/follow/follow.repository.impl.js"));
const recent_search_repository_impl_js_1 = __importDefault(require("@/repository/recent search/recent-search.repository.impl.js"));
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
(0, vitest_1.describe)("UserService", () => {
    (0, vitest_1.test)("should create an instance of UserService", () => {
        const userService = new user_service_impl_js_1.default(new user_repository_impl_js_1.default(), new follow_repository_impl_js_1.default(), new recent_search_repository_impl_js_1.default());
        (0, vitest_1.expect)(userService).toBeInstanceOf(userService);
    });
});
