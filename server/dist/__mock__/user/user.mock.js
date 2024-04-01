"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserList = exports.createUser = void 0;
const faker_1 = require("@faker-js/faker");
const createUser = () => ({
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
    created_at: new Date(faker_1.faker.date.past().toISOString()),
});
exports.createUser = createUser;
const createUserList = (count) => {
    return Array.from({ length: count }, createUser);
};
exports.createUserList = createUserList;
