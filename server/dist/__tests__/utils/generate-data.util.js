"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
class GenerateMockData {
    static generateMockData = (changeArg, list, callback) => {
        return list.flatMap((u, i) => {
            let nextUser = list[i + 1];
            let nextUserId = nextUser ? nextUser.user_id : u.user_id;
            const args = changeArg
                ? [nextUserId, u.user_id]
                : [u.user_id, nextUserId];
            return callback(args[0], args[1]);
        });
    };
    static createUser = () => ({
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
    static createUserList = (count) => {
        return Array.from({ length: count }, this.createUser);
    };
    static createFollower = (follower_id, followed_id) => ({
        follower_id: follower_id,
        followed_id: followed_id,
        created_at: new Date(faker_1.faker.date.past().toISOString()),
    });
    static createRecentSearch = (user_id, search_user_id) => ({
        recent_id: faker_1.faker.number.int({ min: 1, max: 1000 }),
        user_id: user_id,
        search_user_id: search_user_id,
        created_at: new Date(faker_1.faker.date.past().toISOString()),
    });
    static createPost = (user_id) => ({
        post_id: faker_1.faker.number.int({ min: 1, max: 999 }),
        image_id: faker_1.faker.string.uuid(),
        image_url: faker_1.faker.image.url(),
        user_id: user_id,
        caption: faker_1.faker.lorem.text(),
        privacy_level: faker_1.faker.string.fromCharacters(["public", "private"]),
        created_at: new Date(faker_1.faker.date.past().toISOString()),
    });
    static createLike = (post_id, user_id) => ({
        post_id: post_id,
        user_id: user_id,
        created_at: new Date(faker_1.faker.date.past().toISOString()),
    });
}
;
exports.default = GenerateMockData;
